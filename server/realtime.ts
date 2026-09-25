import { Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { GoogleGenAI } from "@google/genai";

export function setupRealtime(server: Server) {
  const wss = new WebSocketServer({ server, path: "/ws/chat" });

  const geminiKey = process.env.GEMINI_API_KEY;
  const ai = geminiKey ? new GoogleGenAI({ apiKey: geminiKey }) : null;

  const fallbackResponse = (messages: any[]) => {
    const latest = String(messages?.[messages.length - 1]?.content ?? "").toLowerCase();
    if (latest.includes("recycl") || latest.includes("plastic")) {
      return "Rinse containers, keep recyclables dry, and check your local provider's rules. Batteries, electronics, and plastic bags usually need separate drop-off points.";
    }
    if (latest.includes("carbon") || latest.includes("footprint")) {
      return "Start with repeatable changes: use less energy, choose lower-carbon transport, reduce food waste, and buy fewer longer-lasting products.";
    }
    return "Try one repeatable swap this week, such as a reusable bottle, a food-waste-free meal, or an LED bulb. Tell me what you are working on and I can make the advice specific.";
  };

  wss.on("connection", (ws: WebSocket) => {
    ws.on("error", console.error);

    ws.on("message", async (data: Buffer) => {
      let chatMessages: any[] = [];
      try {
        const messageStr = data.toString();
        const payload = JSON.parse(messageStr);
        
        if (payload.type === "chat") {
          const { messages } = payload;
          chatMessages = messages;
          
          if (!ai) {
            ws.send(JSON.stringify({ type: "chunk", content: fallbackResponse(messages) }));
            ws.send(JSON.stringify({ type: "done" }));
            return;
          }

          // Format messages for Gemini
          const aiMessages = messages.map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          }));

          const responseStream = await ai.models.generateContentStream({
            model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
            contents: aiMessages,
            config: {
              systemInstruction: "You are an Eco Assistant for NatureCert, a platform dedicated to environmental sustainability, recycling, and climate action. Provide concise, helpful, and encouraging answers about eco-friendly practices. Keep responses under 3 paragraphs. You can provide tips specific to India or globally."
            }
          });

          for await (const chunk of responseStream) {
            const content = chunk.text || "";
            if (content) {
              ws.send(JSON.stringify({
                type: "chunk",
                content: content
              }));
            }
          }

          ws.send(JSON.stringify({ type: "done" }));
        }
      } catch (error: any) {
        console.error("WebSocket message error:", error);
        
        ws.send(JSON.stringify({ type: "chunk", content: fallbackResponse(chatMessages) }));
        ws.send(JSON.stringify({ type: "done" }));
      }
    });
  });

  return wss;
}

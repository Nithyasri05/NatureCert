import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertContactSubmissionSchema } from "@shared/schema";
import { setupAuth } from "./auth";
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

const requireAuth = (req: Request, res: Response, next: Function) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};

const fallbackChatResponse = (message: string) => {
  const normalized = message.toLowerCase();
  if (normalized.includes("batter") || normalized.includes("lithium") || normalized.includes("aa ") || normalized.includes("aaa")) {
    return "Do not rinse batteries or put them in household recycling. Keep batteries dry, tape the terminals of lithium batteries, and take them to a battery or e-waste collection point. If a battery is swollen, leaking, hot, or damaged, isolate it from flammable materials and contact a local hazardous-waste service for instructions.";
  }
  if (normalized.includes("recycl") || normalized.includes("plastic")) {
    return "Rinse containers, keep recyclable materials dry, and check your local provider's rules before placing anything in the bin. Plastic bags, batteries, and electronics usually need separate drop-off points.";
  }
  if (normalized.includes("food") && normalized.includes("waste")) {
    return "To reduce food waste, plan meals before shopping, make a list, and buy only what you expect to use. Store food correctly, label leftovers with dates, and keep older items visible so they are used first. Freeze extra portions before they spoil, and use vegetable trimmings in stock or soups when practical. Compost unavoidable scraps where local services or safe home composting are available.";
  }
  if (normalized.includes("carbon") || normalized.includes("footprint")) {
    return "Start with the actions you can repeat: use less energy, choose lower-carbon transport, reduce food waste, and buy fewer longer-lasting products. Small consistent changes matter more than one perfect choice.";
  }
  if (normalized.includes("water")) {
    return "Shorten showers, repair leaks, run full laundry loads, and reuse safe household water for plants. These habits reduce both water use and the energy needed to heat and move it.";
  }
  return "A practical place to start is one repeatable swap this week: carry a reusable bottle, plan a food-waste-free meal, or switch an often-used light to LED. Tell me what you are trying to change and I can make the advice more specific.";
};

const isEcoQuestion = (message: string) => /eco|sustain|recycl|waste|climate|carbon|energy|water|plastic|compost|biodivers|nature|green|food|transport|electric|solar|pollut|emission|renewab|conserv/i.test(message);

const generateChatResponse = async (messages: Array<{ role: "user" | "assistant"; content: string }>) => {
  const latestMessage = messages[messages.length - 1]?.content ?? "";
  if (!isEcoQuestion(latestMessage)) {
    return {
      content: "I am NatureCert's Eco Assistant. I can help with sustainability, recycling, climate, energy, waste, biodiversity, and eco-friendly everyday choices.",
      source: "scope",
    };
  }
  const systemInstruction = "You are NatureCert's Eco Assistant. Give accurate, practical sustainability and recycling advice. Keep answers under three short paragraphs, state when local rules vary, and never invent current statistics.";

  if (process.env.GEMINI_API_KEY) {
    try {
      const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await client.interactions.create({
        model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
        input: messages.map((message) => `${message.role === "assistant" ? "Assistant" : "User"}: ${message.content}`).join("\n"),
        system_instruction: systemInstruction,
        generation_config: { max_output_tokens: 1000 },
      });
      if (response.output_text?.trim()) return { content: response.output_text.trim(), source: "gemini" };
    } catch (error) {
      console.error("Gemini chat failed:", error);
    }
  }

  if (process.env.OPENAI_API_KEY) {
    try {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [{ role: "system", content: systemInstruction }, ...messages],
        temperature: 0.4,
        max_tokens: 1000,
      });
      const content = response.choices[0]?.message?.content?.trim();
      if (content) return { content, source: "openai" };
    } catch (error) {
      console.error("OpenAI chat failed:", error);
    }
  }

  return { content: fallbackChatResponse(latestMessage), source: "local" };
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes and middleware
  setupAuth(app);

  app.get("/api/tips", async (_req: Request, res: Response) => {
    try {
      res.json(await storage.getEcoTips());
    } catch (error) {
      console.error("Error fetching tips:", error);
      res.status(500).json({ message: "Failed to fetch tips" });
    }
  });

  app.post("/api/tips/:id/like", requireAuth, async (req: Request, res: Response) => {
    const tipId = Number(req.params.id);
    if (!Number.isInteger(tipId)) return res.status(400).json({ message: "Invalid tip ID" });
    try {
      await storage.likeEcoTip(req.user!.id, tipId);
      res.json({ likes: await storage.getEcoTipLikes(tipId), liked: true });
    } catch (error) {
      console.error("Error liking tip:", error);
      res.status(500).json({ message: "Failed to like tip" });
    }
  });

  app.delete("/api/tips/:id/like", requireAuth, async (req: Request, res: Response) => {
    const tipId = Number(req.params.id);
    if (!Number.isInteger(tipId)) return res.status(400).json({ message: "Invalid tip ID" });
    try {
      await storage.unlikeEcoTip(req.user!.id, tipId);
      res.json({ likes: await storage.getEcoTipLikes(tipId), liked: false });
    } catch (error) {
      console.error("Error unliking tip:", error);
      res.status(500).json({ message: "Failed to unlike tip" });
    }
  });

  app.post("/api/chat", async (req: Request, res: Response) => {
    const messageSchema = z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().trim().min(1).max(4000),
    });
    const bodySchema = z.object({ messages: z.array(messageSchema).min(1).max(20) });
    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Provide between 1 and 20 valid messages" });
    try {
      res.json(await generateChatResponse(parsed.data.messages));
    } catch (error) {
      console.error("Error generating chat response:", error);
      res.json({ content: fallbackChatResponse(parsed.data.messages.at(-1)?.content ?? ""), source: "local" });
    }
  });
  // Certifications endpoints
  app.get("/api/certifications", async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      const search = req.query.search as string | undefined;
      
      let certifications;
      
      if (search) {
        certifications = await storage.getCertificationsBySearch(search);
      } else if (category) {
        certifications = await storage.getCertificationsByCategory(category);
      } else {
        certifications = await storage.getCertifications();
      }
      
      res.json(certifications);
    } catch (error) {
      console.error("Error fetching certifications:", error);
      res.status(500).json({ message: "Failed to fetch certifications" });
    }
  });

  app.get("/api/certifications/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid certification ID" });
      }
      
      const certification = await storage.getCertification(id);
      
      if (!certification) {
        return res.status(404).json({ message: "Certification not found" });
      }
      
      res.json(certification);
    } catch (error) {
      console.error("Error fetching certification:", error);
      res.status(500).json({ message: "Failed to fetch certification" });
    }
  });

  // Resources endpoints
  app.get("/api/resources", async (req: Request, res: Response) => {
    try {
      const type = req.query.type as string | undefined;
      
      let resources;
      
      if (type) {
        resources = await storage.getResourcesByType(type);
      } else {
        resources = await storage.getResources();
      }
      
      res.json(resources);
    } catch (error) {
      console.error("Error fetching resources:", error);
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  app.get("/api/resources/videos", async (_req: Request, res: Response) => {
    try {
      const videos = await storage.getLiveVideoResources();
      res.setHeader("X-Resources-Source", videos.some((video) => video.id < 0) ? "live-feed" : "database-fallback");
      res.json(videos);
    } catch (error) {
      console.error("Error fetching educational videos:", error);
      res.status(500).json({ message: "Failed to fetch educational videos" });
    }
  });

  app.get("/api/resources/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid resource ID" });
      }
      
      const resource = await storage.getResource(id);
      
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }
      
      res.json(resource);
    } catch (error) {
      console.error("Error fetching resource:", error);
      res.status(500).json({ message: "Failed to fetch resource" });
    }
  });

  // Daily tip endpoint: returns today's tip, generating/storing it if missing
  app.get("/api/daily-tip", requireAuth, async (req: Request, res: Response) => {
    try {
      const date = req.query.date as string | undefined;
      const today = date ?? new Date().toISOString().split('T')[0];
      const refresh = req.query.refresh === "true";

      res.json(await storage.ensureDailyTip(today as string, refresh));
    } catch (error) {
      console.error('Error fetching daily tip:', error);
      res.status(500).json({ message: 'Failed to fetch daily tip' });
    }
  });

  // Contact form submission
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      
      const submission = await storage.createContactSubmission(validatedData);
      
      res.status(201).json({
        message: "Contact form submitted successfully",
        submission
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid form data", 
          errors: error.errors 
        });
      }
      
      console.error("Error submitting contact form:", error);
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  // Eco Challenges endpoints
  app.get("/api/challenges", async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      const challenges = category ? await storage.getEcoChallengesByCategory(category) : await storage.getEcoChallenges();
      res.json(challenges);
    } catch (error) {
      console.error("Error fetching challenges:", error);
      res.status(500).json({ message: "Failed to fetch challenges" });
    }
  });

  app.get("/api/challenges/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid challenge ID" });
      const challenge = await storage.getEcoChallenge(id);
      if (!challenge) return res.status(404).json({ message: "Challenge not found" });
      res.json(challenge);
    } catch (error) {
      console.error("Error fetching challenge:", error);
      res.status(500).json({ message: "Failed to fetch challenge" });
    }
  });

  app.post("/api/challenges/join", requireAuth, async (req: Request, res: Response) => {
    const parsed = z.object({ challengeId: z.coerce.number().int().positive() }).safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "A valid challengeId is required" });
    try {
      const challenge = await storage.getEcoChallenge(parsed.data.challengeId);
      if (!challenge) return res.status(404).json({ message: "Challenge not found" });
      res.status(201).json(await storage.joinEcoChallenge(req.user!.id, challenge.id));
    } catch (error) {
      console.error("Error joining challenge:", error);
      res.status(500).json({ message: "Failed to join challenge" });
    }
  });

  app.get("/api/me/challenges", requireAuth, async (req: Request, res: Response) => {
    try {
      res.json(await storage.getUserEcoChallenges(req.user!.id));
    } catch (error) {
      console.error("Error fetching user challenges:", error);
      res.status(500).json({ message: "Failed to fetch your challenges" });
    }
  });

  app.patch("/api/challenges/:id/progress", requireAuth, async (req: Request, res: Response) => {
    const challengeId = Number(req.params.id);
    const parsed = z.object({ progress: z.coerce.number().int().min(0).max(100) }).safeParse(req.body);
    if (!Number.isInteger(challengeId) || !parsed.success) return res.status(400).json({ message: "Invalid challenge progress" });
    try {
      const updated = parsed.data.progress === 100
        ? await storage.completeEcoChallenge(req.user!.id, challengeId)
        : await storage.updateEcoChallengeProgress(req.user!.id, challengeId, parsed.data.progress);
      if (!updated) return res.status(404).json({ message: "Challenge participation not found" });
      res.json(updated);
    } catch (error) {
      console.error("Error updating challenge progress:", error);
      res.status(500).json({ message: "Failed to update challenge progress" });
    }
  });

  // Eco Alternatives endpoints
  app.get("/api/alternatives", async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      const alternatives = category ? await storage.getEcoAlternativesByCategory(category) : await storage.getEcoAlternatives();
      res.json(alternatives);
    } catch (error) {
      console.error("Error fetching alternatives:", error);
      res.status(500).json({ message: "Failed to fetch alternatives" });
    }
  });

  // Green News endpoints
  app.get("/api/news", async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      const liveNews = await storage.getLiveGreenNews(category);
      const news = liveNews.length > 0
        ? liveNews
        : category
          ? await storage.getGreenNewsArticlesByCategory(category)
          : await storage.getGreenNewsArticles();
      res.setHeader("X-News-Source", liveNews.length > 0 ? "live-rss" : "database-fallback");
      res.json(news);
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  // Recycling endpoints
  app.get("/api/recycling/categories", async (req: Request, res: Response) => {
    try {
      const categories = await storage.getRecyclingCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching recycling categories:", error);
      res.status(500).json({ message: "Failed to fetch recycling categories" });
    }
  });

  app.get("/api/recycling/items", async (req: Request, res: Response) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string, 10) : undefined;
      const items = categoryId ? await storage.getRecyclingItemsByCategory(categoryId) : await storage.getRecyclingItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching recycling items:", error);
      res.status(500).json({ message: "Failed to fetch recycling items" });
    }
  });

  app.get("/api/recycling", async (_req: Request, res: Response) => {
    try {
      const [categories, items] = await Promise.all([
        storage.getRecyclingCategories(),
        storage.getRecyclingItems(),
      ]);
      res.json(categories.map((category) => ({
        ...category,
        items: items.filter((item) => item.categoryId === category.id),
      })));
    } catch (error) {
      console.error("Error fetching recycling guide:", error);
      res.status(500).json({ message: "Failed to fetch recycling guide" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

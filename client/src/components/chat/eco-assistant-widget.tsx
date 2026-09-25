import { useEffect, useRef, useState } from 'react';
import { Leaf, MessageCircle, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const welcomeMessage: ChatMessage = {
  role: 'assistant',
  content: 'Hi, I am NatureCert\'s Eco Assistant. Ask me about recycling, lower-waste habits, climate, energy, or sustainable choices.',
};

const suggestions = [
  'How do I recycle batteries?',
  'How can I reduce food waste?',
  'What is a lower-carbon commute?',
];

export default function EcoAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  useEffect(() => {
    const openAssistant = () => setIsOpen(true);
    window.addEventListener('openEcoAssistant', openAssistant);
    return () => window.removeEventListener('openEcoAssistant', openAssistant);
  }, []);

  const sendMessage = async (message = input) => {
    const content = message.trim();
    if (!content || isSending) return;
    const nextMessages = [...messages, { role: 'user' as const, content }];
    setMessages(nextMessages);
    setInput('');
    setIsSending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      });
      if (!response.ok) throw new Error('Chat request failed');
      const result = await response.json();
      setMessages((current) => [...current, { role: 'assistant', content: result.content }]);
    } catch (error) {
      setMessages((current) => [...current, {
        role: 'assistant',
        content: 'I could not reach the assistant right now. Please try again in a moment.',
      }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[60]">
      {isOpen && (
        <section className="mb-3 flex h-[min(560px,calc(100vh-7rem))] w-[min(390px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-green-200 bg-white shadow-2xl" aria-label="Eco Assistant">
          <div className="flex items-center justify-between bg-primary px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              <div>
                <p className="font-semibold">Eco Assistant</p>
                <p className="text-xs text-white/80">Sustainability guidance</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/15 hover:text-white" onClick={() => setIsOpen(false)} aria-label="Close Eco Assistant">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="chat-scrollbar flex-1 space-y-3 overflow-y-auto bg-neutral-50 p-3">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <p className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${message.role === 'user' ? 'bg-primary text-white' : 'bg-white text-neutral-700 shadow-sm'}`}>
                  {message.content}
                </p>
              </div>
            ))}
            {messages.length === 1 && (
              <div className="space-y-2 pt-1">
                <p className="text-xs text-neutral-500">Try a quick question:</p>
                {suggestions.map((suggestion) => (
                  <button key={suggestion} type="button" onClick={() => sendMessage(suggestion)} className="block w-full rounded-lg border border-green-100 bg-white px-3 py-2 text-left text-xs text-primary hover:bg-green-50">
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            {isSending && <p className="text-xs text-neutral-500">Thinking about that...</p>}
            <div ref={messagesEndRef} />
          </div>

          <form className="border-t bg-white p-3" onSubmit={(event) => { event.preventDefault(); void sendMessage(); }}>
            <div className="flex items-end gap-2">
              <Textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    void sendMessage();
                  }
                }}
                placeholder="Ask an eco question..."
                className="min-h-[44px] resize-none"
                rows={2}
                disabled={isSending}
              />
              <Button type="submit" size="icon" disabled={isSending || !input.trim()} aria-label="Send eco question">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </section>
      )}

      <Button onClick={() => setIsOpen((current) => !current)} className="h-14 w-14 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90" size="icon" aria-label={isOpen ? 'Close Eco Assistant' : 'Open Eco Assistant'}>
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>
    </div>
  );
}
import { useState, useRef, useEffect } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Send, 
  Mic, 
  MicOff, 
  Image as ImageIcon, 
  Leaf, 
  Share2, 
  Trash2, 
  X,
  Download,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RotateCcw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Define types for messages
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  media?: {
    type: 'image';
    url: string;
  };
}

export default function EcoChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your Eco Assistant. Ask me anything about environmental sustainability, recycling, eco-friendly practices, or climate change.',
      timestamp: new Date()
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle message submission
  const handleSubmit = async () => {
    if (!input.trim() && !selectedImage) return;
    
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      ...(selectedImage && {
        media: {
          type: 'image',
          url: URL.createObjectURL(selectedImage)
        }
      })
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setSelectedImage(null);
    setIsTyping(true);
    
    // Simulate AI response (would be replaced with actual API call)
    setTimeout(() => {
      const responses = [
        "Based on current research, one of the most effective individual actions to reduce carbon footprint is adopting a plant-based diet or significantly reducing meat consumption, particularly beef and lamb.",
        "To reduce plastic waste at home, try using reusable containers, buying in bulk, using bar soap instead of liquid soap in plastic dispensers, and using reusable shopping bags.",
        "Electronic waste (e-waste) should never go in regular trash. Look for dedicated e-waste recycling centers in your area, or check if your local electronics retailers offer take-back programs.",
        "The term 'carbon neutral' means that any CO2 released into the atmosphere from a company's activities is balanced by an equivalent amount being removed.",
        "To conserve water at home, fix leaky faucets, take shorter showers, install water-efficient fixtures, only run full loads of laundry and dishes, and collect rainwater for gardening."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const newAssistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: randomResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newAssistantMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      setSelectedImage(files[0]);
      toast({
        title: "Image attached",
        description: "You can now submit your question with the image.",
      });
    }
  };
  
  // Handle recording toggle
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      toast({
        title: "Recording stopped",
        description: "Speech to text conversion would happen here.",
      });
    } else {
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone...",
      });
      
      // Simulate speech recognition after 3 seconds
      setTimeout(() => {
        setIsRecording(false);
        setInput(prev => prev + "How can I reduce my carbon footprint at home?");
        toast({
          title: "Speech recognized",
          description: "Text added to input field.",
        });
      }, 3000);
    }
  };
  
  // Handle image removal
  const removeImage = () => {
    setSelectedImage(null);
  };
  
  // Handle theme toggle
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };
  
  // Clear conversation
  const clearConversation = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Hello! I\'m your Eco Assistant. Ask me anything about environmental sustainability, recycling, eco-friendly practices, or climate change.',
        timestamp: new Date()
      }
    ]);
    setInput('');
    setSelectedImage(null);
  };
  
  // Share conversation
  const shareConversation = () => {
    const conversationText = messages
      .map(msg => `${msg.role === 'user' ? 'You' : 'Eco Assistant'}: ${msg.content}`)
      .join('\n\n');
    
    navigator.clipboard.writeText(conversationText).then(() => {
      toast({
        title: "Conversation copied",
        description: "You can now paste and share it anywhere.",
      });
    });
  };
  
  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className={isDarkTheme ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-neutral-900 dark:text-neutral-100">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Eco Assistant</h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                Your AI guide to environmental questions
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="dark-mode" className="text-sm">Dark mode</Label>
                <Switch
                  id="dark-mode"
                  checked={isDarkTheme}
                  onCheckedChange={toggleTheme}
                />
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={clearConversation}
                      className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Clear conversation</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <div className="border dark:border-gray-700 rounded-lg mb-4 overflow-hidden">
            <div className="h-[500px] overflow-y-auto p-4 space-y-4 bg-neutral-50 dark:bg-gray-800">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-neutral-200 dark:bg-gray-700'
                    }`}
                  >
                    {message.media && (
                      <div className="mb-3">
                        <img
                          src={message.media.url}
                          alt="User uploaded"
                          className="max-h-48 rounded-md"
                        />
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <div className="mt-2 text-xs opacity-70 flex justify-end">
                      {formatTime(message.timestamp)}
                    </div>
                    
                    {message.role === 'assistant' && (
                      <div className="mt-3 pt-2 border-t border-neutral-300 dark:border-gray-600 flex items-center justify-between">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <ThumbsUp className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <ThumbsDown className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          <RotateCcw className="h-3.5 w-3.5 mr-1" />
                          Regenerate
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-4 bg-neutral-200 dark:bg-gray-700">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-neutral-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-neutral-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-neutral-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-850">
              {selectedImage && (
                <div className="mb-3 relative inline-block">
                  <img 
                    src={URL.createObjectURL(selectedImage)} 
                    alt="Selected" 
                    className="h-16 rounded-md border dark:border-gray-700"
                  />
                  <button 
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    onClick={removeImage}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              
              <div className="flex items-end gap-2">
                <Textarea
                  placeholder="Ask about environmental topics..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  className="min-h-[80px] bg-white dark:bg-gray-800 border-neutral-200 dark:border-gray-700"
                />
                <div className="flex flex-col space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => fileInputRef.current?.click()}
                          className="dark:border-gray-700 dark:text-neutral-300"
                        >
                          <ImageIcon className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Upload image</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={isRecording ? "destructive" : "outline"}
                          size="icon"
                          onClick={toggleRecording}
                          className={!isRecording ? "dark:border-gray-700 dark:text-neutral-300" : ""}
                        >
                          {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{isRecording ? "Stop recording" : "Voice input"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <Button
                    onClick={handleSubmit}
                    size="icon"
                    variant="default"
                    disabled={!input.trim() && !selectedImage}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-sm text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center">
              <Leaf className="h-4 w-4 mr-1 text-green-500" />
              <span>Powered by sustainable AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={shareConversation}
                className="flex items-center hover:text-neutral-700 dark:hover:text-neutral-300"
              >
                <Share2 className="h-4 w-4 mr-1" />
                <span>Share</span>
              </button>
              <button
                onClick={() => {
                  toast({
                    title: "Conversation saved",
                    description: "Download would start in a real implementation.",
                  });
                }}
                className="flex items-center hover:text-neutral-700 dark:hover:text-neutral-300"
              >
                <Download className="h-4 w-4 mr-1" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
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
    
    // Enhanced India-specific environmental responses
    setTimeout(() => {
      // India-specific environmental knowledge base
      const indiaEcoResponses: {[key: string]: string[]} = {
        'recycling': [
          "In India, proper waste segregation is essential. Divide your waste into wet waste (food scraps), dry waste (paper, plastic), and hazardous waste (batteries, chemicals). Many Indian cities now have door-to-door segregated waste collection.",
          "E-waste recycling in India is regulated under the E-Waste Management Rules. You can deposit e-waste at authorized collection centers managed by manufacturers or retailers. Companies like Attero and Ecoreco offer e-waste recycling services across major Indian cities.",
          "For plastic recycling in India, look for the BIS (Bureau of Indian Standards) recycling codes on plastic products. PET bottles (code 1) are highly recyclable in India and have a strong recycling infrastructure in most cities."
        ],
        'water': [
          "Water conservation is crucial in India. Consider installing a rainwater harvesting system, which is now mandatory for new buildings in many Indian states including Tamil Nadu, Karnataka, and Maharashtra.",
          "To save water in Indian households, use bucket baths instead of showers when possible, which can save up to 80% of water. Also, consider installing low-flow taps and dual-flush toilets.",
          "In India, you can reuse greywater from kitchen and laundry for watering plants. Simple filtering systems using natural materials like sand and charcoal are effective and affordable."
        ],
        'energy': [
          "Solar power is highly viable in India with 300+ sunny days annually. The government offers subsidies up to 40% for rooftop solar installations through the Ministry of New and Renewable Energy (MNRE) schemes.",
          "For Indian homes, replacing regular lights with LED bulbs can reduce electricity consumption by 80%. The government's UJALA scheme offers LED bulbs at subsidized rates.",
          "During hot Indian summers, setting your AC to 24-26°C instead of 18-20°C can reduce electricity consumption by up to 30%. Using ceiling fans alongside can help maintain comfort while saving energy."
        ],
        'agriculture': [
          "Organic farming is growing in India. Look for products with the 'India Organic' certification logo issued by APEDA (Agricultural and Processed Food Products Export Development Authority).",
          "Traditional Indian agricultural practices like mixed cropping and using neem as a natural pesticide are sustainable alternatives to chemical-intensive farming.",
          "Urban farming is gaining popularity in Indian cities. Terrace gardens and vertical farming using hydroponic systems are suitable for growing vegetables in limited spaces in urban areas."
        ],
        'pollution': [
          "To combat air pollution in Indian cities, consider using public transport, carpooling, or electric vehicles. The government offers incentives under the FAME II scheme for electric vehicle purchases.",
          "During high pollution days in North Indian cities, use N95 or N99 masks which filter out PM2.5 particles. Indoor air purifiers with HEPA filters are effective for home use.",
          "Noise pollution in Indian urban areas often exceeds permissible limits. You can report noise pollution violations to your local Pollution Control Board or municipal corporation."
        ],
        'climate': [
          "India has committed to achieving net-zero carbon emissions by 2070 and generating 50% of its electricity from renewable sources by 2030 under its updated NDC (Nationally Determined Contribution).",
          "Climate change is affecting Indian monsoon patterns, with more extreme rainfall events. Rainwater harvesting and flood-resistant architecture are becoming increasingly important.",
          "Heat waves in India are becoming more frequent and intense due to climate change. Traditional building designs with thick walls, small windows, and interior courtyards provide natural cooling."
        ],
        'alternatives': [
          "In India, traditional alternatives like steel or copper vessels instead of plastic, cloth bags (jholas) instead of plastic bags, and clay pots for water storage are sustainable and culturally rooted options.",
          "Bamboo products are excellent eco-friendly alternatives in India. Bamboo grows abundantly across the country and is being used for everything from toothbrushes and straws to furniture and construction.",
          "For sustainable fashion in India, look for brands using khadi, organic cotton, and natural dyes. Traditional textile arts like block printing and ikat use less water and energy than modern manufacturing."
        ],
        'default': [
          "In India, the Ministry of Environment, Forest and Climate Change (MoEFCC) oversees environmental regulations and initiatives. Their website offers resources on various environmental programs and policies.",
          "The Indian government's Swachh Bharat Mission focuses on waste management and cleanliness. You can participate through community clean-up drives and by practicing proper waste disposal.",
          "Environmental NGOs like Centre for Science and Environment (CSE), TERI, and Greenpeace India offer resources and volunteer opportunities for those interested in environmental conservation.",
          "India's biodiversity includes over 45,000 plant species and 91,000 animal species. Protected areas like national parks and wildlife sanctuaries cover about 5% of India's geographical area.",
          "India's National Action Plan on Climate Change (NAPCC) has eight missions addressing different aspects of climate change mitigation and adaptation, including solar energy, water, and sustainable agriculture."
        ]
      };
      
      // Analyze input to determine relevant category
      const input = messages[messages.length-1].content.toLowerCase();
      let category = 'default';
      
      if (input.includes('recycle') || input.includes('waste') || input.includes('plastic') || input.includes('garbage') || input.includes('trash') || input.includes('e-waste')) {
        category = 'recycling';
      } else if (input.includes('water') || input.includes('rain') || input.includes('river') || input.includes('conservation')) {
        category = 'water';
      } else if (input.includes('electricity') || input.includes('power') || input.includes('energy') || input.includes('solar') || input.includes('bill')) {
        category = 'energy';
      } else if (input.includes('farm') || input.includes('agriculture') || input.includes('organic') || input.includes('food') || input.includes('crop')) {
        category = 'agriculture';
      } else if (input.includes('pollution') || input.includes('air quality') || input.includes('smog') || input.includes('noise')) {
        category = 'pollution';
      } else if (input.includes('climate') || input.includes('global warming') || input.includes('temperature') || input.includes('weather')) {
        category = 'climate';
      } else if (input.includes('alternative') || input.includes('substitute') || input.includes('instead of') || input.includes('replace')) {
        category = 'alternatives';
      }
      
      // Select a relevant response from the appropriate category
      const relevantResponses = indiaEcoResponses[category];
      const response = relevantResponses[Math.floor(Math.random() * relevantResponses.length)];
      
      const newAssistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response,
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
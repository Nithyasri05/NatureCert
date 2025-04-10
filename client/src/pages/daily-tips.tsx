import { useState } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Leaf, ThumbsUp, MessageCircle, Share2 } from 'lucide-react';

interface EcoTip {
  id: number;
  title: string;
  description: string;
  category: string;
  likes: number;
  comments: number;
  image?: string;
}

export default function DailyTips() {
  const [likedTips, setLikedTips] = useState<Set<number>>(new Set());
  
  const tips: EcoTip[] = [
    {
      id: 1,
      title: "Use Reusable Water Bottles",
      description: "Switch to a reusable water bottle instead of buying single-use plastic bottles. This can save hundreds of plastic bottles per year.",
      category: "Reduce Waste",
      likes: 543,
      comments: 32
    },
    {
      id: 2,
      title: "Start Composting Food Scraps",
      description: "Composting food scraps can reduce your household waste by up to 30% while creating nutrient-rich soil for your garden.",
      category: "Food & Garden",
      likes: 421,
      comments: 45
    },
    {
      id: 3,
      title: "Switch to LED Light Bulbs",
      description: "LED bulbs use up to 90% less energy than incandescent bulbs and last up to 25 times longer, saving both energy and money.",
      category: "Energy Saving",
      likes: 387,
      comments: 28
    },
    {
      id: 4,
      title: "Use Cold Water for Laundry",
      description: "Washing clothes in cold water gets them just as clean as hot water but uses much less energy. 90% of energy used in washing machines goes to heating water.",
      category: "Energy Saving",
      likes: 326,
      comments: 19
    },
    {
      id: 5,
      title: "Plant Native Species",
      description: "Native plants require less water, fertilizer, and maintenance while providing habitat for local wildlife and pollinators.",
      category: "Biodiversity",
      likes: 482,
      comments: 37
    },
    {
      id: 6,
      title: "Unplug Electronics When Not in Use",
      description: "Even when turned off, many electronics continue to draw power. Unplug them completely to eliminate this 'phantom power' usage.",
      category: "Energy Saving",
      likes: 293,
      comments: 21
    }
  ];
  
  const handleLike = (tipId: number) => {
    setLikedTips(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(tipId)) {
        newLiked.delete(tipId);
      } else {
        newLiked.add(tipId);
      }
      return newLiked;
    });
  };
  
  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">Daily Eco Tips</h1>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Simple daily actions that can help you live more sustainably and reduce your environmental footprint.
          </p>
        </div>
        
        <div className="mb-8 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 rounded-full p-3">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-800 mb-2">Today's Featured Tip</h2>
              <p className="text-neutral-700">
                Try a "Meatless Monday" to reduce your carbon footprint. Livestock production generates nearly 15% of global greenhouse gas emissions. Even going meatless one day a week can make a difference!
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip) => (
            <Card key={tip.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                      {tip.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{tip.title}</h3>
                  <p className="text-neutral-600 mb-4">{tip.description}</p>
                  
                  <div className="flex justify-between items-center border-t pt-4">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={likedTips.has(tip.id) ? "text-primary" : "text-neutral-500"}
                      onClick={() => handleLike(tip.id)}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      <span>{likedTips.has(tip.id) ? tip.likes + 1 : tip.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-neutral-500">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      <span>{tip.comments}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-neutral-500">
                      <Share2 className="h-4 w-4 mr-1" />
                      <span>Share</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Button variant="outline" className="px-8">
            Load More Tips
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
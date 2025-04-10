import { useState } from 'react';
import { useLocation } from 'wouter';
import { Leaf, Droplet, Newspaper, Recycle, Trophy, MessageCircle, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface EcoFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  color: string;
}

export default function EcoFeaturesSection() {
  const [, setLocation] = useLocation();
  
  const ecoFeatures: EcoFeature[] = [
    {
      id: 'daily-tips',
      title: 'Daily Eco Tips',
      description: 'Discover simple daily actions to make a positive environmental impact.',
      icon: <Leaf className="h-8 w-8" />,
      link: '/daily-tips',
      color: 'bg-green-100 text-green-700'
    },
    {
      id: 'eco-alternatives',
      title: 'Eco-Friendly Alternatives',
      description: 'Find sustainable alternatives to common everyday products.',
      icon: <Droplet className="h-8 w-8" />,
      link: '/eco-alternatives',
      color: 'bg-blue-100 text-blue-700'
    },
    {
      id: 'green-news',
      title: 'Green News',
      description: 'Stay updated with the latest environmental news and developments.',
      icon: <Newspaper className="h-8 w-8" />,
      link: '/green-news',
      color: 'bg-teal-100 text-teal-700'
    },
    {
      id: 'recycling-guide',
      title: 'Recycling Guide',
      description: 'Learn how to recycle effectively with our step-by-step guides.',
      icon: <Recycle className="h-8 w-8" />,
      link: '/recycling-guide',
      color: 'bg-amber-100 text-amber-700'
    },
    {
      id: 'carbon-footprint',
      title: 'Carbon Footprint',
      description: 'Calculate your personal carbon footprint and get tips to reduce your impact.',
      icon: <BarChart className="h-8 w-8" />,
      link: '/carbon-footprint',
      color: 'bg-red-100 text-red-700'
    },
    {
      id: 'eco-challenges',
      title: 'Eco Challenges',
      description: 'Take on environmental challenges and track your positive impact.',
      icon: <Trophy className="h-8 w-8" />,
      link: '/eco-challenges',
      color: 'bg-purple-100 text-purple-700'
    },
    {
      id: 'eco-chatbot',
      title: 'Eco Chatbot',
      description: 'Get answers to your environmental questions from our AI assistant.',
      icon: <MessageCircle className="h-8 w-8" />,
      link: '/eco-chatbot',
      color: 'bg-gray-900 text-white'
    }
  ];

  const navigateTo = (path: string) => {
    setLocation(path);
  };

  return (
    <section className="py-12 md:py-16 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-neutral-800 mb-4">Eco Features</h2>
          <p className="text-neutral-600 max-w-3xl mx-auto">
            Explore our range of features designed to help you live a more environmentally-friendly lifestyle.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ecoFeatures.map((feature) => (
            <Card 
              key={feature.id} 
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent className="p-0">
                <div className={`${feature.color} p-6`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="opacity-90">{feature.description}</p>
                    </div>
                    <div className="ml-4">
                      {feature.icon}
                    </div>
                  </div>
                </div>
                <div className="p-4 flex justify-end">
                  <Button 
                    variant="ghost" 
                    onClick={() => navigateTo(feature.link)}
                    className="text-primary hover:text-primary-dark"
                  >
                    Explore
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
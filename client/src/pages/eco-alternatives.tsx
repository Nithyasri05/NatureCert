import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Star, ShoppingBag, ExternalLink } from 'lucide-react';

interface EcoAlternative {
  id: number;
  name: string;
  description: string;
  category: string;
  rating: number;
  price: string;
  benefits: string[];
  image?: string;
}

export default function EcoAlternatives() {
  const alternatives: EcoAlternative[] = [
    {
      id: 1,
      name: "Bamboo Toothbrush",
      description: "Replace plastic toothbrushes with biodegradable bamboo alternatives to reduce plastic waste.",
      category: "Bathroom",
      rating: 4.5,
      price: "$",
      benefits: ["Biodegradable handle", "Plastic-free packaging", "Naturally antimicrobial"]
    },
    {
      id: 2,
      name: "Beeswax Food Wraps",
      description: "Reusable alternative to plastic wrap made from cotton infused with beeswax, jojoba oil, and tree resin.",
      category: "Kitchen",
      rating: 4.7,
      price: "$$",
      benefits: ["Reusable for up to a year", "Washable", "Biodegradable"]
    },
    {
      id: 3,
      name: "Wool Dryer Balls",
      description: "Replace single-use dryer sheets with wool dryer balls to reduce waste and energy consumption.",
      category: "Laundry",
      rating: 4.3,
      price: "$$",
      benefits: ["Reduces drying time", "No chemicals", "Lasts for 1000+ loads"]
    },
    {
      id: 4,
      name: "Stainless Steel Water Bottle",
      description: "Durable replacement for disposable plastic water bottles that keeps drinks cold or hot.",
      category: "On the Go",
      rating: 4.8,
      price: "$$",
      benefits: ["Eliminates plastic waste", "Doesn't leach chemicals", "Lasts for years"]
    },
    {
      id: 5,
      name: "Silicone Food Storage Bags",
      description: "Reusable silicone bags that replace single-use plastic sandwich and storage bags.",
      category: "Kitchen",
      rating: 4.4,
      price: "$$",
      benefits: ["Dishwasher safe", "Freezer safe", "Leak-proof"]
    },
    {
      id: 6,
      name: "Biodegradable Phone Case",
      description: "Phone cases made from plant-based materials that will biodegrade at end of life.",
      category: "Technology",
      rating: 4.2,
      price: "$$",
      benefits: ["Compostable", "Protective", "Sustainable materials"]
    },
    {
      id: 7,
      name: "Reusable Cotton Rounds",
      description: "Washable cotton pads for makeup removal and skincare that replace disposable cotton pads.",
      category: "Bathroom",
      rating: 4.6,
      price: "$",
      benefits: ["Machine washable", "Soft on skin", "Zero waste"]
    },
    {
      id: 8,
      name: "Solar Power Bank",
      description: "Portable phone charger that can be recharged using solar energy.",
      category: "Technology",
      rating: 4.1,
      price: "$$$",
      benefits: ["Renewable energy", "Portable", "Emergency ready"]
    }
  ];
  
  const categories = [...new Set(alternatives.map(item => item.category))];
  
  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="h-4 w-4 text-yellow-400" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-yellow-400" />);
    }
    
    return stars;
  };
  
  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">Eco-Friendly Alternatives</h1>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Sustainable swaps for everyday products to help reduce your environmental footprint.
          </p>
        </div>
        
        <Tabs defaultValue="all" className="mb-12">
          <TabsList className="mb-8 flex flex-wrap justify-center">
            <TabsTrigger value="all">All Products</TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {alternatives.map(alt => (
              <Card key={alt.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold">{alt.name}</h3>
                    <span className="text-green-700 font-bold">{alt.price}</span>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    {renderRatingStars(alt.rating)}
                    <span className="text-sm text-neutral-500 ml-2">{alt.rating.toFixed(1)}</span>
                  </div>
                  
                  <p className="text-neutral-600 mb-4">{alt.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Benefits:</h4>
                    <ul className="space-y-1">
                      {alt.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center text-sm text-neutral-600">
                          <span className="mr-2 text-green-500">•</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex justify-between mt-4 pt-4 border-t border-neutral-100">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Learn More
                    </Button>
                    <Button variant="default" size="sm">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Shop Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          {categories.map(category => (
            <TabsContent 
              key={category} 
              value={category}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {alternatives
                .filter(alt => alt.category === category)
                .map(alt => (
                  <Card key={alt.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold">{alt.name}</h3>
                        <span className="text-green-700 font-bold">{alt.price}</span>
                      </div>
                      
                      <div className="flex items-center mb-3">
                        {renderRatingStars(alt.rating)}
                        <span className="text-sm text-neutral-500 ml-2">{alt.rating.toFixed(1)}</span>
                      </div>
                      
                      <p className="text-neutral-600 mb-4">{alt.description}</p>
                      
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Benefits:</h4>
                        <ul className="space-y-1">
                          {alt.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-center text-sm text-neutral-600">
                              <span className="mr-2 text-green-500">•</span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex justify-between mt-4 pt-4 border-t border-neutral-100">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Learn More
                        </Button>
                        <Button variant="default" size="sm">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          Shop Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>
          ))}
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
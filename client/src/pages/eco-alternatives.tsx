import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Star, ExternalLink, BadgeInfo, Calendar, ArrowRight, RefreshCcw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface EcoAlternative {
  id: number;
  name: string;
  description: string;
  category: string;
  rating: number;
  benefits: string[];
  detailedDescription?: string;
  whenToUse?: string[];
  environmentalImpact?: string;
  isNew?: boolean;
  addedDate?: string;
  image?: string;
}

export default function EcoAlternatives() {
  const [selectedAlternative, setSelectedAlternative] = useState<EcoAlternative | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [lastCheckedDate, setLastCheckedDate] = useState<string | null>(null);
  const { toast } = useToast();

  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  
  // This would ideally be fetched from an API with the date of the latest update
  const latestUpdateDate = "April 10, 2025";
  
  // Feature to show "New" badge for items added in the last 7 days
  // In a real app, you would compare actual dates
  const isRecentlyAdded = (date: string) => {
    return date === latestUpdateDate;
  };

  useEffect(() => {
    // Check if user already viewed today's alternatives
    const storedDate = localStorage.getItem('lastCheckedAlternatives');
    setLastCheckedDate(storedDate);
    
    // Check if user is subscribed to daily updates
    const subscriptionStatus = localStorage.getItem('alternativesSubscription');
    setIsSubscribed(subscriptionStatus === 'true');
  }, []);

  const markAsChecked = () => {
    localStorage.setItem('lastCheckedAlternatives', today);
    setLastCheckedDate(today);
    toast({
      title: "All caught up!",
      description: "You've viewed the latest eco alternatives.",
    });
  };

  const toggleSubscription = () => {
    const newStatus = !isSubscribed;
    setIsSubscribed(newStatus);
    localStorage.setItem('alternativesSubscription', newStatus.toString());
    
    toast({
      title: newStatus ? "Subscribed to Daily Updates" : "Unsubscribed from Daily Updates",
      description: newStatus 
        ? "You'll be notified when new eco alternatives are added." 
        : "You won't receive notifications about new eco alternatives.",
    });
  };
  
  const alternatives: EcoAlternative[] = [
    {
      id: 1,
      name: "Bamboo Toothbrush",
      description: "Replace plastic toothbrushes with biodegradable bamboo alternatives to reduce plastic waste.",
      category: "Bathroom",
      rating: 4.5,
      benefits: ["Biodegradable handle", "Plastic-free packaging", "Naturally antimicrobial"],
      detailedDescription: "Traditional plastic toothbrushes contribute significantly to plastic pollution, with over 1 billion discarded annually in the US alone. Bamboo toothbrushes offer a sustainable alternative with handles made from biodegradable bamboo, a rapidly renewable resource that grows up to 91 cm per day. The bristles are typically made from nylon-4, which biodegrades faster than conventional plastics, though fully biodegradable plant-based bristle options are now emerging.",
      whenToUse: [
        "Replace your toothbrush every 3-4 months as recommended by dentists",
        "Look for options with compostable packaging",
        "To dispose, remove the bristles (if not biodegradable) and compost the handle"
      ],
      environmentalImpact: "Switching to bamboo toothbrushes can prevent approximately 4 plastic toothbrushes per person from entering landfills and oceans each year. When multiplied across a population, this creates significant positive environmental impact."
    },
    {
      id: 2,
      name: "Beeswax Food Wraps",
      description: "Reusable alternative to plastic wrap made from cotton infused with beeswax, jojoba oil, and tree resin.",
      category: "Kitchen",
      rating: 4.7,
      benefits: ["Reusable for up to a year", "Washable", "Biodegradable"],
      detailedDescription: "Beeswax food wraps are a natural, reusable alternative to plastic cling film and aluminum foil. Made from cotton fabric coated with a mixture of beeswax, jojoba oil, and tree resin, these wraps create a breathable, malleable covering that preserves food freshness. The wax and oils create a natural seal when warmed with your hands, and the breathable nature of the wrap allows food to stay fresh longer than in airtight plastic wrap.",
      whenToUse: [
        "For wrapping cheese, vegetables, fruits, bread, and covering bowls",
        "Avoid using with raw meat, fish, or hot foods that can melt the wax",
        "Clean with cool water and mild soap, then air dry"
      ],
      environmentalImpact: "The average household uses 24 rolls of plastic wrap annually. Switching to beeswax wraps eliminates this waste while providing a product that is fully compostable at the end of its life cycle (typically 6-12 months with proper care)."
    },
    {
      id: 3,
      name: "Wool Dryer Balls",
      description: "Replace single-use dryer sheets with wool dryer balls to reduce waste and energy consumption.",
      category: "Laundry",
      rating: 4.3,
      benefits: ["Reduces drying time", "No chemicals", "Lasts for 1000+ loads"],
      detailedDescription: "Wool dryer balls are dense balls of felted wool that separate clothes in the dryer, allowing hot air to circulate more efficiently. They naturally soften fabric without chemicals and reduce static. Each ball can last for over 1,000 loads, replacing hundreds of single-use dryer sheets that contain synthetic fragrances and chemicals that can irritate sensitive skin.",
      whenToUse: [
        "Use 3-6 balls per load depending on size",
        "Add a few drops of essential oil for natural fragrance if desired",
        "Store in a breathable container between uses"
      ],
      environmentalImpact: "Dryer balls can reduce drying time by 25%, saving significant energy over time. They eliminate the waste of hundreds of single-use dryer sheets and keep harmful chemicals like quaternary ammonium compounds out of waterways and the environment."
    },
    {
      id: 4,
      name: "Stainless Steel Water Bottle",
      description: "Durable replacement for disposable plastic water bottles that keeps drinks cold or hot.",
      category: "On the Go",
      rating: 4.8,
      benefits: ["Eliminates plastic waste", "Doesn't leach chemicals", "Lasts for years"],
      detailedDescription: "High-quality stainless steel water bottles provide a durable, long-lasting alternative to single-use plastic bottles. Unlike plastic, stainless steel doesn't leach chemicals into your water and can keep beverages cold for up to 24 hours or hot for up to 12 hours when properly insulated. Modern designs address previous concerns with metallic tastes and offer features like leak-proof caps and easy cleaning.",
      whenToUse: [
        "Daily hydration at home, work, or during exercise",
        "Fill before leaving home to avoid buying bottled water",
        "Hand wash or dishwasher-safe depending on the model"
      ],
      environmentalImpact: "One reusable bottle can replace hundreds of plastic water bottles annually. The environmental break-even point compared to single-use plastics is typically reached after 15-20 uses, after which every use represents a net positive for the environment."
    },
    {
      id: 5,
      name: "Silicone Food Storage Bags",
      description: "Reusable silicone bags that replace single-use plastic sandwich and storage bags.",
      category: "Kitchen",
      rating: 4.4,
      benefits: ["Dishwasher safe", "Freezer safe", "Leak-proof"],
      detailedDescription: "Silicone food storage bags are durable, flexible containers made from food-grade silicone that can replace disposable plastic storage bags. Unlike plastic, silicone is more temperature resistant, non-toxic, and doesn't break down into microplastics. These bags feature secure seals and can be used in the freezer, microwave, dishwasher, and even in sous vide cooking applications.",
      whenToUse: [
        "Store fresh or frozen foods",
        "Pack lunches and snacks",
        "Marinate foods",
        "Sous vide cooking (if heat-rated)"
      ],
      environmentalImpact: "The average family uses 500+ disposable plastic bags annually. Each silicone bag can last 3-5 years with proper care, preventing hundreds of plastic bags from entering landfills and waterways."
    },
    {
      id: 6,
      name: "Biodegradable Phone Case",
      description: "Phone cases made from plant-based materials that will biodegrade at end of life.",
      category: "Technology",
      rating: 4.2,
      benefits: ["Compostable", "Protective", "Sustainable materials"],
      detailedDescription: "Biodegradable phone cases use materials like flax, hemp, wheat straw, or bioplastics derived from plants instead of petroleum-based plastics. These materials provide similar protection to conventional cases but will break down naturally at the end of their life cycle. Many options are now available that are 100% compostable while still offering drop protection and stylish designs.",
      whenToUse: [
        "When upgrading your phone or replacing a damaged case",
        "Look for cases certified compostable or biodegradable",
        "Some cases can be composted at home, while others require industrial composting facilities"
      ],
      environmentalImpact: "With over 1.5 billion smartphones sold annually, phone cases represent a significant source of plastic waste. Biodegradable cases decompose naturally over 6 months to 2 years depending on the material and conditions, rather than remaining in the environment for hundreds of years."
    },
    {
      id: 7,
      name: "Reusable Cotton Rounds",
      description: "Washable cotton pads for makeup removal and skincare that replace disposable cotton pads.",
      category: "Bathroom",
      rating: 4.6,
      benefits: ["Machine washable", "Soft on skin", "Zero waste"],
      detailedDescription: "Reusable cotton rounds are typically made from organic cotton, bamboo, or hemp fabrics cut into circular pads that replace disposable cotton balls and rounds. These pads are designed for makeup removal, toner application, and general skincare. They're soft on the skin while being durable enough to withstand hundreds of washes.",
      whenToUse: [
        "Daily skincare routines and makeup removal",
        "Store used pads in a small mesh laundry bag",
        "Machine wash weekly and air dry or tumble dry low",
        "A set of 20 pads is sufficient for most people's weekly needs"
      ],
      environmentalImpact: "The average person using disposable cotton rounds for skincare goes through 1,000-1,500 per year. Reusable pads eliminate this waste and reduce the environmental impact of cotton farming, which is water-intensive and often uses significant pesticides."
    },
    {
      id: 8,
      name: "Solar Power Bank",
      description: "Portable phone charger that can be recharged using solar energy.",
      category: "Technology",
      rating: 4.1,
      benefits: ["Renewable energy", "Portable", "Emergency ready"],
      detailedDescription: "Solar power banks combine a traditional portable battery with integrated solar panels that can recharge the battery using sunlight. While solar charging is typically slower than outlet charging, it provides a renewable energy option for extending battery life while traveling, camping, or during emergencies. Modern units offer features like waterproofing, multiple ports for charging different devices, and integrated LED lights.",
      whenToUse: [
        "Outdoor activities like hiking, camping, or beach trips",
        "Travel to areas with unreliable electricity",
        "Emergency preparedness kits",
        "Position in direct sunlight for most efficient charging"
      ],
      environmentalImpact: "Solar power banks reduce reliance on grid electricity, which still comes predominantly from fossil fuels in many regions. They're particularly valuable for reducing generator use in remote locations and can provide critical device charging during power outages without additional carbon emissions."
    },
    {
      id: 9,
      name: "Eco-Friendly Toilet Paper",
      description: "Toilet paper made from bamboo or recycled paper that reduces deforestation and water usage.",
      category: "Bathroom",
      rating: 4.4,
      benefits: ["Tree-free or recycled", "Plastic-free packaging", "Biodegradable"],
      detailedDescription: "Eco-friendly toilet paper alternatives use either bamboo (a rapidly renewable resource) or 100% recycled paper instead of virgin wood pulp from trees. These sustainable alternatives require significantly less water to produce, generate less pollution, and help protect forest ecosystems. Many brands now offer plastic-free packaging using paper wraps or cardboard boxes.",
      whenToUse: [
        "Direct replacement for conventional toilet paper",
        "Look for options without bleach, dyes, or fragrances",
        "Subscribe to delivery services to maintain consistent supply"
      ],
      environmentalImpact: "Conventional toilet paper production contributes to the cutting of approximately 27,000 trees daily. Bamboo toilet paper produces 30% fewer greenhouse gas emissions and uses 90% less water than tree-based options, while recycled paper reduces landfill waste and energy consumption.",
      isNew: true,
      addedDate: "April 10, 2025"
    },
    {
      id: 10,
      name: "Plant-Based Cleaning Concentrates",
      description: "Refillable cleaning products that use plant-derived ingredients and concentrated formulas to reduce plastic waste.",
      category: "Household",
      rating: 4.7,
      benefits: ["Reduces plastic packaging", "Non-toxic ingredients", "Economical"],
      detailedDescription: "Plant-based cleaning concentrates are powerful, natural cleaning solutions that come in highly concentrated forms, requiring dilution with water before use. These products typically use ingredients derived from plants like coconut, corn, and citrus instead of petrochemicals. The concentrated format drastically reduces packaging waste and shipping emissions. Users mix the concentrate with water in reusable spray bottles, creating a full-sized cleaning product.",
      whenToUse: [
        "All-purpose cleaning throughout the home",
        "Follow dilution instructions carefully for best results",
        "Label spray bottles clearly with contents",
        "Store concentrates safely away from children"
      ],
      environmentalImpact: "A single small bottle of concentrate can replace 3-5 full-sized plastic cleaning bottles. By shipping only the active ingredients and not water (which makes up 90%+ of most cleaners), the carbon footprint from transportation is also significantly reduced. Plant-based formulas biodegrade readily and don't contribute harmful chemicals to waterways.",
      isNew: true,
      addedDate: "April 10, 2025"
    }
  ];
  
  const categoriesSet = new Set(alternatives.map(item => item.category));
  const categories = Array.from(categoriesSet);
  
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

  const openAlternativeDetails = (alternative: EcoAlternative) => {
    setSelectedAlternative(alternative);
    setDialogOpen(true);
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
        
        {/* Daily Update Banner */}
        <div className="mb-8 bg-green-50 p-6 rounded-lg border border-green-100">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <Calendar className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <h3 className="font-bold text-neutral-800">Daily Eco Updates</h3>
                <p className="text-sm text-neutral-600">
                  Latest additions: <span className="font-medium">{latestUpdateDate}</span>
                  {/* Show "New" badge if there are additions the user hasn't seen */}
                  {lastCheckedDate !== today && latestUpdateDate === today && (
                    <Badge variant="outline" className="ml-2 bg-green-100 text-green-800">New</Badge>
                  )}
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant={isSubscribed ? "default" : "outline"} 
                size="sm"
                onClick={toggleSubscription}
              >
                {isSubscribed ? "Subscribed ✓" : "Subscribe to Updates"}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={markAsChecked}
                className="flex items-center"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Mark as Read
              </Button>
            </div>
          </div>
          
          {/* New additions highlight */}
          {alternatives.some(alt => alt.isNew) && (
            <div className="mt-4 pt-4 border-t border-green-200">
              <h4 className="font-medium text-neutral-800 mb-2">
                New Eco Alternatives
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alternatives
                  .filter(alt => alt.isNew)
                  .map(alt => (
                    <div key={alt.id} className="flex items-center bg-white p-3 rounded-lg">
                      <Badge className="mr-3 bg-green-100 text-green-800">New</Badge>
                      <div>
                        <h5 className="font-medium">{alt.name}</h5>
                        <p className="text-sm text-neutral-600">{alt.category}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-auto"
                        onClick={() => openAlternativeDetails(alt)}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
              </div>
            </div>
          )}
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
                    {alt.isNew && isRecentlyAdded(alt.addedDate!) && (
                      <Badge className="bg-green-100 text-green-800">New</Badge>
                    )}
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
                  
                  <div className="flex justify-center mt-4 pt-4 border-t border-neutral-100">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openAlternativeDetails(alt)}
                    >
                      <BadgeInfo className="h-4 w-4 mr-2" />
                      View Details
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
                        {alt.isNew && isRecentlyAdded(alt.addedDate!) && (
                          <Badge className="bg-green-100 text-green-800">New</Badge>
                        )}
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
                      
                      <div className="flex justify-center mt-4 pt-4 border-t border-neutral-100">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openAlternativeDetails(alt)}
                        >
                          <BadgeInfo className="h-4 w-4 mr-2" />
                          View Details
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
      
      {/* Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-auto">
          {selectedAlternative && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-2xl">{selectedAlternative.name}</DialogTitle>
                  <Badge>{selectedAlternative.category}</Badge>
                </div>
                <div className="flex items-center mt-2">
                  {renderRatingStars(selectedAlternative.rating)}
                  <span className="text-sm text-neutral-500 ml-2">{selectedAlternative.rating.toFixed(1)}</span>
                </div>
              </DialogHeader>
              
              <div className="py-4">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3 flex-shrink-0 bg-neutral-100 rounded-lg min-h-[200px] flex items-center justify-center">
                    <span className="text-neutral-400">Product Image</span>
                  </div>
                  
                  <div className="md:w-2/3">
                    <h3 className="font-medium text-lg mb-2">Description</h3>
                    <p className="text-neutral-700 mb-4">
                      {selectedAlternative.detailedDescription || selectedAlternative.description}
                    </p>
                    
                    <h3 className="font-medium text-lg mb-2">Environmental Impact</h3>
                    <p className="text-neutral-700 mb-4">
                      {selectedAlternative.environmentalImpact || "Switching to this eco-friendly alternative helps reduce waste and environmental impact."}
                    </p>
                    
                    <div className="mb-4">
                      <h3 className="font-medium text-lg mb-2">Benefits</h3>
                      <ul className="space-y-1">
                        {selectedAlternative.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center text-neutral-700">
                            <span className="mr-2 text-green-500">•</span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {selectedAlternative.whenToUse && (
                      <div className="mb-4">
                        <h3 className="font-medium text-lg mb-2">How & When to Use</h3>
                        <ul className="space-y-1">
                          {selectedAlternative.whenToUse.map((tip, idx) => (
                            <li key={idx} className="flex items-center text-neutral-700">
                              <span className="mr-2 text-blue-500">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-neutral-200 flex justify-end">
                  <Button onClick={() => setDialogOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
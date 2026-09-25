import { PageFrame, PageIntro } from '@/components/layout/page-frame';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Star, BadgeInfo, Calendar, ArrowRight, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface EcoAlternative {
  id: number;
  name: string;
  description: string;
  category: string;
  rating: number;
  benefits: string[];
  imageUrl?: string | null;
  createdAt?: string;
  detailedDescription?: string;
  whenToUse?: string[];
  environmentalImpact?: string;
  isNew?: boolean;
  addedDate?: string;
  image?: string;
}

const alternativeImages: Record<string, string> = {
  'Bamboo Toothbrush': 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=900&q=80',
  'Cloth Produce Bags': 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=900&q=80',
  'LED Light Bulbs': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
  'Plant-Based Dish Soap': 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=900&q=80',
  'Reusable Beeswax Wraps': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80',
  'Daily Essentials': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80',
  'Personal Care': 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=900&q=80',
  Kitchen: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80',
  Transport: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80',
  default: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80',
};

function getAlternativeImage(alternative: EcoAlternative) {
  return alternative.imageUrl || alternativeImages[alternative.name] || alternativeImages[alternative.category] || alternativeImages.default;
}

export default function EcoAlternatives() {
  const [selectedAlternative, setSelectedAlternative] = useState<EcoAlternative | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: alternatives = [], isLoading, isError, refetch } = useQuery<EcoAlternative[]>({
    queryKey: ['/api/alternatives'],
    queryFn: async () => {
      const res = await fetch('/api/alternatives');
      if (!res.ok) throw new Error('Failed to fetch eco alternatives');
      return res.json();
    },
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const isRecentlyAdded = (date?: string) => {
    if (!date) return false;
    const createdAt = new Date(date).getTime();
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return createdAt >= sevenDaysAgo && createdAt <= Date.now();
  };
  const recentAlternatives = alternatives.filter(alt => isRecentlyAdded(alt.createdAt));
  const latestUpdateDate = alternatives.length > 0
    ? new Date(Math.max(...alternatives.map(alt => new Date(alt.createdAt ?? 0).getTime())))
        .toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'No alternatives available';

  useEffect(() => {
    if (alternatives.length > 0) setLastUpdatedAt(new Date());
  }, [alternatives]);
  
  const categoriesSet = new Set(alternatives.map(item => item.category));
  const categories = Array.from(categoriesSet);
  const matchesSearch = (alternative: EcoAlternative) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return [alternative.name, alternative.description, alternative.category, ...alternative.benefits]
      .some(value => value.toLowerCase().includes(query));
  };
  
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
    <>
      <PageFrame>
        <PageIntro eyebrow="Choose a better swap" title="Eco-Friendly Alternatives" description="Compare practical lower-waste options for the products and routines you already use." />
        
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
                  {recentAlternatives.length > 0 && (
                    <Badge variant="outline" className="ml-2 bg-green-100 text-green-800">New</Badge>
                  )}
                </p>
                <p className="mt-1 text-xs text-green-700">
                  Live updates{lastUpdatedAt ? ` · updated ${lastUpdatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : ''}
                </p>
              </div>
            </div>
          </div>
          
          {/* New additions highlight */}
          {recentAlternatives.length > 0 && (
            <div className="mt-4 pt-4 border-t border-green-200">
              <h4 className="font-medium text-neutral-800 mb-2">
                New Eco Alternatives
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentAlternatives
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
        
        <div className="mb-6 relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search swaps by product, room, or benefit..."
            className="pl-9"
            aria-label="Search eco-friendly alternatives"
          />
        </div>

        <Tabs defaultValue="all" className="mb-12">
          <TabsList className="mb-8 flex flex-wrap justify-center">
            <TabsTrigger value="all">All Products</TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full flex justify-center p-12"><div className="w-8 h-8 rounded-full bg-green-500 animate-bounce"></div></div>
            ) : isError ? (
              <div className="col-span-full text-center p-12">
                <p className="text-neutral-600 mb-4">We couldn&apos;t load eco alternatives.</p>
                <Button variant="outline" onClick={() => refetch()}>Try Again</Button>
              </div>
            ) : alternatives.filter(matchesSearch).length === 0 ? (
              <p className="col-span-full text-center text-neutral-600 p-12">No eco alternatives are available yet.</p>
            ) : (
              alternatives.filter(matchesSearch).map(alt => (
              <Card key={alt.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                <img src={getAlternativeImage(alt)} alt={alt.name} className="h-44 w-full object-cover" loading="lazy" />
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold">{alt.name}</h3>
                    {isRecentlyAdded(alt.createdAt) && (
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
            ))
            )}
          </TabsContent>
          
          {categories.map(category => (
            <TabsContent 
              key={category} 
              value={category}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {alternatives
                .filter(alt => alt.category === category && matchesSearch(alt))
                .map(alt => (
                  <Card key={alt.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                    <img src={getAlternativeImage(alt)} alt={alt.name} className="h-44 w-full object-cover" loading="lazy" />
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold">{alt.name}</h3>
                        {isRecentlyAdded(alt.createdAt) && (
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
              {alternatives.filter(alt => alt.category === category && matchesSearch(alt)).length === 0 && (
                <p className="col-span-full text-center text-neutral-600 py-12">No alternatives match your search.</p>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </PageFrame>
      
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
                  <div className="md:w-1/3 flex-shrink-0 bg-neutral-100 rounded-lg min-h-[200px] flex items-center justify-center overflow-hidden">
                    <img src={getAlternativeImage(selectedAlternative)} alt={selectedAlternative.name} className="h-full w-full object-cover" />
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
    </>
  );
}
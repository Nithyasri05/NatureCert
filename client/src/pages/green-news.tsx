import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowRight, Bookmark, Share2, MapPin, Filter } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  date: string;
  readTime: string;
  categories: string[];
  source: string;
  country: string;
  fullArticle?: string;
  image?: string;
}

export default function GreenNews() {
  const [savedArticles, setSavedArticles] = useState<Set<number>>(new Set());
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [articleDialogOpen, setArticleDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  
  const articles: NewsArticle[] = [
    {
      id: 1,
      title: "India Achieves 50% Renewable Energy Mix in Power Generation",
      summary: "In a landmark achievement, India has reached its 2025 clean energy target ahead of schedule with 50% of its electricity now coming from renewable sources, led by massive solar and wind power installations across the country.",
      date: "April 10, 2025",
      readTime: "6 min",
      categories: ["Renewable Energy", "Policy"],
      source: "Indian Clean Energy Monitor",
      country: "India",
      fullArticle: "NEW DELHI - India has achieved a significant milestone in its energy transition journey by reaching 50% renewable energy in its power generation mix, a target that was originally set for the end of 2025.\n\nThe Ministry of New and Renewable Energy announced today that the country's installed renewable capacity has crossed 500 GW, with solar leading at 280 GW, followed by wind at 140 GW, and the remainder from hydro, biomass, and other renewable sources.\n\n\"This achievement marks a watershed moment in India's commitment to combating climate change while ensuring energy security,\" said Energy Minister Rajiv Sharma. \"We have not only met our Paris Agreement goals but surpassed them ahead of schedule.\"\n\nThe accelerated transition was made possible by innovative policy mechanisms, including green energy corridors, renewable purchase obligations, and production-linked incentives for domestic manufacturing of solar panels and wind turbines.\n\nRural electrification through microgrids has played a key role, with over 100,000 villages now powered by localized renewable energy systems. The Green Jobs Initiative, launched in 2023, has created over 3 million new employment opportunities in the renewable sector.\n\nEnergy analysts point to India's model as a blueprint for developing economies to transition to clean energy without compromising economic growth. The country's carbon emissions have declined by 15% compared to 2020 levels, even as its economy has grown at an average of 7% annually.\n\nThe next phase of India's energy transition includes ambitious targets for green hydrogen production, electric vehicle adoption, and energy storage solutions to manage intermittency issues.\n\n\"India has shown the world that economic development and environmental stewardship can go hand in hand,\" said UN Secretary-General in a statement congratulating the country on its achievement."
    },
    {
      id: 2,
      title: "Indian Scientists Develop Breakthrough Biodegradable Plastic From Agricultural Waste",
      summary: "A team of scientists from IIT Madras has developed a fully biodegradable plastic alternative made from agricultural waste that decomposes within 60 days, potentially solving one of the world's most pressing pollution problems.",
      date: "April 8, 2025",
      readTime: "5 min",
      categories: ["Innovation", "Sustainable Materials"],
      source: "Indian Science Journal",
      country: "India",
      fullArticle: "CHENNAI - In what could be a game-changing solution to the global plastic pollution crisis, scientists from the Indian Institute of Technology (IIT) Madras have developed a fully biodegradable plastic alternative derived entirely from agricultural waste.\n\nThe revolutionary material, named 'AgriPlast', breaks down completely in natural environments within 60 days while matching conventional plastics in durability and versatility during its useful life.\n\n\"AgriPlast represents a paradigm shift in how we approach single-use materials,\" said Dr. Priya Venkatesh, lead researcher on the project. \"By utilizing agricultural residues that would otherwise be burned, we're addressing two environmental problems simultaneously: plastic pollution and air pollution from crop burning.\"\n\nThe innovation uses rice straw, sugarcane bagasse, and other agricultural residues that are abundant in India. The process involves extracting cellulose and other natural polymers from these waste materials and combining them with organic binding agents derived from tamarind seeds.\n\nField tests have shown that AgriPlast can be molded into various forms and applications currently dominated by petroleum-based plastics, including packaging materials, disposable cutlery, and shopping bags. Importantly, the material maintains its structural integrity when in use but begins to decompose when exposed to soil microorganisms.\n\nThe technology has already attracted attention from major corporations seeking sustainable packaging solutions. The team has partnered with three leading consumer goods companies to pilot the material in commercial applications, with full-scale production expected by early 2026.\n\n\"What makes this development particularly exciting is its economic viability,\" explained industry analyst Vikram Mehta. \"The raw materials are extremely low-cost and abundant, and the production process requires minimal modification to existing plastic manufacturing equipment.\"\n\nThe Ministry of Environment has announced a special grant of ₹100 crore to scale up production and accelerate the material's adoption across various industries. The innovation is expected to create thousands of new jobs in rural areas where agricultural waste collection and processing centers will be established.\n\nWith India generating over 3.5 million tonnes of plastic waste annually, the development of AgriPlast represents a potential solution to one of the country's most pressing environmental challenges."
    },
    {
      id: 3,
      title: "Delhi Becomes World's First Major Capital to Achieve 'Clean Air' Status",
      summary: "After a decade of aggressive anti-pollution measures, Delhi has officially achieved WHO-standard air quality year-round, transforming from one of the world's most polluted cities to a global model for urban air quality management.",
      date: "April 5, 2025",
      readTime: "7 min",
      categories: ["Air Quality", "Urban Development"],
      source: "Delhi Environmental Times",
      country: "India",
      fullArticle: "DELHI - In what environmental experts are calling a \"miracle of political will and public participation,\" Delhi has become the first major capital city formerly plagued by severe air pollution to achieve World Health Organization (WHO) clean air standards year-round.\n\nThe transformation, officially certified yesterday by an independent consortium of air quality monitoring organizations, marks the culmination of a comprehensive ten-year Clean Air Delhi Initiative that has fundamentally reshaped the city's approach to transportation, energy, and urban planning.\n\n\"A decade ago, breathing in Delhi during winter months was equivalent to smoking 20 cigarettes a day,\" said Dr. Arun Sharma, Director of the National Air Quality Monitoring Network. \"Today, Delhi's air quality consistently meets or exceeds WHO guidelines throughout the year, including during the traditionally problematic crop-burning season.\"\n\nThe initiative's success relied on a multi-pronged approach that began with the full electrification of public transportation. The city now operates over 15,000 electric buses and has established India's most extensive network of electric vehicle charging stations. Private electric vehicle adoption has reached 85% for new car purchases, supported by substantial tax incentives and a comprehensive ban on new internal combustion vehicles implemented in 2023.\n\nA revolutionary waste management system eliminated garbage burning, while advanced emissions control technology has been mandated for all industrial operations. The city's green cover has increased by 35% through an ambitious urban forestry program that created 25 city forests and lined all major roads with air-filtering vegetation.\n\nPerhaps most crucial was the collaboration with neighboring states to end crop burning through the introduction of the Agricultural Waste Monetization Program, which converts rice straw and other agricultural residues into biofuels and sustainable packaging materials.\n\n\"The Delhi model demonstrates that even the most polluted cities can be transformed with sufficient political will, technological innovation, and community engagement,\" said the Director-General of the UN Environment Programme. \"It provides a practical roadmap for other major cities struggling with similar challenges.\"\n\nPublic health officials report that respiratory disease hospitalizations have decreased by 60% since 2020, while life expectancy in the city has increased by approximately 3.5 years. The city's transformation has also stimulated economic growth, particularly in clean technology sectors, with over 50,000 new green jobs created.\n\n\"Clean air is not a luxury or an environmental indulgence—it is a fundamental right,\" said Delhi's Chief Minister. \"The journey to transform our air quality has fundamentally changed how we think about urban development, prosperity, and quality of life.\""
    },
    {
      id: 4,
      title: "Global Carbon Emissions Drop 15% Following Implementation of Paris+20 Agreement",
      summary: "The landmark Paris+20 Agreement signed in 2023 has led to its first major success as global carbon emissions have decreased by 15% compared to 2020 levels, surpassing the initial target of 12%.",
      date: "April 3, 2025",
      readTime: "6 min",
      categories: ["Climate Policy", "Global"],
      source: "Global Climate Monitor",
      country: "International"
    },
    {
      id: 5,
      title: "Breakthrough in Carbon Capture Technology Achieves 90% Efficiency",
      summary: "Scientists have developed a new carbon capture technology that can remove CO2 from the atmosphere with 90% efficiency at half the cost of previous methods, potentially revolutionizing climate change mitigation efforts.",
      date: "March 30, 2025",
      readTime: "5 min",
      categories: ["Innovation", "Carbon Capture"],
      source: "Tech Environmental Review",
      country: "USA"
    },
    {
      id: 6,
      title: "Vertical Farming Expansion Reduces Agricultural Land Use by 20% in Urban Areas",
      summary: "The rapid adoption of vertical farming technologies in major cities worldwide has reduced the need for traditional agricultural land by 20%, while increasing food production and reducing water usage by 90%.",
      date: "March 25, 2025",
      readTime: "4 min",
      categories: ["Sustainable Agriculture", "Urban Development"],
      source: "Future Farming Today",
      country: "Netherlands"
    },
    {
      id: 7,
      title: "Indian Railways Completes National Electrification Project",
      summary: "Indian Railways has completed its ambitious project to electrify 100% of its broad gauge network, making it the world's largest green railway system and reducing carbon emissions by 24 million tonnes annually.",
      date: "March 20, 2025",
      readTime: "5 min",
      categories: ["Transportation", "Renewable Energy"],
      source: "Transport India",
      country: "India"
    },
    {
      id: 8,
      title: "Mumbai Launches World's Largest Urban Floating Solar Project",
      summary: "Mumbai has inaugurated a 500MW floating solar power plant in its coastal waters, combining renewable energy generation with wave energy harvesting to power nearly 30% of the city's electricity needs.",
      date: "March 15, 2025",
      readTime: "4 min",
      categories: ["Solar Energy", "Urban Innovation"],
      source: "Maharashtra Energy Journal",
      country: "India"
    }
  ];
  
  const toggleSave = (articleId: number) => {
    setSavedArticles(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(articleId)) {
        newSaved.delete(articleId);
      } else {
        newSaved.add(articleId);
      }
      return newSaved;
    });
  };
  
  const openArticle = (article: NewsArticle) => {
    setSelectedArticle(article);
    setArticleDialogOpen(true);
  };
  
  const filteredArticles = selectedRegion 
    ? articles.filter(article => article.country === selectedRegion)
    : articles;
    
  // Prioritize Indian news
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (a.country === 'India' && b.country !== 'India') return -1;
    if (a.country !== 'India' && b.country === 'India') return 1;
    return 0;
  });
  
  const featuredArticle = sortedArticles[0];
  const regularArticles = sortedArticles.slice(1);
  
  const regions = Array.from(new Set(articles.map(article => article.country)));
  
  return (
    <div>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">Green News</h1>
          <p className="text-neutral-600 max-w-2xl">
            Stay updated with the latest environmental news, breakthroughs, and sustainable developments from around the world.
          </p>
        </div>
        
        {/* Region Filter */}
        <div className="mb-8 flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                {selectedRegion ? `Region: ${selectedRegion}` : "All Regions"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedRegion(null)}>
                All Regions
              </DropdownMenuItem>
              {regions.map(region => (
                <DropdownMenuItem key={region} onClick={() => setSelectedRegion(region)}>
                  {region}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Featured Article */}
        <div className="mb-12 bg-green-50 rounded-xl overflow-hidden">
          <div className="p-6 md:p-8 md:flex">
            <div className="md:w-2/3 md:pr-8">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex flex-wrap gap-2">
                  {featuredArticle.categories.map(category => (
                    <Badge key={category} variant="outline" className="bg-white">
                      {category}
                    </Badge>
                  ))}
                </div>
                {featuredArticle.country && (
                  <Badge variant="secondary" className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {featuredArticle.country}
                  </Badge>
                )}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">{featuredArticle.title}</h2>
              <p className="text-neutral-600 mb-6 text-lg">{featuredArticle.summary}</p>
              <div className="flex items-center text-sm text-neutral-500 mb-6">
                <div className="flex items-center mr-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{featuredArticle.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{featuredArticle.readTime} read</span>
                </div>
              </div>
              <Button onClick={() => openArticle(featuredArticle)}>
                Read Full Article
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="md:w-1/3 mt-6 md:mt-0">
              <div className="h-48 md:h-full bg-neutral-200 rounded-lg flex items-center justify-center">
                <span className="text-neutral-500">Featured Image</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularArticles.map(article => (
            <Card key={article.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="h-40 bg-neutral-100 flex items-center justify-center">
                  <span className="text-neutral-400">Article Image</span>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-wrap gap-1">
                      {article.categories.slice(0, 2).map(category => (
                        <Badge key={category} variant="secondary" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                    {article.country && (
                      <Badge variant="outline" className="text-xs flex items-center ml-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {article.country}
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{article.title}</h3>
                  <p className="text-neutral-600 mb-4 line-clamp-3">{article.summary}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-neutral-500 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>{article.date}</span>
                      <span className="mx-2">•</span>
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{article.readTime}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={savedArticles.has(article.id) ? "text-primary" : "text-neutral-400"}
                        onClick={() => toggleSave(article.id)}
                      >
                        <Bookmark className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-neutral-400"
                        onClick={() => openArticle(article)}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button variant="outline">Load More Articles</Button>
        </div>
      </main>
      <Footer />
      
      {/* Article Dialog */}
      <Dialog open={articleDialogOpen} onOpenChange={setArticleDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-auto">
          <DialogHeader>
            <div className="flex gap-2 mb-2">
              {selectedArticle?.categories.map(category => (
                <Badge key={category} variant="outline">
                  {category}
                </Badge>
              ))}
              {selectedArticle?.country && (
                <Badge variant="secondary" className="flex items-center ml-auto">
                  <MapPin className="h-3 w-3 mr-1" />
                  {selectedArticle.country}
                </Badge>
              )}
            </div>
            <DialogTitle className="text-2xl">{selectedArticle?.title}</DialogTitle>
            <div className="flex items-center text-sm text-neutral-500 mt-2">
              <div className="flex items-center mr-4">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{selectedArticle?.date}</span>
              </div>
              <div className="flex items-center mr-4">
                <Clock className="h-4 w-4 mr-1" />
                <span>{selectedArticle?.readTime} read</span>
              </div>
              <div>
                Source: {selectedArticle?.source}
              </div>
            </div>
          </DialogHeader>
          
          <div className="py-4">
            {selectedArticle?.fullArticle ? (
              <div className="prose prose-neutral max-w-none">
                {selectedArticle.fullArticle.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            ) : (
              <div>
                <p className="text-lg font-medium mb-4">{selectedArticle?.summary}</p>
                <p className="text-neutral-500 italic">Full article content will be available soon.</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
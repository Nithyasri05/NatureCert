import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowRight, Bookmark, Share2 } from 'lucide-react';
import { useState } from 'react';

interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  date: string;
  readTime: string;
  categories: string[];
  source: string;
  image?: string;
}

export default function GreenNews() {
  const [savedArticles, setSavedArticles] = useState<Set<number>>(new Set());
  
  const articles: NewsArticle[] = [
    {
      id: 1,
      title: "Global Carbon Emissions Drop 15% Following Implementation of Paris+20 Agreement",
      summary: "The landmark Paris+20 Agreement signed in 2023 has led to its first major success as global carbon emissions have decreased by 15% compared to 2020 levels, surpassing the initial target of 12%.",
      date: "April 10, 2025",
      readTime: "6 min",
      categories: ["Climate Policy", "Global"],
      source: "Global Climate Monitor"
    },
    {
      id: 2,
      title: "Breakthrough in Carbon Capture Technology Achieves 90% Efficiency",
      summary: "Scientists have developed a new carbon capture technology that can remove CO2 from the atmosphere with 90% efficiency at half the cost of previous methods, potentially revolutionizing climate change mitigation efforts.",
      date: "April 8, 2025",
      readTime: "5 min",
      categories: ["Innovation", "Carbon Capture"],
      source: "Tech Environmental Review"
    },
    {
      id: 3,
      title: "Vertical Farming Expansion Reduces Agricultural Land Use by 20% in Urban Areas",
      summary: "The rapid adoption of vertical farming technologies in major cities worldwide has reduced the need for traditional agricultural land by 20%, while increasing food production and reducing water usage by 90%.",
      date: "April 5, 2025",
      readTime: "4 min",
      categories: ["Sustainable Agriculture", "Urban Development"],
      source: "Future Farming Today"
    },
    {
      id: 4,
      title: "Biodegradable Microplastic Alternative Now Standard in 70% of Consumer Products",
      summary: "Following strict regulations passed in 2023, biodegradable alternatives to microplastics are now used in 70% of consumer products globally, dramatically reducing plastic pollution in waterways.",
      date: "April 3, 2025",
      readTime: "3 min",
      categories: ["Plastic Pollution", "Consumer Goods"],
      source: "Sustainable Materials Journal"
    },
    {
      id: 5,
      title: "Nuclear Fusion Energy Now Commercially Viable, First Power Plant Opens",
      summary: "After decades of research, the world's first commercial nuclear fusion power plant has begun operations, providing clean, virtually limitless energy with zero carbon emissions and minimal radioactive waste.",
      date: "March 30, 2025",
      readTime: "7 min",
      categories: ["Energy", "Innovation"],
      source: "Clean Energy Report"
    },
    {
      id: 6,
      title: "Amazon Rainforest Recovery Program Shows 30% Increase in Biodiversity",
      summary: "The international Amazon Rainforest Recovery Initiative launched in 2023 has reported a 30% increase in biodiversity in restored areas, with indigenous-led conservation efforts proving most effective.",
      date: "March 25, 2025",
      readTime: "5 min",
      categories: ["Conservation", "Biodiversity"],
      source: "Global Ecology Network"
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
  
  const featuredArticle = articles[0];
  const regularArticles = articles.slice(1);
  
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
        
        {/* Featured Article */}
        <div className="mb-12 bg-green-50 rounded-xl overflow-hidden">
          <div className="p-6 md:p-8 md:flex">
            <div className="md:w-2/3 md:pr-8">
              <div className="flex flex-wrap gap-2 mb-3">
                {featuredArticle.categories.map(category => (
                  <Badge key={category} variant="outline" className="bg-white">
                    {category}
                  </Badge>
                ))}
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
              <Button>
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
                  <div className="flex flex-wrap gap-1 mb-2">
                    {article.categories.slice(0, 2).map(category => (
                      <Badge key={category} variant="secondary" className="text-xs">
                        {category}
                      </Badge>
                    ))}
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
                      <Button variant="ghost" size="sm" className="text-neutral-400">
                        <Share2 className="h-4 w-4" />
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
    </div>
  );
}
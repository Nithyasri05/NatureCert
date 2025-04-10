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
      title: "New Report Shows Significant Increase in Renewable Energy Adoption",
      summary: "Global renewable energy capacity increased by 9.6% in 2022, despite supply chain challenges and rising costs of materials.",
      date: "May 12, 2023",
      readTime: "5 min",
      categories: ["Renewable Energy", "Global"],
      source: "Green Energy Journal"
    },
    {
      id: 2,
      title: "Ocean Cleanup Project Removes 100 Tons of Plastic from Pacific Garbage Patch",
      summary: "Innovative ocean cleanup technology successfully extracted 100 tons of plastic waste from the Great Pacific Garbage Patch in its latest expedition.",
      date: "June 3, 2023",
      readTime: "4 min",
      categories: ["Ocean Conservation", "Plastic Pollution"],
      source: "Marine Conservation Today"
    },
    {
      id: 3,
      title: "Major Corporation Commits to Net-Zero Carbon Emissions by 2030",
      summary: "One of the world's largest consumer goods companies announced ambitious new targets to achieve net-zero carbon emissions across its operations by 2030.",
      date: "June 10, 2023",
      readTime: "6 min",
      categories: ["Corporate Sustainability", "Climate Action"],
      source: "Business & Environment"
    },
    {
      id: 4,
      title: "New Study Links Air Pollution to Cognitive Decline",
      summary: "Research published in a leading medical journal provides new evidence linking long-term exposure to air pollution with accelerated cognitive decline in older adults.",
      date: "May 28, 2023",
      readTime: "7 min",
      categories: ["Health", "Air Quality"],
      source: "Environmental Health Journal"
    },
    {
      id: 5,
      title: "Innovative Plant-Based Packaging Solution Wins Sustainability Award",
      summary: "A startup has developed a compostable packaging material made from agricultural waste that could replace single-use plastics in food packaging.",
      date: "June 15, 2023",
      readTime: "3 min",
      categories: ["Innovation", "Packaging"],
      source: "Sustainable Business Insider"
    },
    {
      id: 6,
      title: "Record-Breaking Heat Wave Linked to Climate Change, Scientists Say",
      summary: "Scientists attribute the unprecedented heat wave affecting millions to human-induced climate change, warning that such events will become more frequent and intense.",
      date: "June 20, 2023",
      readTime: "8 min",
      categories: ["Climate Change", "Weather"],
      source: "Climate Science Network"
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
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageFrame } from '@/components/layout/page-frame';
import ResourceCard from '@/components/resources/resource-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Radio, RefreshCw } from 'lucide-react';
import type { Resource } from '@shared/schema';

export default function Resources() {
  const [activeTab, setActiveTab] = useState("all");
  
  const { data: resources = [], isLoading, error, refetch: refetchResources } = useQuery<Resource[]>({
    queryKey: ['/api/resources'],
  });

  const { data: liveVideos = [], isLoading: videosLoading, refetch: refetchVideos, isFetching: videosFetching } = useQuery<Resource[]>({
    queryKey: ['/api/resources/videos'],
    queryFn: async () => {
      const response = await fetch('/api/resources/videos');
      if (!response.ok) throw new Error('Failed to fetch educational videos');
      return response.json();
    },
    refetchInterval: 30 * 60 * 1000,
  });

  const refreshResources = () => {
    void Promise.all([refetchResources(), refetchVideos()]);
  };

  const combinedResources = [...liveVideos, ...resources.filter((resource) => !liveVideos.some((video) => video.link === resource.link))];
  
  const filteredResources = combinedResources.filter(resource => {
    if (activeTab === "all") return true;
    if (activeTab === "video") return resource.type === "Webinar" && liveVideos.some((video) => video.link === resource.link);
    return resource.type.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <PageFrame mainClassName="!py-0">
        <section className="bg-primary text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">Educational Resources</h1>
            <p className="text-lg opacity-90 max-w-3xl mx-auto">
              Explore curated guides and fresh sustainability videos from trusted educational publishers.
            </p>
          </div>
        </section>
        
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                <TabsList className="flex w-full max-w-lg gap-1 overflow-x-auto p-1">
                  <TabsTrigger className="min-w-max" value="all">All</TabsTrigger>
                  <TabsTrigger className="min-w-max" value="video">Videos</TabsTrigger>
                  <TabsTrigger className="min-w-max" value="guide">Guides</TabsTrigger>
                  <TabsTrigger className="min-w-max" value="webinar">Webinars</TabsTrigger>
                  <TabsTrigger className="min-w-max" value="case study">Case Studies</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-3 text-sm text-neutral-500">
                  <span className="flex items-center"><Radio className="h-3 w-3 mr-1 text-primary" /> Live videos</span>
                  <Button variant="outline" size="sm" onClick={refreshResources} disabled={videosFetching}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${videosFetching ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </div>
              
              <TabsContent value={activeTab}>
                {isLoading || videosLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="bg-white rounded-xl shadow-sm h-80 animate-pulse">
                        <div className="h-48 bg-neutral-100"></div>
                        <div className="p-6">
                          <div className="h-4 bg-neutral-100 rounded w-3/4 mb-4"></div>
                          <div className="h-3 bg-neutral-100 rounded w-full mb-2"></div>
                          <div className="h-3 bg-neutral-100 rounded w-2/3 mb-4"></div>
                          <div className="flex justify-between">
                            <div className="h-2 bg-neutral-100 rounded w-1/4"></div>
                            <div className="h-2 bg-neutral-100 rounded w-1/4"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-neutral-800 mb-4">Error Loading Resources</h2>
                    <p className="text-neutral-600">We encountered an error while fetching resources. Please try again later.</p>
                  </div>
                ) : filteredResources && filteredResources.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredResources.map((resource) => (
                      <ResourceCard key={resource.id} resource={resource} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-neutral-800 mb-4">No Resources Found</h2>
                    <p className="text-neutral-600">We couldn't find any resources in this category. Please try another category.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
    </PageFrame>
  );
}

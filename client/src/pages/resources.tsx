import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ResourceCard from '@/components/resources/resource-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Resource } from '@shared/schema';

export default function Resources() {
  const [activeTab, setActiveTab] = useState("all");
  
  const { data: resources, isLoading, error } = useQuery<Resource[]>({
    queryKey: ['/api/resources'],
  });
  
  const filteredResources = resources?.filter(resource => {
    if (activeTab === "all") return true;
    return resource.type.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div>
      <Header />
      <main>
        <section className="bg-primary text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">Educational Resources</h1>
            <p className="text-lg opacity-90 max-w-3xl mx-auto">
              Expand your knowledge about environmental certifications, sustainability practices, and how they impact our planet.
            </p>
          </div>
        </section>
        
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid w-full max-w-md grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="guide">Guides</TabsTrigger>
                  <TabsTrigger value="webinar">Webinars</TabsTrigger>
                  <TabsTrigger value="case study">Case Studies</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value={activeTab}>
                {isLoading ? (
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
        
        <section className="py-12 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-neutral-800 mb-4">Looking for Specific Information?</h2>
              <p className="text-neutral-600 max-w-3xl mx-auto">
                If you need specific information about environmental certifications or sustainability practices, our team is here to help.
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 text-center md:w-1/3">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold font-heading text-neutral-800 mb-2">Request a Consultation</h3>
                <p className="text-neutral-600 mb-4">Speak with our certification experts for personalized guidance and information.</p>
                <a href="/contact" className="text-primary font-medium hover:text-primary-dark">Contact Us</a>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 text-center md:w-1/3">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold font-heading text-neutral-800 mb-2">Custom Resource Guides</h3>
                <p className="text-neutral-600 mb-4">Request a custom guide tailored to your specific industry or needs.</p>
                <a href="/contact" className="text-primary font-medium hover:text-primary-dark">Request a Guide</a>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 text-center md:w-1/3">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold font-heading text-neutral-800 mb-2">Workshop Registration</h3>
                <p className="text-neutral-600 mb-4">Join our upcoming workshops and webinars on sustainability practices.</p>
                <a href="/contact" className="text-primary font-medium hover:text-primary-dark">View Schedule</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

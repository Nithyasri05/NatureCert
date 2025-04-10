import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import ResourceCard from '@/components/resources/resource-card';
import type { Resource } from '@shared/schema';

export default function ResourcesSection() {
  const { data: resources, isLoading, error } = useQuery<Resource[]>({
    queryKey: ['/api/resources'],
  });

  if (isLoading) {
    return (
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-neutral-800 mb-4">Educational Resources</h2>
            <p className="text-neutral-600 max-w-3xl mx-auto">Expand your knowledge about environmental certifications, sustainability practices, and how they impact our planet.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
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
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-neutral-800 mb-4">Error Loading Resources</h2>
            <p className="text-neutral-600">We're having trouble loading the resources. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-neutral-800 mb-4">Educational Resources</h2>
          <p className="text-neutral-600 max-w-3xl mx-auto">Expand your knowledge about environmental certifications, sustainability practices, and how they impact our planet.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources?.slice(0, 3).map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Button asChild variant="outline" className="border-primary text-primary bg-white hover:bg-primary hover:text-white">
            <Link href="/resources">
              Browse All Resources
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

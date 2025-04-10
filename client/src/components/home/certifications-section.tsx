import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import CertificationCard from '@/components/certifications/certification-card';
import type { Certification } from '@shared/schema';

export default function CertificationsSection() {
  const { data: certifications, isLoading, error } = useQuery<Certification[]>({
    queryKey: ['/api/certifications'],
  });

  if (isLoading) {
    return (
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-neutral-800 mb-4">Popular Environmental Certifications</h2>
            <p className="text-neutral-600 max-w-3xl mx-auto">Discover widely recognized environmental certifications that are making a significant impact on sustainability practices around the world.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm h-96 animate-pulse">
                <div className="h-48 bg-neutral-100"></div>
                <div className="p-6">
                  <div className="h-4 bg-neutral-100 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-neutral-100 rounded w-full mb-2"></div>
                  <div className="h-3 bg-neutral-100 rounded w-full mb-2"></div>
                  <div className="h-3 bg-neutral-100 rounded w-2/3 mb-4"></div>
                  <div className="h-3 bg-neutral-100 rounded w-1/2 mb-4"></div>
                  <div className="pt-4 border-t border-neutral-100 flex justify-between items-center">
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
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-neutral-800 mb-4">Error Loading Certifications</h2>
            <p className="text-neutral-600">We're having trouble loading the certifications. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold font-heading text-neutral-800 mb-4">Popular Environmental Certifications</h2>
          <p className="text-neutral-600 max-w-3xl mx-auto">Discover widely recognized environmental certifications that are making a significant impact on sustainability practices around the world.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications?.slice(0, 3).map((certification) => (
            <CertificationCard key={certification.id} certification={certification} />
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Button asChild variant="outline" className="border-primary text-primary bg-white hover:bg-primary hover:text-white">
            <Link href="/certifications">
              View All Certifications
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import CertificationCard from '@/components/certifications/certification-card';
import type { Certification } from '@shared/schema';

export default function Certifications() {
  const [location] = useLocation();
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [industry, setIndustry] = useState('');
  const [certificationType, setCertificationType] = useState('');
  const [region, setRegion] = useState('');
  
  // Parse current URL params for initial state
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const search = params.get('search');
    const industryParam = params.get('industry');
    const typeParam = params.get('type');
    const regionParam = params.get('region');
    
    if (search) setSearchTerm(search);
    if (industryParam) setIndustry(industryParam);
    if (typeParam) setCertificationType(typeParam);
    if (regionParam) setRegion(regionParam);
  }, []);
  
  // Construct query parameters for the API request
  const queryParams = new URLSearchParams();
  if (searchTerm) queryParams.append('search', searchTerm);
  if (industry) queryParams.append('category', industry);
  if (region) queryParams.append('region', region);
  
  const { data: certifications, isLoading, error } = useQuery<Certification[]>({
    queryKey: [`/api/certifications?${queryParams.toString()}`],
  });
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update the query parameters
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (industry) params.append('industry', industry);
    if (certificationType) params.append('type', certificationType);
    if (region) params.append('region', region);
    
    // Update URL without navigation
    window.history.pushState(
      {},
      '',
      `${window.location.pathname}?${params.toString()}`
    );
    
    // Refetch data
    // This would trigger a re-render with the new query parameters
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <div>
      <Header />
      <main>
        <section className="bg-primary text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">Environmental Certifications</h1>
            <p className="text-lg opacity-90 max-w-3xl mx-auto">
              Browse our comprehensive database of environmental certifications from around the world.
            </p>
          </div>
        </section>
        
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-xl bg-neutral-50 shadow-sm p-4 md:p-6">
              <form onSubmit={handleSearch}>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-neutral-400" />
                    </div>
                    <Input
                      type="text"
                      className="pl-10 pr-3 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Search for certifications, industries, or standards..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="inline-flex items-center px-4 py-2 border border-neutral-200 text-neutral-700 bg-white rounded-lg hover:bg-neutral-50"
                      onClick={toggleFilters}
                    >
                      <Filter className="mr-2 h-4 w-4" />
                      Filters
                    </Button>
                    <Button 
                      type="submit"
                      className="inline-flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                    >
                      Search
                    </Button>
                  </div>
                </div>
                
                {/* Filter options */}
                {showFilters && (
                  <div className="mt-4 pt-4 border-t border-neutral-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Industry</label>
                        <Select value={industry} onValueChange={setIndustry}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="All Industries" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All Industries</SelectItem>
                            <SelectItem value="Agriculture">Agriculture</SelectItem>
                            <SelectItem value="Forestry">Forestry</SelectItem>
                            <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                            <SelectItem value="Energy">Energy</SelectItem>
                            <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                            <SelectItem value="Construction">Construction</SelectItem>
                            <SelectItem value="Textiles">Textiles</SelectItem>
                            <SelectItem value="Social Responsibility">Social Responsibility</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Certification Type</label>
                        <Select value={certificationType} onValueChange={setCertificationType}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="All Types" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All Types</SelectItem>
                            <SelectItem value="Carbon Neutral">Carbon Neutral</SelectItem>
                            <SelectItem value="Organic">Organic</SelectItem>
                            <SelectItem value="Fair Trade">Fair Trade</SelectItem>
                            <SelectItem value="Energy Efficient">Energy Efficient</SelectItem>
                            <SelectItem value="Sustainable Forestry">Sustainable Forestry</SelectItem>
                            <SelectItem value="Recycled Content">Recycled Content</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Region</label>
                        <Select value={region} onValueChange={setRegion}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Global" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Global</SelectItem>
                            <SelectItem value="Global">Global</SelectItem>
                            <SelectItem value="North America">North America</SelectItem>
                            <SelectItem value="United States">United States</SelectItem>
                            <SelectItem value="Europe">Europe</SelectItem>
                            <SelectItem value="Asia-Pacific">Asia-Pacific</SelectItem>
                            <SelectItem value="Latin America">Latin America</SelectItem>
                            <SelectItem value="Africa">Africa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>
        
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
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
            ) : error ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-neutral-800 mb-4">Error Loading Certifications</h2>
                <p className="text-neutral-600">We encountered an error while fetching certifications. Please try again later.</p>
              </div>
            ) : certifications && certifications.length > 0 ? (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold font-heading text-neutral-800">
                    {searchTerm ? `Search Results for "${searchTerm}"` : 'All Certifications'}
                  </h2>
                  <p className="text-neutral-600 mt-2">
                    Showing {certifications.length} certifications
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {certifications.map((certification) => (
                    <CertificationCard key={certification.id} certification={certification} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-neutral-800 mb-4">No Certifications Found</h2>
                <p className="text-neutral-600">We couldn't find any certifications matching your criteria. Try adjusting your filters.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

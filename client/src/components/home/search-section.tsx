import { useState } from 'react';
import { useLocation } from 'wouter';
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

export default function SearchSection() {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [industry, setIndustry] = useState('');
  const [certificationType, setCertificationType] = useState('');
  const [region, setRegion] = useState('');
  const [, setLocation] = useLocation();

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (searchTerm) params.append('search', searchTerm);
    if (industry) params.append('industry', industry);
    if (certificationType) params.append('type', certificationType);
    if (region) params.append('region', region);
    
    setLocation(`/certifications?${params.toString()}`);
  };

  return (
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
                        <SelectItem value="North America">North America</SelectItem>
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
  );
}

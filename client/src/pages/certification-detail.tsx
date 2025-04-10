import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Globe, Award, ExternalLink, FileText, Users, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import type { Certification } from '@shared/schema';

export default function CertificationDetail() {
  const { id } = useParams();
  const certId = parseInt(id || '0', 10);
  
  const { data: certification, isLoading, error } = useQuery<Certification>({
    queryKey: [`/api/certifications/${certId}`],
    enabled: !!certId && !isNaN(certId),
  });

  if (isLoading) {
    return (
      <div>
        <Header />
        <main className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-neutral-100 rounded w-3/4 mb-6"></div>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <div className="h-64 bg-neutral-100 rounded-lg mb-4"></div>
                </div>
                <div className="md:w-2/3">
                  <div className="h-4 bg-neutral-100 rounded w-1/4 mb-4"></div>
                  <div className="h-3 bg-neutral-100 rounded w-full mb-2"></div>
                  <div className="h-3 bg-neutral-100 rounded w-full mb-2"></div>
                  <div className="h-3 bg-neutral-100 rounded w-3/4 mb-4"></div>
                  <div className="h-10 bg-neutral-100 rounded w-1/3 mt-6"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !certification) {
    return (
      <div>
        <Header />
        <main className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold text-neutral-800 mb-4">Error Loading Certification</h1>
            <p className="text-neutral-600 mb-6">We couldn't find the certification you're looking for.</p>
            <Button asChild>
              <Link href="/certifications">Back to All Certifications</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Function to render rating stars
  const renderRatingDots = (rating: number) => {
    return (
      <div className="flex space-x-1 items-center">
        <span className="text-sm font-medium text-neutral-600 mr-2">Rating:</span>
        {[1, 2, 3, 4, 5].map((dot) => (
          <span 
            key={dot}
            className={`inline-block w-3 h-3 rounded-full ${
              dot <= rating ? 'bg-success' : 'bg-neutral-200'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      <Header />
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/certifications" className="inline-flex items-center text-primary hover:underline mb-8">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to All Certifications
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6 md:p-8">
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                  <h1 className="text-3xl font-bold font-heading text-neutral-800">{certification.name}</h1>
                  <Badge variant="ecosystem" className="text-base px-3 py-1">{certification.category}</Badge>
                </div>
                
                <div className="mb-8">
                  <p className="text-neutral-600 text-lg leading-relaxed mb-4">{certification.description}</p>
                  
                  <div className="flex flex-wrap gap-6 mt-6">
                    <div className="flex items-center text-neutral-600">
                      <Globe className="h-5 w-5 mr-2 text-primary" /> 
                      <span>{certification.region}</span>
                    </div>
                    <div className="flex items-center text-neutral-600">
                      <Award className="h-5 w-5 mr-2 text-primary" /> 
                      <span>Established {certification.startYear}</span>
                    </div>
                    {renderRatingDots(certification.rating)}
                  </div>
                </div>
                
                <div className="border-t border-neutral-100 pt-8">
                  <h2 className="text-xl font-bold font-heading text-neutral-800 mb-4">Certification Requirements</h2>
                  <ul className="space-y-3 text-neutral-600">
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-light/20 text-primary mr-3 mt-0.5">1</span>
                      <span>Compliance with all relevant environmental regulations and laws</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-light/20 text-primary mr-3 mt-0.5">2</span>
                      <span>Implementation of sustainability management systems</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-light/20 text-primary mr-3 mt-0.5">3</span>
                      <span>Regular audits and transparent reporting of environmental impacts</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-light/20 text-primary mr-3 mt-0.5">4</span>
                      <span>Commitment to continuous improvement in environmental performance</span>
                    </li>
                    <li className="flex items-start">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-light/20 text-primary mr-3 mt-0.5">5</span>
                      <span>Staff training and stakeholder engagement in sustainability practices</span>
                    </li>
                  </ul>
                </div>
                
                <div className="border-t border-neutral-100 pt-8 mt-8">
                  <h2 className="text-xl font-bold font-heading text-neutral-800 mb-4">Environmental Benefits</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-neutral-50 p-4 rounded-lg">
                      <h3 className="font-bold text-neutral-800 mb-2">Reduced Carbon Footprint</h3>
                      <p className="text-neutral-600 text-sm">Average of 35% reduction in greenhouse gas emissions.</p>
                    </div>
                    <div className="bg-neutral-50 p-4 rounded-lg">
                      <h3 className="font-bold text-neutral-800 mb-2">Conservation of Resources</h3>
                      <p className="text-neutral-600 text-sm">Efficient use of natural resources and reduced waste generation.</p>
                    </div>
                    <div className="bg-neutral-50 p-4 rounded-lg">
                      <h3 className="font-bold text-neutral-800 mb-2">Ecosystem Protection</h3>
                      <p className="text-neutral-600 text-sm">Preservation of biodiversity and ecosystem services.</p>
                    </div>
                    <div className="bg-neutral-50 p-4 rounded-lg">
                      <h3 className="font-bold text-neutral-800 mb-2">Sustainable Practices</h3>
                      <p className="text-neutral-600 text-sm">Implementation of long-term sustainable business practices.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold font-heading text-neutral-800 mb-4">Need More Information?</h3>
                  <p className="text-neutral-600 mb-6">Contact our certification experts to learn more about how to obtain this certification for your business.</p>
                  <Button className="w-full">Get Certification Guidance</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold font-heading text-neutral-800 mb-4">Related Resources</h3>
                  <ul className="space-y-4">
                    <li>
                      <Link href="/resources" className="flex items-center text-primary hover:text-primary-dark">
                        <FileText className="h-4 w-4 mr-2" />
                        <span>Certification Implementation Guide</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/resources" className="flex items-center text-primary hover:text-primary-dark">
                        <Users className="h-4 w-4 mr-2" />
                        <span>Success Stories &amp; Case Studies</span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/resources" className="flex items-center text-primary hover:text-primary-dark">
                        <Building className="h-4 w-4 mr-2" />
                        <span>Industry Specific Requirements</span>
                      </Link>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold font-heading text-neutral-800 mb-4">Official Website</h3>
                  <p className="text-neutral-600 mb-4">Visit the official certification website for the most up-to-date information and resources.</p>
                  <Button variant="outline" className="w-full flex items-center justify-center" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      Visit Official Site <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

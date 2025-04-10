import { Link } from 'wouter';
import { ArrowRight, Globe, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import type { Certification } from '@shared/schema';

interface CertificationCardProps {
  certification: Certification;
}

export default function CertificationCard({ certification }: CertificationCardProps) {
  const renderRatingDots = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((dot) => (
          <span 
            key={dot}
            className={`inline-block w-2 h-2 rounded-full ${
              dot <= rating ? 'bg-success' : 'bg-neutral-200'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden card-hover-effect">
      <div className="h-48 bg-primary-light/10 flex items-center justify-center p-6">
        {certification.imageUrl ? (
          <img 
            src={certification.imageUrl} 
            alt={certification.name} 
            className="max-h-full object-contain" 
          />
        ) : (
          <div className="w-full h-full bg-primary/5 flex items-center justify-center text-primary/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"></path>
              <path d="M16 2v4"></path>
              <path d="M8 2v4"></path>
              <path d="M3 10h7"></path>
              <path d="M21 16.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"></path>
              <path d="m18.5 19.5 2.5 2.5"></path>
            </svg>
          </div>
        )}
      </div>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold text-lg text-neutral-800">{certification.name}</h3>
          <Badge variant="ecosystem">{certification.category}</Badge>
        </div>
        <p className="text-neutral-600 mb-4">{certification.description}</p>
        <div className="flex items-center text-sm text-neutral-500 mb-4">
          <Globe className="h-4 w-4 mr-1" /> <span>{certification.region}</span>
          <span className="mx-2">•</span>
          <Award className="h-4 w-4 mr-1" /> <span>Since {certification.startYear}</span>
        </div>
        <div className="pt-4 border-t border-neutral-100 flex justify-between items-center">
          {renderRatingDots(certification.rating)}
          <Link href={`/certifications/${certification.id}`} className="text-sm font-medium text-primary hover:text-primary-dark flex items-center">
            Learn more <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

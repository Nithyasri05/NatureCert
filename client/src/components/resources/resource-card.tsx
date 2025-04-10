import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import type { Resource } from '@shared/schema';

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <Card className="bg-white rounded-xl shadow-sm overflow-hidden card-hover-effect">
      <div className="h-48 relative">
        {resource.imageUrl ? (
          <img 
            src={resource.imageUrl} 
            alt={resource.title} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full bg-primary/5 flex items-center justify-center text-primary/30">
            {resource.type === 'Guide' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                <path d="M9 10h6"></path>
                <path d="M12 7v6"></path>
              </svg>
            )}
            {resource.type === 'Webinar' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="m10 7 5 3-5 3Z"></path>
                <rect width="20" height="14" x="2" y="3" rx="2"></rect>
                <path d="M12 17v4"></path>
                <path d="M8 21h8"></path>
              </svg>
            )}
            {resource.type === 'Case Study' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                <path d="M3 9h18"></path>
                <path d="M3 15h18"></path>
                <path d="M9 3v18"></path>
                <path d="M15 3v18"></path>
              </svg>
            )}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
          <span className="text-white font-medium">{resource.type}</span>
        </div>
      </div>
      <CardContent className="p-6">
        <h3 className="font-heading font-bold text-lg text-neutral-800 mb-2">{resource.title}</h3>
        <p className="text-neutral-600 mb-4 line-clamp-2">{resource.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-500">{resource.readTime}</span>
          <Link href={resource.link} className="text-sm font-medium text-primary hover:text-primary-dark flex items-center">
            {resource.type === 'Webinar' ? 'Watch now' : 'Read more'} <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

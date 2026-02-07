import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import type { Resource } from '@shared/schema';
import { useState } from 'react';

interface ResourceCardProps {
  resource: Resource;
}

function getYouTubeEmbed(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
    if (u.hostname === 'youtu.be') {
      const id = u.pathname.slice(1);
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
  } catch (e) {
    return null;
  }
  return null;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const [showPlayer, setShowPlayer] = useState(false);

  const isWebinar = resource.type === 'Webinar';
  const youTubeEmbed = isWebinar ? getYouTubeEmbed(resource.link) : null;

  const openPlayer = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setShowPlayer(true);
  };

  const closePlayer = () => setShowPlayer(false);

  return (
    <>
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
            {isWebinar ? (
              <a href={resource.link} onClick={openPlayer} className="text-sm font-medium text-primary hover:text-primary-dark flex items-center">
                Watch now <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            ) : (
              <Link href={resource.link} className="text-sm font-medium text-primary hover:text-primary-dark flex items-center">
                Read more <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      {showPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-3xl mx-4 bg-black rounded-lg overflow-hidden">
            <div className="relative pb-[56.25%]">{/* 16:9 container */}
              {youTubeEmbed ? (
                <iframe
                  src={youTubeEmbed}
                  title={resource.title}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video className="absolute inset-0 w-full h-full" controls>
                  <source src={resource.link} />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
            <div className="p-3 bg-black flex justify-end">
              <button onClick={closePlayer} className="text-white px-3 py-1 rounded bg-white/10">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

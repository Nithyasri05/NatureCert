import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-primary to-primary-dark text-white py-16 md:py-24">
      <div className="absolute inset-0 opacity-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <pattern id="pattern-circles" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
            <circle id="pattern-circle" cx="25" cy="25" r="12" fill="#ffffff"></circle>
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
        </svg>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:space-x-8">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading tracking-tight mb-4">
              Your Gateway to Sustainable Living
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Discover practical tips, eco-friendly alternatives, and join our community of environmental advocates making a difference.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                <Link href="/eco-challenges">
                  Join Eco Challenges
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white/10">
                <Link href="/eco-chatbot">
                  Ask Eco Assistant
                </Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="aspect-video bg-white/10 rounded-xl shadow-lg overflow-hidden p-6 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4 w-full">
                {/* Impact Stats */}
                <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-4xl font-bold">1000+</div>
                  <div className="text-sm opacity-90">Daily eco-friendly tips</div>
                </div>
                <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-4xl font-bold">30+</div>
                  <div className="text-sm opacity-90">Eco challenges you can complete</div>
                </div>
                <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-4xl font-bold">5M+</div>
                  <div className="text-sm opacity-90">Community members making a difference</div>
                </div>
                <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-4xl font-bold">24/7</div>
                  <div className="text-sm opacity-90">Eco assistant available to answer your questions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

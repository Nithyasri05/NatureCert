import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function Hero() {
  const scrollToToolkit = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document.getElementById('toolkit')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative overflow-hidden bg-[#17352a] py-14 text-white md:py-20">
      <div className="absolute inset-0 opacity-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <pattern id="pattern-circles" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
            <circle id="pattern-circle" cx="25" cy="25" r="12" fill="#ffffff"></circle>
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
        </svg>
      </div>
      <div className="soft-grid absolute inset-0 opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:space-x-8">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-amber-200">A practical sustainability toolkit</p>
            <h1 className="mb-4 text-3xl font-bold font-heading tracking-tight md:text-4xl lg:text-5xl">
              Make better choices with clearer information.
            </h1>
            <p className="mb-8 max-w-xl text-lg text-green-50/85 md:text-xl">
              NatureCert brings daily actions, recycling guidance, lower-waste swaps, live environmental updates, and an AI assistant into one calm workspace.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                <a href="#toolkit" onClick={scrollToToolkit}>
                  Explore the toolkit
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white/10">
                  <button type="button" onClick={() => window.dispatchEvent(new Event('openEcoAssistant'))}>
                    Ask the Eco Assistant
                </button>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-white/10 p-6 shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80"
                alt="Sunlight through a green forest"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-primary/75" />
              <div className="relative z-10 grid w-full grid-cols-2 gap-4">
                {/* Impact Stats */}
                <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">Daily guidance</div>
                  <div className="text-sm opacity-90">Practical eco-friendly tips</div>
                </div>
                <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">Smart choices</div>
                  <div className="text-sm opacity-90">Lower-waste alternatives</div>
                </div>
                <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">Live updates</div>
                  <div className="text-sm opacity-90">Environmental news and insights</div>
                </div>
                <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">Ask anytime</div>
                  <div className="text-sm opacity-90">AI guidance in the Eco Assistant</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useLocation } from 'wouter';
import { ArrowRight, Leaf, Recycle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Welcome() {
  const [, setLocation] = useLocation();
  
  const goToLogin = () => {
    setLocation('/auth');
  };

  return (
    <div className="soft-grid flex min-h-screen items-center bg-[#f8f7f1] px-4 py-8 sm:px-6">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[0_24px_80px_rgba(23,53,42,0.12)] md:grid-cols-[1.1fr_0.9fr]">
        <div className="bg-[#17352a] p-8 text-white sm:p-12">
          <div className="mb-16 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-200 text-[#17352a]"><Leaf className="h-5 w-5" /></span>
            <span className="font-heading text-xl font-bold tracking-tight">NatureCert</span>
          </div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-amber-200">Small actions. Better systems.</p>
          <h1 className="mb-5 text-4xl font-bold leading-tight md:text-5xl">A clearer way to live with less waste.</h1>
          <p className="max-w-lg text-lg text-green-50/80">Explore practical guidance, discover better everyday swaps, and use live environmental information to make your next decision count.</p>
          <div className="mt-10 flex flex-wrap gap-3 text-sm text-green-50/80">
            <span className="inline-flex items-center gap-2"><Recycle className="h-4 w-4 text-amber-200" /> Recycling guidance</span>
            <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4 text-amber-200" /> AI assistance</span>
          </div>
        </div>
        <div className="flex flex-col justify-center p-8 sm:p-12">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Start here</p>
          <h2 className="mb-3 text-2xl font-bold text-neutral-900">Build a more informed routine.</h2>
          <p className="mb-8 text-neutral-600">Create an account to save progress, follow challenges, and access the full NatureCert toolkit.</p>
          <Button size="lg" className="w-full justify-between" onClick={goToLogin}>
            Sign in or create an account <ArrowRight className="h-5 w-5" />
          </Button>
          <p className="mt-5 text-xs leading-relaxed text-neutral-500">By continuing, you agree to our Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
}
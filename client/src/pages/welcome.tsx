import { useLocation } from 'wouter';
import { Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Welcome() {
  const [, setLocation] = useLocation();
  
  const goToLogin = () => {
    setLocation('/auth');
  };

  return (
    <div className="soft-grid relative flex min-h-[100dvh] items-start justify-center overflow-y-auto bg-[#17352a] sm:items-center">
      <div className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-[#f8f7f1]/95 px-4 py-8 text-center sm:px-10 sm:py-12">
        <div className="absolute inset-x-0 top-0 h-2 bg-primary" />
        <div className="absolute inset-x-0 bottom-0 h-2 bg-primary" />
        <Leaf className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rotate-12 text-primary/5" aria-hidden="true" />
        <div className="relative z-10 w-full max-w-lg">
          <div className="mb-6 flex items-center justify-center">
            <span className="mr-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary sm:h-11 sm:w-11">
              <Leaf className="h-6 w-6 sm:h-7 sm:w-7" />
            </span>
            <span className="font-heading text-2xl font-bold text-neutral-800 sm:text-3xl">NatureCert</span>
          </div>
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary sm:text-xs sm:tracking-[0.2em]">Small actions. Better systems.</p>
          <h1 className="mb-3 text-3xl font-bold text-neutral-800 sm:text-5xl">Welcome</h1>
          <p className="mx-auto max-w-md text-base leading-relaxed text-neutral-600 sm:text-lg">Your practical guide to lower-waste habits, smarter everyday choices, and a more sustainable routine.</p>
          <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-neutral-500">
            Create an account to save progress, follow challenges, and access your NatureCert guidance.
          </p>
          <Button onClick={goToLogin} className="mt-9 h-12 w-full bg-primary text-sm font-semibold text-white shadow-md hover:bg-primary-dark sm:w-80">
            <Leaf className="mr-2 h-4 w-4" />
            Go Green
          </Button>
          <p className="mx-auto mt-6 max-w-sm text-xs leading-relaxed text-neutral-500">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
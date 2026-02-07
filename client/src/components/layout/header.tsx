import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetClose 
} from '@/components/ui/sheet';

interface NavLink {
  name: string;
  href: string;
}

const navLinks: NavLink[] = [
  { name: 'Home', href: '/home' },
  { name: 'Daily Tips', href: '/daily-tips' },
  { name: 'Eco Alternatives', href: '/eco-alternatives' },
  { name: 'Green News', href: '/green-news' },
  { name: 'Recycling Guide', href: '/recycling-guide' },
  { name: 'Eco Challenges', href: '/eco-challenges' },
  { name: 'Eco Chatbot', href: '/eco-chatbot' },
];

export default function Header() {
  const [location, setLocation] = useLocation();
  const [isAuth, setIsAuth] = useState(false);

  async function checkAuth() {
    try {
      const resp = await fetch('/api/user', { credentials: 'include' });
      setIsAuth(resp.ok);
    } catch (e) {
      setIsAuth(false);
    }
  }

  useEffect(() => {
    let mounted = true;
    if (mounted) checkAuth();

    // re-check on window focus
    const onFocus = () => checkAuth();
    window.addEventListener('focus', onFocus);

    // re-check when other parts of the app dispatch auth changes
    const onAuthChanged = () => checkAuth();
    window.addEventListener('authChanged', onAuthChanged as EventListener);

    return () => {
      mounted = false;
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('authChanged', onAuthChanged as EventListener);
    };
  }, []);

  async function handleLogout() {
    try {
      await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    } finally {
      setIsAuth(false);
      setLocation('/auth');
    }
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/home" className="flex-shrink-0 flex items-center">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary mr-2">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="font-heading font-bold text-xl text-primary">NatureCert</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {(() => {
              const visible = navLinks.filter((l) => isAuth || ["/recycling-guide"].includes(l.href));
              return visible.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href}
                  className={`${
                    location === link.href 
                      ? 'text-primary font-medium' 
                      : 'text-neutral-700 hover:text-primary font-medium'
                  }`}
                >
                  {link.name}
                </Link>
              ));
            })()}
            {isAuth ? (
              <button onClick={async () => { await handleLogout(); window.dispatchEvent(new Event('authChanged')); }} className="text-neutral-700 hover:text-primary font-medium">
                Logout
              </button>
            ) : (
              <Link href="/auth" className="text-neutral-700 hover:text-primary font-medium">Sign In</Link>
            )}
          </nav>
          
          {/* Mobile Menu */}
          <div className="md:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-neutral-700 hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[350px]">
                <div className="flex flex-col gap-6 mt-8">
                  {(() => {
                    const visible = navLinks.filter((l) => isAuth || ["/recycling-guide"].includes(l.href));
                    return visible.map((link) => (
                      <SheetClose asChild key={link.href}>
                        <Link
                          href={link.href}
                          className={`${
                            location === link.href
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'text-neutral-700 hover:bg-neutral-50 hover:text-primary'
                          } block px-3 py-2 rounded-md text-base font-medium`}
                        >
                          {link.name}
                        </Link>
                      </SheetClose>
                    ));
                  })()}
                  <div className="mt-6">
                    {isAuth ? (
                      <SheetClose asChild>
                        <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:bg-neutral-50">
                          Logout
                        </button>
                      </SheetClose>
                    ) : (
                      <SheetClose asChild>
                        <Link href="/auth" className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:bg-neutral-50">Sign In / Sign Up</Link>
                      </SheetClose>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

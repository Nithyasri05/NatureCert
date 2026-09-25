import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Leaf, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
];

export default function Header() {
  const [location, setLocation] = useLocation();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

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

  async function confirmLogout() {
    await handleLogout();
    window.dispatchEvent(new Event('authChanged'));
    setLogoutDialogOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-[#f8f7f1]/95 shadow-[0_1px_18px_rgba(23,53,42,0.06)] backdrop-blur supports-[backdrop-filter]:bg-[#f8f7f1]/85">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center">
            <Link href="/home" className="flex shrink-0 items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary sm:h-10 sm:w-10">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="font-heading text-lg font-bold tracking-tight text-primary sm:text-xl">NatureCert</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-4 xl:flex xl:gap-6" aria-label="Primary navigation">
            {isAuth === null ? (
              <div className="h-5 w-24 rounded bg-neutral-100 animate-pulse" aria-label="Loading navigation" />
            ) : navLinks.filter((l) => isAuth || ["/recycling-guide"].includes(l.href)).map((link) => (
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
            ))}
            {isAuth === null ? (
              <div className="h-5 w-14 rounded bg-neutral-100 animate-pulse" aria-label="Loading account navigation" />
            ) : isAuth ? (
              <button onClick={() => setLogoutDialogOpen(true)} className="inline-flex items-center gap-2 font-medium text-red-600 transition-colors hover:text-red-700">
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Logout
              </button>
            ) : (
              <Link href="/auth" className="text-neutral-700 hover:text-primary font-medium">Sign In</Link>
            )}
          </nav>
          
          {/* Mobile Menu */}
          <div className="flex items-center xl:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-neutral-700 hover:text-primary" aria-label="Open navigation menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[350px]">
                <div className="flex flex-col gap-6 mt-8">
                  {isAuth === null ? (
                    <div className="h-32 rounded-md bg-neutral-100 animate-pulse" aria-label="Loading navigation" />
                  ) : (
                    navLinks.filter((l) => isAuth || ["/recycling-guide"].includes(l.href)).map((link) => (
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
                    ))
                  )}
                  <div className="mt-6">
                    {isAuth === null ? null : isAuth ? (
                        <button onClick={() => setLogoutDialogOpen(true)} className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-base font-medium text-red-600 transition-colors hover:bg-red-50 hover:text-red-700">
                          <LogOut className="h-4 w-4" aria-hidden="true" />
                          Logout
                      </button>
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
        <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Log out of NatureCert?</AlertDialogTitle>
              <AlertDialogDescription>
                You will need to sign in again to access your account and saved progress.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => void confirmLogout()}>Log out</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </header>
  );
}

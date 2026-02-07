import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

interface Props {
  component: any;
}

export default function ProtectedRoute({ component: Component }: Props) {
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const resp = await fetch('/api/user', { credentials: 'include' });
        if (!mounted) return;
        if (resp.ok) setIsAuthed(true);
        else {
          setIsAuthed(false);
          toast({ title: 'Sign in required', description: 'Please sign in to access this page', variant: 'destructive' });
          setLocation('/auth');
        }
      } catch (e) {
        if (!mounted) return;
        setIsAuthed(false);
        toast({ title: 'Sign in required', description: 'Please sign in to access this page', variant: 'destructive' });
        setLocation('/auth');
      }
    })();
    return () => { mounted = false; };
  }, [setLocation, toast]);

  if (isAuthed === null) return null;
  if (!isAuthed) return null;
  return <Component />;
}

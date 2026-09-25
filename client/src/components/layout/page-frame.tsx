import type { ReactNode } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

interface PageFrameProps {
  children: ReactNode;
  contentClassName?: string;
  mainClassName?: string;
}

export function PageFrame({ children, contentClassName = 'max-w-none', mainClassName = '' }: PageFrameProps) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      <div className="flex-none"><Header /></div>
      <main className={`min-h-0 flex-1 overflow-y-auto mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 ${contentClassName} ${mainClassName}`}>
        {children}
      </main>
      <div className="flex-none"><Footer /></div>
    </div>
  );
}

interface PageIntroProps {
  eyebrow?: string;
  title: string;
  description: string;
  align?: 'left' | 'center';
}

export function PageIntro({ eyebrow, title, description, align = 'center' }: PageIntroProps) {
  return (
    <div className={`mb-8 ${align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl text-left'}`}>
      {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>}
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">{title}</h1>
      <p className="mt-3 text-base text-neutral-600 md:text-lg">{description}</p>
    </div>
  );
}
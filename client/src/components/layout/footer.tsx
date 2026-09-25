import { Link } from 'wouter';
import { Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="hidden flex-none border-t border-green-950 bg-[#17352a] text-white md:flex">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 py-6 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <Link href="/home" className="inline-flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-green-800">
            <Leaf className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="font-heading text-lg font-bold tracking-wide">NatureCert</span>
        </Link>
        <div className="text-left text-xs text-green-100/70 sm:text-right">
          Practical tools for lower-impact living · © 2026 NatureCert
        </div>
      </div>
    </footer>
  );
}

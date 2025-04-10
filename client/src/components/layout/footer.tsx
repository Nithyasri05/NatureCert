import { Link } from 'wouter';
import { Leaf, Twitter, Linkedin, Facebook, Instagram, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-8">
          <div>
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white mr-2">
                <Leaf className="h-5 w-5 text-primary" />
              </div>
              <span className="font-heading font-bold text-xl text-white">NatureCert</span>
            </div>
            <p className="text-neutral-300 mb-4">
              Your trusted source for information on environmental certifications and sustainable practices worldwide.
            </p>
            <p className="text-neutral-400 text-sm">© {new Date().getFullYear()} NatureCert. All rights reserved.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li><Link href="/certifications" className="text-neutral-300 hover:text-white transition">Certifications</Link></li>
              <li><Link href="/resources" className="text-neutral-300 hover:text-white transition">Resources</Link></li>
              <li><Link href="/impact" className="text-neutral-300 hover:text-white transition">Impact Data</Link></li>
              <li><Link href="/about" className="text-neutral-300 hover:text-white transition">News & Updates</Link></li>
              <li><Link href="/about" className="text-neutral-300 hover:text-white transition">Events</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/resources" className="text-neutral-300 hover:text-white transition">Certification Guides</Link></li>
              <li><Link href="/resources" className="text-neutral-300 hover:text-white transition">Case Studies</Link></li>
              <li><Link href="/resources" className="text-neutral-300 hover:text-white transition">Webinars</Link></li>
              <li><Link href="/resources" className="text-neutral-300 hover:text-white transition">Research Papers</Link></li>
              <li><Link href="/resources" className="text-neutral-300 hover:text-white transition">Industry Reports</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Subscribe</h3>
            <p className="text-neutral-300 mb-4">
              Stay updated with the latest in environmental certifications and sustainability practices.
            </p>
            <form className="mb-4 flex">
              <Input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-neutral-700 border-0 text-white placeholder-neutral-400 focus-visible:ring-1 focus-visible:ring-primary rounded-r-none"
              />
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white rounded-l-none">
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-white transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-neutral-700 text-neutral-400 text-sm flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0">
            <Link href="/about" className="hover:text-white transition mr-4">Privacy Policy</Link>
            <Link href="/about" className="hover:text-white transition mr-4">Terms of Service</Link>
            <Link href="/about" className="hover:text-white transition">Cookie Policy</Link>
          </div>
          <div>
            <p>Committed to environmental sustainability and transparency</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

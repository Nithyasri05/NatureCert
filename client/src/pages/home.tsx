import Hero from '@/components/home/hero';
import EcoFeaturesSection from '@/components/home/eco-features-section';
import ResourcesSection from '@/components/home/resources-section';
import ContactSection from '@/components/home/contact-section';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function Home() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <div className="flex-none"><Header /></div>
      <main className="min-h-0 flex-1 overflow-y-auto">
        <Hero />
        <EcoFeaturesSection />
        <ResourcesSection />
        <ContactSection />
      </main>
      <div className="flex-none"><Footer /></div>
    </div>
  );
}

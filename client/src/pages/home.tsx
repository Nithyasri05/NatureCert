import Hero from '@/components/home/hero';
import EcoFeaturesSection from '@/components/home/eco-features-section';
import ImpactSection from '@/components/home/impact-section';
import ResourcesSection from '@/components/home/resources-section';
import ContactSection from '@/components/home/contact-section';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function Home() {
  return (
    <div>
      <Header />
      <main>
        <Hero />
        <EcoFeaturesSection />
        <ImpactSection />
        <ResourcesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

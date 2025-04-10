import Hero from '@/components/home/hero';
import SearchSection from '@/components/home/search-section';
import CertificationsSection from '@/components/home/certifications-section';
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
        <SearchSection />
        <CertificationsSection />
        <ImpactSection />
        <ResourcesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/hero/HeroSection';
import { GrievanceStrip } from '@/components/grievance/GrievanceStrip';
import { SpineSection } from '@/components/spine/SpineSection';
import { ProofSection } from '@/components/proof/ProofSection';
import { FinalCTA } from '@/components/cta/FinalCTA';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <GrievanceStrip />
        <SpineSection />
        <ProofSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}

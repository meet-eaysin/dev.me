import FeaturesSection from '@/components/FeaturesSection';
import HeroSection from '@/components/HeroSection';
import Navbar from '@/components/Navbar';

export default function LandingPage() {
  return (
    <main className="bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
    </main>
  );
}

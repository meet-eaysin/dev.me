import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero';
import { FeatureSection } from '@/components/feature-section';
import { Footer } from '@/components/footer';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden px-4 supports-[overflow:clip]:overflow-clip">
      <Header />
      <main
        className={cn(
          'relative mx-auto max-w-6xl grow',
          'before:absolute before:-inset-y-14 before:-left-px before:w-px before:bg-border',
          'after:absolute after:-inset-y-14 after:-right-px after:w-px after:bg-border',
        )}
      >
        <HeroSection />
        <FeatureSection />
        <Footer />
      </main>
    </div>
  );
}

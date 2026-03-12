import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <section
      id="overview"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-24 md:px-12 lg:px-24"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-linear-to-b from-primary/15 via-background to-background" />
      </div>

      <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        <h1 className="mt-6 text-balance text-5xl font-heading leading-tight text-foreground md:text-6xl lg:text-7xl">
          Build a knowledge stack that moves with you.
        </h1>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button className="px-6" render={<Link href="#contact" />}>
            Start your workspace
            <ArrowRight className="size-4" />
          </Button>
          <Button
            variant="outline"
            className="px-6"
            render={<Link href="#features" />}
          >
            Explore features
          </Button>
        </div>
      </div>
    </section>
  );
}

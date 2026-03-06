import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex border border-border p-8 rounded-xl bg-card">
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-4xl font-bold tracking-tight">Mind Stack</h1>
          <p className="text-muted-foreground text-lg">
            Your personal knowledge base.
          </p>
          <div className="flex gap-4 mt-4">
            <Button>Get Started</Button>
            <Button variant="outline">Learn More</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

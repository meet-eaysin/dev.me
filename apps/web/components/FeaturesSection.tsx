import { BarChart3, Layers, Lock, Sparkles, Workflow } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Footer from '@/components/Footer';

const bentoItems = [
  {
    title: 'Unified workspace',
    description:
      'Bring docs, decisions, and delivery into one surface your team can align on.',
    icon: Layers,
    className: 'lg:col-span-4',
  },
  {
    title: 'Live signal',
    description:
      'Auto-summaries, status pulses, and highlights that keep momentum visible.',
    icon: Sparkles,
    className: 'lg:col-span-2',
  },
  {
    title: 'Smart workflows',
    description:
      'Turn every update into action with routing, owners, and follow-ups.',
    icon: Workflow,
    className: 'lg:col-span-3',
  },
  {
    title: 'Trust & control',
    description:
      'Role-based access, audit trails, and encryption across every workspace.',
    icon: Lock,
    className: 'lg:col-span-3',
  },
  {
    title: 'Performance insights',
    description:
      'Measure progress across initiatives with real-time trend analytics.',
    icon: BarChart3,
    className: 'lg:col-span-6',
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative flex min-h-screen flex-col px-6 py-24 md:px-12 lg:px-24"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Why choose us
          </p>
          <h2 className="mt-4 text-balance text-4xl font-heading font-semibold text-foreground md:text-5xl">
            Product-led insights that keep every team in sync.
          </h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-6">
          {bentoItems.map((item) => (
            <Card
              key={item.title}
              className={`border-border/80 bg-card/60 ${item.className}`}
            >
              <CardHeader>
                <div className="flex size-10 items-center justify-center rounded-lg border border-border/80 bg-muted/40 text-primary">
                  <item.icon className="size-5" />
                </div>
                <CardTitle className="mt-4 text-foreground">
                  {item.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {item.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <div className="mx-auto w-full max-w-6xl">
          <div className="border-t border-border/80 pt-8">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <p className="text-lg text-foreground">
                Ready to build a knowledge stack that lasts?
              </p>
              <Button>Schedule a demo</Button>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </section>
  );
}

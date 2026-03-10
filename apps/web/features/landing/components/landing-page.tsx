'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  FileText,
  Layers,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from '@/components/ui/card';

const features = [
  {
    title: 'Capture everything',
    description:
      'Save links, files, and notes. Mind Stack keeps context and metadata organized.',
    icon: FileText,
  },
  {
    title: 'Ask AI, get citations',
    description:
      'Grounded answers built on your documents, with sources you can trust.',
    icon: Bot,
  },
  {
    title: 'Graph intelligence',
    description:
      'Surface hidden relationships across projects, people, and concepts.',
    icon: BrainCircuit,
  },
  {
    title: 'Fast retrieval',
    description:
      'Search is tuned for recall and speed so you can find insights instantly.',
    icon: Search,
  },
  {
    title: 'Trusted sessions',
    description:
      'Cookie-based auth and session control keep your workspace protected.',
    icon: ShieldCheck,
  },
  {
    title: 'Scales with you',
    description:
      'Designed for teams and solo researchers who need reliable structure.',
    icon: Layers,
  },
];

const highlights = [
  {
    label: 'Knowledge capture',
    value: 'Store every resource in one place.',
  },
  {
    label: 'AI workflow',
    value: 'Summaries, transcripts, and retrieval.',
  },
  {
    label: 'Integrations',
    value: 'Notion + future connectors.',
  },
];

export function LandingPage() {
  return (
    <main className="bg-default min-h-screen">
      <section className="relative overflow-hidden border-b border-subtle">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(54,86,92,0.18),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(108,85,50,0.18),transparent_50%)]" />
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl space-y-6">
              <Badge variant="outline" className="w-fit">
                Built for knowledge workers
              </Badge>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Your knowledge stack, finally connected.
              </h1>
              <p className="text-subtle text-base leading-relaxed sm:text-lg">
                Mind Stack turns scattered notes into a living knowledge graph.
                Capture, connect, and ask AI questions with traceable answers.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button render={<Link href="/auth/login" />}>
                  Get started
                  <ArrowRight className="size-4" />
                </Button>
                <Button variant="outline" render={<Link href="/app/search" />}>
                  Explore search
                </Button>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                {highlights.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-full border border-border/60 px-3 py-1.5"
                  >
                    <span className="font-medium text-foreground">
                      {item.label}
                    </span>
                    <span className="mx-2 opacity-60">•</span>
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <Card className="w-full max-w-md">
              <CardHeader>
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Sparkles className="size-3.5" />
                  Daily workflow
                </div>
                <CardTitle>Today in Mind Stack</CardTitle>
                <CardDescription>
                  Review documents, ask the assistant, and ship insights.
                </CardDescription>
              </CardHeader>
              <CardPanel className="space-y-3">
                <div className="rounded-lg border border-border/60 p-3">
                  <p className="text-xs text-muted-foreground">Due for review</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">
                    6 documents
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Prioritized by freshness + relevance.
                  </p>
                </div>
                <div className="rounded-lg border border-border/60 p-3">
                  <p className="text-xs text-muted-foreground">Recent AI chats</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">
                    4 threads
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Continue conversations instantly.
                  </p>
                </div>
                <Button
                  className="w-full"
                  variant="outline"
                  render={<Link href="/app" />}
                >
                  Open dashboard
                </Button>
              </CardPanel>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Why Mind Stack
            </p>
            <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
              Build a system you can trust.
            </h2>
            <p className="text-subtle max-w-2xl text-base">
              Designed for fast recall, context-rich answers, and workflows that
              keep your knowledge current.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <feature.icon className="size-4 text-foreground" />
                    {feature.title}
                  </div>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-subtle bg-muted/30">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-foreground">
              Ready to connect your knowledge?
            </h3>
            <p className="text-subtle max-w-xl">
              Bring your sources together and let the AI assistant surface the
              patterns that matter.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button render={<Link href="/auth/login" />}>
              Start free
              <ArrowRight className="size-4" />
            </Button>
            <Button variant="outline" render={<Link href="/app/settings" />}>
              View settings
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

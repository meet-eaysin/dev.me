'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  CheckCheck,
  FileText,
  Layers,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from '@/components/ui/card';

const features = [
  {
    title: 'Capture and connect',
    description:
      'Save documents, links, and notes, then watch relationships emerge.',
    icon: FileText,
  },
  {
    title: 'AI answers with sources',
    description:
      'Ask the assistant and get citations tied to your original material.',
    icon: Bot,
  },
  {
    title: 'Graph intelligence',
    description:
      'Surface hidden paths between people, projects, and themes.',
    icon: BrainCircuit,
  },
  {
    title: 'Fast retrieval',
    description:
      'Search built for recall and speed so you never lose an insight.',
    icon: Search,
  },
  {
    title: 'Session control',
    description:
      'Cookie-based auth with revocation keeps access tight.',
    icon: ShieldCheck,
  },
  {
    title: 'Scales gracefully',
    description: 'From solo research to team knowledge ops.',
    icon: Layers,
  },
];

const workflow = [
  {
    title: 'Connect your sources',
    description: 'Bring docs, links, and notes into one space.',
    icon: FileText,
  },
  {
    title: 'Set your knowledge rules',
    description: 'Control what gets summarized, tagged, or surfaced.',
    icon: Sparkles,
  },
  {
    title: 'Ask and share',
    description: 'Answer questions with sources and share the result.',
    icon: Search,
  },
];

export function LandingPage() {
  return (
    <main className="bg-default min-h-screen">
      <section className="relative min-h-svh overflow-hidden border-b border-subtle">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -left-24 top-0 h-112 w-md rounded-full bg-[radial-gradient(circle,rgba(52,83,92,0.38),transparent_70%)]" />
          <div className="absolute right-0 top-16 h-128 w-lg rounded-full bg-[radial-gradient(circle,rgba(120,86,45,0.34),transparent_70%)]" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-[linear-gradient(to_top,rgba(10,11,12,0.18),transparent)]" />
        </div>

        <div className="mx-auto flex min-h-svh max-w-7xl items-center px-6 py-10 md:py-16">
          <div className="grid w-full gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-6">
              <Badge variant="outline" className="w-fit">
                Knowledge infrastructure for modern teams
              </Badge>
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Your knowledge, organized and explainable.
              </h1>
              <p className="text-subtle text-base leading-relaxed sm:text-lg">
                Mind Stack turns scattered links, notes, and files into a living
                knowledge graph—so you can find answers fast and trust every
                source.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button render={<Link href="/auth/login" />}>
                  Get started
                  <ArrowRight className="size-4" />
                </Button>
                <Button variant="outline" render={<Link href="/app" />}>
                  View workspace
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                No credit card required
              </p>
            </div>

            <Card className="w-full">
              <CardHeader>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2 font-medium">
                    <Sparkles className="size-3.5" />
                    Live preview
                  </div>
                  <Badge variant="outline">Live</Badge>
                </div>
                <CardTitle>Today’s Knowledge Pulse</CardTitle>
                <CardDescription>
                  Surface what matters, with context and citations.
                </CardDescription>
              </CardHeader>
              <CardPanel className="space-y-3">
                <div className="rounded-lg border border-border/60 p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <UserRound className="size-3.5" />
                    Research workspace • GMT+6
                  </div>
                  <div className="mt-3 grid grid-cols-7 gap-1 text-[10px] text-muted-foreground">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
                      <span key={d} className="text-center">
                        {d}
                      </span>
                    ))}
                    {Array.from({ length: 28 }).map((_, i) => (
                      <span
                        key={i}
                        className="flex h-6 items-center justify-center rounded-md border border-border/40"
                      >
                        {i + 1}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border/60 p-3">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Due for review
                    </p>
                    <p className="mt-1 text-lg font-semibold text-foreground">
                      7 documents
                    </p>
                  </div>
                  <Badge variant="outline">Today</Badge>
                </div>
                <Button
                  className="w-full"
                  variant="outline"
                  render={<Link href="/app" />}
                >
                  Open workspace
                </Button>
              </CardPanel>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Workflow
            </p>
            <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
              A knowledge flow you can trust.
            </h2>
            <p className="text-subtle text-base">
              Capture, enrich, and retrieve without losing context or source of
              truth.
            </p>
            <div className="flex flex-col gap-3">
              {workflow.map((step) => (
                <div
                  key={step.title}
                  className="flex items-start gap-3 rounded-lg border border-border/60 p-3"
                >
                  <div className="rounded-md border border-border/60 bg-muted/40 p-2">
                    <step.icon className="size-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
              <div className="flex flex-wrap gap-3">
                <Button render={<Link href="/auth/login" />}>Get started</Button>
                <Button variant="outline" render={<Link href="/app" />}>
                  Explore the app
                </Button>
              </div>
            </div>
          </div>

          <Card className="h-full">
            <CardHeader>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Preview
              </p>
              <CardTitle>Knowledge availability</CardTitle>
              <CardDescription>
                Set buffers, limit sessions, and define how work flows in.
              </CardDescription>
            </CardHeader>
            <CardPanel className="space-y-3">
              <div className="grid gap-2 rounded-lg border border-border/60 p-3 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Minimum notice</span>
                  <Badge variant="outline">24 hours</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Buffer before</span>
                  <Badge variant="outline">30 mins</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Buffer after</span>
                  <Badge variant="outline">30 mins</Badge>
                </div>
              </div>
              <div className="rounded-lg border border-border/60 p-3">
                <p className="text-xs text-muted-foreground">
                  Personal link
                </p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  mindstack.io/you
                </p>
              </div>
            </CardPanel>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Benefits
            </p>
            <h3 className="text-2xl font-semibold text-foreground">
              Your all-purpose knowledge platform.
            </h3>
            <p className="text-subtle max-w-2xl text-base">
              Discover advanced features that keep research flowing without the
              overload.
            </p>
          </div>
          <div className="hidden items-center gap-3 lg:flex">
            <Button render={<Link href="/auth/login" />}>Get started</Button>
            <Button variant="outline" render={<Link href="/app" />}>
              Book a demo
            </Button>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
      </section>

      <section className="border-t border-subtle bg-muted/30">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Security + reliability
            </p>
            <h3 className="text-2xl font-semibold text-foreground">
              Built with production-grade auth and auditability.
            </h3>
            <p className="text-subtle max-w-xl">
              Sessions are revocable, tokens are short-lived, and every answer
              is traceable back to source material.
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-2 rounded-full border border-border/60 px-3 py-1.5">
                <CheckCheck className="size-3.5" />
                HTTP-only cookies
              </span>
              <span className="flex items-center gap-2 rounded-full border border-border/60 px-3 py-1.5">
                <CheckCheck className="size-3.5" />
                Session revocation
              </span>
              <span className="flex items-center gap-2 rounded-full border border-border/60 px-3 py-1.5">
                <CheckCheck className="size-3.5" />
                OAuth ready
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button render={<Link href="/auth/login" />}>
              Start free
              <ArrowRight className="size-4" />
            </Button>
            <Button variant="outline" render={<Link href="/app/settings" />}>
              Configure workspace
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

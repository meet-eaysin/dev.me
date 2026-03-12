'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

const navLinks = [
  { label: 'Overview', href: '#overview' },
  { label: 'Features', href: '#features' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex h-16 items-center justify-between px-6 md:px-12 lg:px-24">
        <div className="flex items-center gap-4">
          <Link href="#overview" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <span className="text-sm font-semibold">MS</span>
            </div>
            <span className="text-sm font-semibold tracking-wide">Mind Stack</span>
          </Link>
          <span className="hidden rounded-full border border-border/70 bg-muted/40 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground lg:inline-flex">
            Product-led
          </span>
        </div>

        <div className="hidden items-center md:flex">
          <NavigationMenu align="start" className="justify-start">
            <NavigationMenuList className="gap-1">
              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <Link href="#overview">Overview</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Product</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[460px] gap-2 p-3 md:grid-cols-2">
                    <NavigationMenuLink>
                      <Link
                        href="#features"
                        className="rounded-md p-3 transition hover:bg-muted"
                      >
                        <div className="text-sm font-semibold text-foreground">
                          Bento highlights
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Product-led modules built for momentum.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink>
                      <Link
                        href="#features"
                        className="rounded-md p-3 transition hover:bg-muted"
                      >
                        <div className="text-sm font-semibold text-foreground">
                          Workflow signals
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Live status and action routing in one view.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink>
                      <Link
                        href="#overview"
                        className="rounded-md p-3 transition hover:bg-muted"
                      >
                        <div className="text-sm font-semibold text-foreground">
                          Workspace overview
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Align research, decisions, and execution.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink>
                      <Link
                        href="#features"
                        className="rounded-md p-3 transition hover:bg-muted"
                      >
                        <div className="text-sm font-semibold text-foreground">
                          Momentum reporting
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Track progress without extra overhead.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Company</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[360px] gap-2 p-3">
                    <NavigationMenuLink>
                      <Link
                        href="#contact"
                        className="rounded-md p-3 transition hover:bg-muted"
                      >
                        <div className="text-sm font-semibold text-foreground">
                          Contact sales
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Talk through enterprise requirements.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink>
                      <Link
                        href="#features"
                        className="rounded-md p-3 transition hover:bg-muted"
                      >
                        <div className="text-sm font-semibold text-foreground">
                          Security by design
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Permissioning and audit trails by default.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <Link href="#contact">Contact</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost">Log in</Button>
          <Button>Request access</Button>
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" />}>
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Navigate</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 px-6 pb-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-base text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
                <Button className="mt-4 w-full">Request access</Button>
                <Button variant="outline" className="w-full">
                  Log in
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

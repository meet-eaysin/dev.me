'use client';

import type { ReactNode } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Dock } from '@/features/workspace/components/dock';
import { ThreadPanel } from '@/features/workspace/components/thread-panel';
import { ThreadStreamProvider } from '@/features/workspace/components/thread-stream-context';

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <ThreadStreamProvider>
        <div className="relative flex h-screen flex-col bg-background text-foreground selection:bg-primary/10 overflow-hidden">
          <main className="relative flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-hidden px-4 pt-4 pb-28 md:px-8 lg:px-12 flex flex-col">
              <div className="mx-auto max-w-5xl w-full flex-1 flex flex-col min-h-0">
                {children}
              </div>
            </div>
          </main>

          <Dock />
          <ThreadPanel />
        </div>
      </ThreadStreamProvider>
    </TooltipProvider>
  );
}

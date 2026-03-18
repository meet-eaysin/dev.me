'use client';

import type { ReactNode } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Dock } from '@/features/workspace/components/dock';
import { ThreadStreamProvider } from '@/features/workspace/components/thread-stream-context';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <ThreadStreamProvider>
        <SidebarProvider>
          <div className="relative flex min-h-svh w-full overflow-hidden">
            <AppSidebar />
            <SidebarInset className="relative flex h-svh flex-1 flex-col overflow-hidden bg-background">
              <main className="relative flex-1 overflow-y-auto overflow-x-hidden pt-2 scroll-smooth">
                <div className="flex min-h-full flex-col pb-28">
                  {children}
                </div>
              </main>
              <Dock />
            </SidebarInset>
          </div>
        </SidebarProvider>
      </ThreadStreamProvider>
    </TooltipProvider>
  );
}

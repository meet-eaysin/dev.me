import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Dock } from '@/features/workspace/components/dock';
import { ThreadStreamProvider } from '@/features/workspace/components/thread-stream-context';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default async function WorkspaceLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value !== 'false';

  return (
    <TooltipProvider>
      <ThreadStreamProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
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

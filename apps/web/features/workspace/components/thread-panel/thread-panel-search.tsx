'use client';

import { Clock, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ThreadPanelSearchProps {
  isExpanded: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onExpand: () => void;
}

export function ThreadPanelSearch({
  isExpanded,
  searchQuery,
  onSearchChange,
  onExpand,
}: ThreadPanelSearchProps) {
  return (
    <div className="px-3 mb-4 h-10 shrink-0">
      <div className="relative h-10 w-full">
        <div
          className={cn(
            'absolute inset-0 transition-all duration-300',
            isExpanded
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-95 pointer-events-none',
          )}
        >
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              placeholder="Search threads..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-muted/50 border-none rounded-xl h-10 pl-9 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60"
            />
          </div>
        </div>
        <div
          className={cn(
            'absolute inset-0 transition-all duration-300 flex justify-center',
            !isExpanded
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-95 pointer-events-none',
          )}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={onExpand}
            className="size-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all group relative"
          >
            <Clock className="size-5" />
            <div className="absolute left-full ml-4 px-3 py-1.5 rounded-lg bg-foreground text-background text-[10px] font-bold tracking-wider uppercase whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-70 shadow-xl">
              Recent History
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}

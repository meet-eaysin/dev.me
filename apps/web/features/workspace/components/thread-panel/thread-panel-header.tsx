'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { LogoIcon } from '@/components/logo';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ThreadPanelHeaderProps {
  isExpanded: boolean;
  onCollapse: () => void;
}

export function ThreadPanelHeader({
  isExpanded,
  onCollapse,
}: ThreadPanelHeaderProps) {
  return (
    <div className="flex items-center px-4 py-6 mb-2 h-20 shrink-0 relative">
      <Link href="/" className="group relative flex items-center gap-3">
        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center transition-all group-hover:scale-105 group-hover:bg-primary/20 shrink-0">
          <LogoIcon className="size-6 text-primary" />
        </div>
        <div
          className={cn(
            'flex flex-col transition-all duration-150 origin-left overflow-hidden',
            isExpanded
              ? 'opacity-100 w-32 ml-0'
              : 'opacity-0 w-0 -ml-2 pointer-events-none',
          )}
        >
          <span className="text-sm font-bold tracking-tight whitespace-nowrap text-foreground/90">
            dev.me
          </span>
          <Badge
            variant="outline"
            size="sm"
            className="w-fit h-3.5 px-1 py-0 text-[8px] font-bold opacity-70"
          >
            BETA
          </Badge>
        </div>
        <Badge
          variant="default"
          size="sm"
          className={cn(
            'absolute -top-1 -right-1 px-1 h-3.5 min-w-8 text-[8px] font-black tracking-tighter transition-all duration-150',
            isExpanded
              ? 'opacity-0 scale-50 pointer-events-none'
              : 'opacity-100 scale-100',
          )}
        >
          BETA
        </Badge>
      </Link>
      <div
        className={cn(
          'absolute right-4 transition-all duration-150',
          isExpanded
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-50 pointer-events-none',
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onCollapse}
          className="size-8 rounded-lg"
        >
          <ChevronRight className="rotate-180 size-5" />
        </Button>
      </div>
    </div>
  );
}

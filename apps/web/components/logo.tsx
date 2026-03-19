import type React from 'react';
import { RotateCcwSquare, type LucideProps } from 'lucide-react';
import { cn } from '@/lib/utils';

export const LogoIcon = (props: LucideProps) => (
  <RotateCcwSquare {...props} className={cn('text-primary', props.className)} />
);

export const Logo = ({ className, ...props }: React.ComponentProps<'div'>) => (
  <div className={cn('flex items-center gap-2', className)} {...props}>
    <RotateCcwSquare className="size-6 text-primary shrink-0" />
    <span className="font-heading font-bold text-xl tracking-tight whitespace-nowrap">
      Recall
    </span>
  </div>
);

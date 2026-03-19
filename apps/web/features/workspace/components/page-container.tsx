'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  isFullHeight?: boolean;
}

export const PageContainer = React.forwardRef<
  HTMLDivElement,
  PageContainerProps
>(({ children, className, isFullHeight = false }, ref) => {
  return (
    <div
      ref={ref}
      className="w-full flex-1 min-h-0 flex flex-col overflow-y-auto scroll-smooth"
    >
      <div
        className={cn(
          'w-full flex flex-col min-h-full',
          !isFullHeight
            ? 'mx-auto max-w-5xl px-4 py-6 pb-24 md:px-6 lg:px-8'
            : 'flex-1 px-4 py-6 md:px-6 lg:px-8',
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
});
PageContainer.displayName = 'PageContainer';

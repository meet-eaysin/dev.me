'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  isFullHeight?: boolean;
}

export function PageContainer({
  children,
  className,
  isFullHeight = false,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        'w-full',
        !isFullHeight
          ? 'mx-auto max-w-5xl px-4 py-6 pb-24 md:px-6 lg:px-8'
          : 'flex min-h-0 flex-1 flex-col px-4 py-6 md:px-6 lg:px-8',
        className,
      )}
    >
      {children}
    </div>
  );
}

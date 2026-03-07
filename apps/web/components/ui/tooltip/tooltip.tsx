'use client';

import React from 'react';

export function Tooltip({
  children,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
  delayDuration?: number;
  className?: string;
  open?: boolean;
  defaultOpen?: boolean;
  side?: 'top' | 'right' | 'bottom' | 'left';
  onOpenChange?: (open: boolean) => void;
  sideOffset?: number;
}) {
  return <>{children}</>;
}

export default Tooltip;

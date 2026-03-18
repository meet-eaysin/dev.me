'use client';

import * as React from 'react';

export function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 px-4 transition-colors hover:bg-muted/30">
      <span className="shrink-0 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
      <span className="max-w-[65%] text-right text-xs font-medium text-foreground/80 break-all">
        {value}
      </span>
    </div>
  );
}

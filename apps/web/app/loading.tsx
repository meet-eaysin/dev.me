'use client';

import { useEffect, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';

export default function Loading() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 180);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Spinner className="text-muted-foreground h-7 w-7" />
      <span className="sr-only">Loading</span>
    </div>
  );
}

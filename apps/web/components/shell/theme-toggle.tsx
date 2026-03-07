'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-between px-2 py-1.5 flex-1">
        <span className="text-sm font-medium">Theme</span>
        <div className="h-5 w-8 rounded-full bg-muted animate-pulse" />
      </div>
    );
  }

  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium hover:bg-emphasis transition-colors"
    >
      <div className="flex items-center gap-2">
        {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        <span>Theme</span>
      </div>
      <div className="text-xs text-muted-foreground capitalize">{theme}</div>
    </button>
  );
}

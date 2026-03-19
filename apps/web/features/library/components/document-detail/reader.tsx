'use client';

import * as React from 'react';
import { ArrowUpRight, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DocumentPreviewSurface,
  DocumentPreviewUnavailable,
} from '../document-preview-surface';
import { useDocumentDetail } from './context';

export function DocumentDetailReader() {
  const { document } = useDocumentDetail();
  const [readerExpanded, setReaderExpanded] = React.useState(false);

  if (!document) return null;

  const hasContent = !!(document.sourceUrl || document.content);

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 ${
        readerExpanded
          ? 'ring-2 ring-primary/20 scale-[1.01]'
          : 'hover:shadow-md'
      }`}
    >
      <div className="absolute right-4 top-4 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
        {document.sourceUrl && (
          <a href={document.sourceUrl} rel="noreferrer" target="_blank">
            <Button
              size="icon-sm"
              variant="secondary"
              className="h-8 w-8 bg-background/80 backdrop-blur-sm border shadow-sm"
            >
              <ArrowUpRight className="size-4" />
            </Button>
          </a>
        )}
        <Button
          size="icon-sm"
          variant="secondary"
          className="h-8 w-8 bg-background/80 backdrop-blur-sm border shadow-sm"
          onClick={() => setReaderExpanded((v) => !v)}
        >
          {readerExpanded ? (
            <Minimize2 className="size-4" />
          ) : (
            <Maximize2 className="size-4" />
          )}
        </Button>
      </div>

      <div
        className={`w-full transition-all duration-500 ease-in-out ${
          readerExpanded
            ? 'h-[calc(100vh-12rem)] min-h-[82vh]'
            : 'h-[clamp(36rem,75vh,60rem)] shadow-inner'
        }`}
      >
        {hasContent ? (
          <DocumentPreviewSurface document={document} />
        ) : (
          <DocumentPreviewUnavailable sourceUrl={document.sourceUrl} />
        )}
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import { LoaderCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useDocumentDetail } from '../context';

export function SummaryTab() {
  const { id, document, actions } = useDocumentDetail();
  const [removeSummaryOpen, setRemoveSummaryOpen] = React.useState(false);

  if (!document) return null;

  async function handleRemoveSummary() {
    await actions.deleteSummary.mutateAsync(id);
    setRemoveSummaryOpen(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2 overflow-hidden border-none shadow-none bg-transparent">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            AI Summary
          </h3>
          <div className="flex items-center gap-2">
            {document.summary && (
              <Button
                onClick={() => setRemoveSummaryOpen(true)}
                size="sm"
                variant="ghost"
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                Remove
              </Button>
            )}
            <Button
              onClick={() => actions.generateSummary.mutate(id)}
              size="sm"
              disabled={actions.generateSummary.isPending}
              className="gap-2 shadow-sm"
            >
              {actions.generateSummary.isPending ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              {document.summary ? 'Regenerate' : 'Generate Summary'}
            </Button>
          </div>
        </div>

        <div className="prose prose-sm max-w-none prose-slate dark:prose-invert">
          {document.summary ? (
            <div className="rounded-xl border bg-card/50 p-6 shadow-sm backdrop-blur-sm">
              <p className="text-base leading-relaxed text-foreground/80 whitespace-pre-wrap">
                {document.summary}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed bg-muted/20 py-16 text-center">
              <div className="rounded-full bg-primary/10 p-4 ring-8 ring-primary/5">
                <Sparkles className="size-8 text-primary/60" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-medium text-foreground/80">
                  Enhance your reading
                </p>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Generate a concise, AI-powered summary to capture the core concepts and key takeaways.
                </p>
              </div>
              <Button
                onClick={() => actions.generateSummary.mutate(id)}
                variant="outline"
                className="mt-2"
              >
                Generate Now
              </Button>
            </div>
          )}
        </div>
      </Card>

      <div className="space-y-6">
        <Card className="p-5 border-primary/10 bg-primary/5 dark:bg-primary/10">
          <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">
            Quick Insights
          </h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm">
              <div className="mt-1 size-1.5 rounded-full bg-primary shrink-0" />
              <span className="text-foreground/70">
                Automatically identifies key themes and topics.
              </span>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <div className="mt-1 size-1.5 rounded-full bg-primary shrink-0" />
              <span className="text-foreground/70">
                Saves you time by distilling long content.
              </span>
            </li>
            <li className="flex items-start gap-3 text-sm">
              <div className="mt-1 size-1.5 rounded-full bg-primary shrink-0" />
              <span className="text-foreground/70">
                Context-aware generation based on your library.
              </span>
            </li>
          </ul>
        </Card>
      </div>

      <ConfirmationDialog
        open={removeSummaryOpen}
        openChangeAction={setRemoveSummaryOpen}
        confirmAction={handleRemoveSummary}
        isPending={actions.deleteSummary.isPending}
        title="Remove summary?"
        description="This removes the generated summary from the document. You can generate it again later."
        confirmLabel="Remove summary"
        tone="destructive"
      />
    </div>
  );
}

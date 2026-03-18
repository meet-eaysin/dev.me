'use client';

import * as React from 'react';
import { LoaderCircle, RefreshCcw, X, Zap } from 'lucide-react';
import { IngestionStatus } from '@repo/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDocumentDetail } from '../context';
import { MetaRow } from '../meta-row';

export function DetailsTab() {
  const { id, document, ingestion, actions } = useDocumentDetail();

  if (!document) return null;

  const canRetryIngestion =
    ingestion?.ingestionStatus === IngestionStatus.FAILED &&
    !ingestion.embeddingsReady;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card className="p-6 space-y-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-bold flex items-center gap-2">
            <Zap className="size-5 text-amber-500" />
            Ingestion Pipeline
          </h3>
          <Button
            onClick={() => actions.retryIngestion.mutate(id)}
            size="sm"
            variant="outline"
            disabled={!canRetryIngestion || actions.retryIngestion.isPending}
            className="h-8 gap-2"
          >
            {actions.retryIngestion.isPending ? (
              <LoaderCircle className="size-3.5 animate-spin" />
            ) : (
              <RefreshCcw className="size-3.5" />
            )}
            Retry Pipeline
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40">
            <span className="text-sm font-medium text-muted-foreground">
              Pipeline Status
            </span>
            <Badge
              className={`px-3 py-1 font-semibold ${
                ingestion?.ingestionStatus === IngestionStatus.COMPLETED
                  ? 'bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-500/10 dark:text-green-400'
                  : ingestion?.ingestionStatus === IngestionStatus.FAILED
                    ? 'bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400'
                    : 'bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400'
              }`}
            >
              {ingestion?.ingestionStatus ?? 'Unknown'}
            </Badge>
          </div>

          <div className="grid gap-1 border rounded-xl overflow-hidden divide-y">
            <MetaRow
              label="Embedding Vector"
              value={ingestion?.embeddingsReady ? 'Ready & Indexed' : 'Pending'}
            />
            <MetaRow
              label="Semantic Stage"
              value={ingestion?.currentStage ?? 'Ready'}
            />
            <MetaRow
              label="Source Connector"
              value={document.sourceType ?? 'Direct Upload'}
            />
            <MetaRow label="Original ID" value={document.id} />
          </div>

          {ingestion?.ingestionError && (
            <div className="p-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-500/5 dark:border-red-500/20 text-sm text-red-600 dark:text-red-400 flex items-start gap-3">
              <X className="size-5 shrink-0 mt-0.5" />
              <p className="font-medium italic">{ingestion.ingestionError}</p>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6 space-y-6 shadow-sm">
        <h3 className="font-bold">Lifecycle & Metadata</h3>
        <div className="grid gap-1 border rounded-xl overflow-hidden divide-y">
          <MetaRow
            label="Created On"
            value={new Date(document.createdAt).toLocaleString()}
          />
          <MetaRow
            label="Last Modified"
            value={new Date(document.updatedAt).toLocaleString()}
          />
          <MetaRow
            label="Last Read"
            value={
              document.lastOpenedAt
                ? new Date(document.lastOpenedAt).toLocaleString()
                : 'Never opened'
            }
          />
        </div>

        {Object.keys(document.metadata).length > 0 && (
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Raw JSON Metadata
            </p>
            <ScrollArea className="h-48 rounded-xl border bg-muted/20 p-4">
              <pre className="text-xs leading-relaxed font-mono">
                {JSON.stringify(document.metadata, null, 2)}
              </pre>
            </ScrollArea>
          </div>
        )}
      </Card>
    </div>
  );
}

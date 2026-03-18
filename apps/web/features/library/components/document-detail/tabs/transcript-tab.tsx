'use client';

import * as React from 'react';
import { Brain, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDocumentDetail } from '../context';

export function TranscriptTab() {
  const { id, document, transcript, actions } = useDocumentDetail();

  if (!document) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">Video Transcript</h3>
          <p className="text-sm text-muted-foreground">
            Full extraction of the audio content from the video source.
          </p>
        </div>
        <Button
          onClick={() => actions.generateTranscript.mutate(id)}
          disabled={actions.generateTranscript.isPending}
          variant="outline"
          className="gap-2"
        >
          {actions.generateTranscript.isPending ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <Brain className="size-4" />
          )}
          {transcript?.content ? 'Regenerate Transcript' : 'Generate Transcript'}
        </Button>
      </div>

      {transcript?.content ? (
        <div className="rounded-2xl border bg-muted/30 overflow-hidden">
          <ScrollArea className="h-[60vh] max-h-[800px]">
            <div className="p-8">
              <p className="text-base leading-relaxed text-foreground/80 whitespace-pre-wrap font-mono-subtle">
                {transcript.content}
              </p>
            </div>
          </ScrollArea>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-5 py-20 text-center rounded-2xl border border-dashed">
          <div className="rounded-full bg-muted p-6">
            <Brain className="size-10 text-muted-foreground/30" />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-lg">No transcript available</p>
            <p className="text-sm text-muted-foreground max-w-sm">
              Generate a transcript to search through video content and save
              highlights.
            </p>
          </div>
          <Button
            onClick={() => actions.generateTranscript.mutate(id)}
            className="mt-2"
          >
            Start Processing
          </Button>
        </div>
      )}
    </div>
  );
}

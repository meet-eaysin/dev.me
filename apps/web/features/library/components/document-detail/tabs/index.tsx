'use client';

import * as React from 'react';
import { Brain, Sparkles, StickyNote, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useDocumentDetail } from '../context';
import { SummaryTab } from './summary-tab';
import { NotesTab } from './notes-tab';
import { TranscriptTab } from './transcript-tab';
import { DetailsTab } from './details-tab';

export function DocumentDetailTabs() {
  const { document, notes } = useDocumentDetail();

  if (!document) return null;

  const isYoutubeDocument = document.type === 'youtube';

  return (
    <Tabs defaultValue="summary" className="w-full">
      <TabsList className="h-11 w-full justify-start rounded-none border-b bg-transparent p-0">
        <TabsTrigger
          value="summary"
          className="relative rounded-none border-b-2 border-transparent px-6 py-2.5 font-semibold text-muted-foreground transition-all data-[state=active]:border-primary data-[state=active]:text-primary"
        >
          <Sparkles className="mr-2 size-4" />
          Summary
        </TabsTrigger>
        <TabsTrigger
          value="notes"
          className="relative rounded-none border-b-2 border-transparent px-6 py-2.5 font-semibold text-muted-foreground transition-all data-[state=active]:border-primary data-[state=active]:text-primary"
        >
          <StickyNote className="mr-2 size-4" />
          Notes
          {notes.length > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 px-1.5 tabular-nums">
              {notes.length}
            </Badge>
          )}
        </TabsTrigger>
        {isYoutubeDocument && (
          <TabsTrigger
            value="transcript"
            className="relative rounded-none border-b-2 border-transparent px-6 py-2.5 font-semibold text-muted-foreground transition-all data-[state=active]:border-primary data-[state=active]:text-primary"
          >
            <Brain className="mr-2 size-4" />
            Transcript
          </TabsTrigger>
        )}
        <TabsTrigger
          value="details"
          className="relative rounded-none border-b-2 border-transparent px-6 py-2.5 font-semibold text-muted-foreground transition-all data-[state=active]:border-primary data-[state=active]:text-primary"
        >
          <Zap className="mr-2 size-4" />
          Technical Details
        </TabsTrigger>
      </TabsList>

      <div className="mt-8">
        <TabsContent value="summary" className="focus-visible:outline-none">
          <SummaryTab />
        </TabsContent>

        <TabsContent value="notes" className="focus-visible:outline-none">
          <NotesTab />
        </TabsContent>

        {isYoutubeDocument && (
          <TabsContent value="transcript" className="focus-visible:outline-none">
            <TranscriptTab />
          </TabsContent>
        )}

        <TabsContent value="details" className="focus-visible:outline-none">
          <DetailsTab />
        </TabsContent>
      </div>
    </Tabs>
  );
}

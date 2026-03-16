'use client';

import * as React from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { Search, Sparkles, Command, ArrowRight } from 'lucide-react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Button } from '@/components/ui/button';
import { searchApi } from '@/features/search/api';
import { QUERY_KEYS } from '@/lib/query-keys';
import { useThreadStream } from './thread-stream-context';

export function OmniBox() {
  const queryClient = useQueryClient();
  const threadStream = useThreadStream();
  const [query, setQuery] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async () => {
    const trimmed = query.trim();
    if (!trimmed || isSubmitting) return;

    setIsSubmitting(true);
    setQuery('');

    try {
      const signal = threadStream.setStream({
        answer: '',
        conversationId: '', // Will be set on conversation event
        error: null,
        isStreaming: true,
        question: trimmed,
      });

      await searchApi.streamAsk(
        { question: trimmed },
        {
          signal,
          onEvent: (event) => {
            if (event.type === 'conversation') {
              // Update conversation id without aborting the active stream
              threadStream.updateStream({
                conversationId: event.conversationId,
              });
              // Silently update URL for bookmarkability — no navigation
              window.history.replaceState(
                null,
                '',
                `/app/t/${event.conversationId}`,
              );
              return;
            }

            if (event.type === 'delta') {
              threadStream.updateAnswer(event.chunk);
              return;
            }

            if (event.type === 'error') {
              threadStream.failStream(event.message);
              const activeId = threadStream.activeStream?.conversationId;
              if (activeId) {
                queryClient.invalidateQueries({
                  queryKey: QUERY_KEYS.SEARCH.chat(activeId),
                });
              }
              queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.SEARCH.chats(),
              });
              setIsSubmitting(false);
              return;
            }

            if (event.type === 'done') {
              threadStream.completeStream();
              if (event.data?.conversationId) {
                queryClient.invalidateQueries({
                  queryKey: QUERY_KEYS.SEARCH.chat(event.data.conversationId),
                });
              }
              queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.SEARCH.chats(),
              });
              setIsSubmitting(false);
            }
          },
        },
      );
    } catch (error) {
      console.error('Failed to start thread:', error);
      threadStream.failStream(
        error instanceof Error ? error.message : 'Failed to connect to AI',
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold sm:text-4xl">
          What&apos;s on your mind?
        </h1>
        <p className="text-muted-foreground">
          Search your library or ask AI to synthesize knowledge.
        </p>
      </div>

      <InputGroup data-align="center">
        <InputGroupAddon>
          <InputGroupText>
            <Search className="size-4 text-muted-foreground" />
          </InputGroupText>
        </InputGroupAddon>

        <InputGroupInput
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              void handleSubmit();
            }
          }}
          placeholder="Filter by topic, ask a question, or jump to a thread..."
        />

        <InputGroupAddon align="inline-end">
          <div className="flex items-center gap-2 px-1">
            <div className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
              <Command className="size-3" /> K
            </div>
            <Button
              size="sm"
              onClick={() => void handleSubmit()}
              disabled={isSubmitting || !query.trim()}
            >
              {isSubmitting ? (
                <ArrowRight className="mr-2 size-4" />
              ) : (
                <Sparkles className="mr-2 size-4" />
              )}
              Ask AI
            </Button>
          </div>
        </InputGroupAddon>
      </InputGroup>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-sm text-muted-foreground">Try:</span>
        {[
          'Summarize my recent docs',
          'Find Notion sync issues',
          'Research the MindStack graph',
        ].map((hint) => (
          <Button
            key={hint}
            variant="outline"
            size="xs"
            onClick={() => setQuery(hint)}
          >
            {hint}
          </Button>
        ))}
      </div>
    </div>
  );
}

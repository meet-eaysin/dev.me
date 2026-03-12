'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import {
  useSearchChats,
  useDeleteChat,
  useArchiveChat,
  useClearHistory,
} from '@/features/search/hooks';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ThreadPanelHeader } from './thread-panel-header';
import { ThreadPanelSearch } from './thread-panel-search';
import { ThreadItem } from './thread-item';
import { ThreadPanelFooter } from './thread-panel-footer';

export function ThreadPanel() {
  const { data: chats, isLoading } = useSearchChats();
  const deleteChat = useDeleteChat();
  const archiveChat = useArchiveChat();
  const clearHistory = useClearHistory();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredChats = React.useMemo(() => {
    if (!chats) return [];
    if (!searchQuery.trim()) return chats;
    const query = searchQuery.toLowerCase();
    return chats.filter(
      (chat) =>
        chat.title.toLowerCase().includes(query) ||
        chat.lastMessagePreview?.toLowerCase().includes(query),
    );
  }, [chats, searchQuery]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'h' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsExpanded((prev) => !prev);
      }
    };

    const handleToggle = () => setIsExpanded((prev) => !prev);

    document.addEventListener('keydown', down);
    window.addEventListener('mind-stack:toggle-threads', handleToggle);
    return () => {
      document.removeEventListener('keydown', down);
      window.removeEventListener('mind-stack:toggle-threads', handleToggle);
    };
  }, []);

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 h-screen bg-background border-r border-subtle z-30 hidden lg:flex flex-col transition-[width] duration-300 ease-in-out shadow-[1px_0_10px_rgba(0,0,0,0.02)] overflow-hidden',
        isExpanded ? 'w-80' : 'w-16',
      )}
    >
      <ThreadPanelHeader
        isExpanded={isExpanded}
        onCollapse={() => setIsExpanded(false)}
      />

      <ThreadPanelSearch
        isExpanded={isExpanded}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onExpand={() => setIsExpanded(true)}
      />

      <div className="w-8 h-px bg-linear-to-r from-transparent via-subtle to-transparent mx-auto mb-2 shrink-0" />

      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1 pb-4">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'w-full animate-pulse rounded-xl bg-muted/50 mb-1',
                    isExpanded ? 'h-20' : 'h-10',
                  )}
                />
              ))
            : filteredChats.map((chat) => (
                <ThreadItem
                  key={chat.id}
                  chat={chat}
                  isActive={pathname.includes(chat.id)}
                  isExpanded={isExpanded}
                  onArchive={(id) =>
                    archiveChat.mutate({ id, isArchived: true })
                  }
                  onDelete={(id) => deleteChat.mutate(id)}
                />
              ))}
        </div>
      </ScrollArea>

      <ThreadPanelFooter
        isExpanded={isExpanded}
        onClearHistory={() => clearHistory.mutate()}
      />
    </aside>
  );
}

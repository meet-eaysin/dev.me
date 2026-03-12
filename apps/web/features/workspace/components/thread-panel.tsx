'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MessageSquare,
  Clock,
  ChevronRight,
  Search,
  Settings,
  Trash2,
  Archive,
  MoreVertical,
  History,
  Trash,
} from 'lucide-react';
import {
  useSearchChats,
  useDeleteChat,
  useArchiveChat,
  useClearHistory,
} from '@/features/search/hooks';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import {
  Menu,
  MenuTrigger,
  MenuPopup,
  MenuItem,
} from '@/components/ui/menu';
import { formatDistanceToNow } from 'date-fns';

export function ThreadPanel() {
  const { data: chats, isLoading } = useSearchChats();
  const deleteChat = useDeleteChat();
  const archiveChat = useArchiveChat();
  const clearHistory = useClearHistory();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
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

  // Keyboard shortcut and custom event to toggle panel
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'h' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    const handleToggle = () => setIsOpen((open) => !open);

    document.addEventListener('keydown', down);
    window.addEventListener('mind-stack:toggle-threads', handleToggle);
    return () => {
      document.removeEventListener('keydown', down);
      window.removeEventListener('mind-stack:toggle-threads', handleToggle);
    };
  }, []);

  return (
    <>
      {/* Persistent mini-sidebar on large screens */}
      <aside className="fixed top-0 left-0 h-screen w-0 lg:w-16 bg-background border-r border-subtle z-40 hidden lg:flex flex-col items-center py-6 gap-6 shadow-[1px_0_10px_rgba(0,0,0,0.02)]">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(true)}
          className="size-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all group relative"
        >
          <Clock className="size-5" />
          <div className="absolute left-full ml-4 px-3 py-1.5 rounded-lg bg-foreground text-background text-[10px] font-bold tracking-wider uppercase whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-xl">
            Recent History
          </div>
        </Button>
          <div className="w-8 h-px bg-linear-to-r from-transparent via-subtle to-transparent mx-auto" />
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto no-scrollbar py-2">
          {chats?.slice(0, 10).map((chat) => (
            <Link
              key={chat.id}
              href={`/app/t/${chat.id}`}
              className={cn(
                'size-10 rounded-xl flex items-center justify-center transition-all duration-300 group relative',
                pathname.includes(chat.id)
                  ? 'bg-primary/20 text-primary shadow-[0_0_15px_rgba(var(--primary),0.2)]'
                  : 'bg-muted/30 text-muted-foreground hover:bg-primary/10 hover:text-primary'
              )}
            >
              <MessageSquare className="size-4" />
              <div className="absolute left-full ml-4 px-3 py-2 rounded-lg bg-background border border-subtle text-foreground text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-2xl min-w-[120px]">
                <p className="font-semibold truncate max-w-[180px]">{chat.title}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {formatDistanceToNow(new Date(chat.updatedAt))} ago
                </p>
              </div>
              {pathname.includes(chat.id) && (
                <div className="absolute -left-0.5 top-1/4 bottom-1/4 w-1 bg-primary rounded-full shadow-[0_0_10px_var(--primary)]" />
              )}
            </Link>
          ))}
        </div>
        <div className="w-8 h-px bg-linear-to-r from-transparent via-subtle to-transparent mx-auto" />
        <Button
          variant="secondary"
          size="icon"
          className="size-10 rounded-xl bg-muted/50 hover:bg-muted text-muted-foreground transition-all"
          onClick={() => setIsOpen(true)}
        >
          <Settings className="size-4" />
        </Button>
      </aside>

      {/* Main Drawer */}
      <Drawer direction="left" open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="h-full w-80 rounded-none border-r border-subtle">
          <DrawerHeader className="border-b border-subtle flex flex-row items-center justify-between px-4 shrink-0">
            <DrawerTitle className="text-sm font-semibold tracking-tight">
              Recent Threads
            </DrawerTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <ChevronRight className="rotate-180 size-5" />
            </Button>
          </DrawerHeader>

          <div className="flex-1 overflow-hidden flex flex-col pt-4">
            <div className="px-4 pb-4">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  placeholder="Search threads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-muted/50 border-none rounded-xl py-2.5 pl-9 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/60"
                />
              </div>
            </div>

            <ScrollArea className="flex-1 px-2">
              <div className="space-y-1 pb-4">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-20 w-full animate-pulse rounded-xl bg-muted/50 mb-1"
                    />
                  ))
                ) : filteredChats.length === 0 ? (
                  <div className="px-4 py-8 text-center text-muted-foreground text-sm flex flex-col items-center gap-2">
                    <History className="size-8 opacity-20" />
                    <span>No results for &quot;{searchQuery}&quot;</span>
                  </div>
                ) : (
                  filteredChats.map((chat) => {
                    const isActive = pathname.includes(chat.id);
                    return (
                      <div key={chat.id} className="relative group/item mb-1">
                        <Link
                          href={`/app/t/${chat.id}`}
                          onClick={() => setIsOpen(false)}
                          className={cn(
                            'flex flex-col gap-1.5 p-3.5 rounded-xl transition-all duration-300',
                            isActive
                              ? 'bg-primary/10 border border-primary/20 pr-12'
                              : 'hover:bg-muted/80 border border-transparent pr-12'
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={cn(
                                'text-sm font-semibold truncate transition-colors',
                                isActive ? 'text-primary' : 'text-foreground group-hover/item:text-primary/80'
                              )}
                            >
                              {chat.title}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground/80 line-clamp-2 leading-relaxed transition-opacity group-hover/item:opacity-80">
                            {chat.lastMessagePreview || 'No preview available'}
                          </p>
                          <p className="text-[10px] text-muted-foreground/50 mt-1 font-medium italic">
                            {formatDistanceToNow(new Date(chat.updatedAt))} ago
                          </p>
                        </Link>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center gap-1">
                          <Menu>
                            <MenuTrigger render={
                              <Button variant="ghost" size="icon" className="size-8 rounded-lg hover:bg-muted-foreground/10">
                                <MoreVertical className="size-4" />
                              </Button>
                            } />
                            <MenuPopup side="right" align="start" className="min-w-32">
                              <MenuItem onSelect={() => archiveChat.mutate({ id: chat.id, isArchived: true })}>
                                <Archive className="size-4 mr-2" />
                                <span>Archive</span>
                              </MenuItem>
                              <MenuItem 
                                onSelect={() => deleteChat.mutate(chat.id)}
                                variant="destructive"
                              >
                                <Trash2 className="size-4 mr-2" />
                                <span>Delete</span>
                              </MenuItem>
                            </MenuPopup>
                          </Menu>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </div>

          <div className="p-4 border-t border-subtle bg-muted/20 flex flex-col gap-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 rounded-xl text-xs font-semibold hover:bg-primary/5 hover:border-primary/30 transition-all border-dashed"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="size-3.5" />
              Manage History
            </Button>
            <ConfirmationDialog
              title="Clear Chat History"
              description="Are you sure you want to clear all your chat history? This action cannot be undone."
              confirmLabel="Clear All"
              tone="destructive"
              onConfirm={() => clearHistory.mutate()}
              trigger={
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive transition-all"
                >
                  <Trash className="size-3.5" />
                  Clear All History
                </Button>
              }
            />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

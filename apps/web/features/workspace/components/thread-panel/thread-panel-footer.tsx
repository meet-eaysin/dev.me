'use client';

import { Settings, Trash } from 'lucide-react';
import { UserDropdown } from '@/components/user-dropdown';
import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

interface ThreadPanelFooterProps {
  isExpanded: boolean;
  onClearHistory: () => void;
}

export function ThreadPanelFooter({
  isExpanded,
  onClearHistory,
}: ThreadPanelFooterProps) {
  return (
    <div className="mt-auto p-3 border-t border-subtle bg-muted/5 shrink-0">
      {/* Expanded footer actions */}
      {isExpanded && (
        <div className="flex flex-col gap-1.5 mb-3">
          <Button
            variant="outline"
            className="w-full justify-start gap-3 rounded-xl text-[10px] h-8 font-semibold hover:bg-primary/5 hover:border-primary/30 transition-all border-dashed"
          >
            <Settings className="size-3" />
            Manage History
          </Button>
          <ConfirmationDialog
            title="Clear Chat History"
            description="Are you sure you want to clear all your chat history? This action cannot be undone."
            confirmLabel="Clear All"
            tone="destructive"
            confirmAction={onClearHistory}
            trigger={
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 rounded-xl text-[10px] h-8 font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive transition-all"
              >
                <Trash className="size-3" />
                Clear History
              </Button>
            }
          />
        </div>
      )}

      {/* UserDropdown — always visible */}
      <div className="flex items-center justify-center">
        <UserDropdown small={!isExpanded} />
      </div>
    </div>
  );
}

'use client';

import * as React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Clock, LoaderCircle, PencilLine, StickyNote, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useDocumentDetail } from '../context';

export function NotesTab() {
  const { id, notes, actions } = useDocumentDetail();
  const [noteDraft, setNoteDraft] = React.useState('');
  const [deletingNoteId, setDeletingNoteId] = React.useState<string | null>(null);
  const [editingNoteId, setEditingNoteId] = React.useState<string | null>(null);
  const [editingNoteDraft, setEditingNoteDraft] = React.useState('');

  async function handleCreateNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = noteDraft.trim();
    if (!content) return;
    await actions.createNote.mutateAsync({ content, documentId: id });
    setNoteDraft('');
  }

  function handleStartEditingNote(noteId: string, content: string) {
    setEditingNoteId(noteId);
    setEditingNoteDraft(content);
  }

  function handleCancelEditingNote() {
    setEditingNoteId(null);
    setEditingNoteDraft('');
  }

  async function handleSaveNote(noteId: string) {
    const content = editingNoteDraft.trim();
    if (!content) return;
    await actions.updateNote.mutateAsync({ id: noteId, content });
    handleCancelEditingNote();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-bold">Research Notes</h3>
          <p className="text-sm text-muted-foreground">
            Capture your thoughts and takeaways as you digest the content.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleCreateNote}
        className="group relative rounded-2xl border bg-card p-6 shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary/20 hover:shadow-md"
      >
        <Textarea
          onChange={(e) => setNoteDraft(e.target.value)}
          onKeyDown={(event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
              event.preventDefault();
              const form = event.currentTarget.form;
              form?.requestSubmit();
            }
          }}
          placeholder="Type your note here... (Cmd + Enter to save)"
          value={noteDraft}
          className="min-h-[140px] resize-none border-none bg-transparent p-0 text-base shadow-none focus-visible:ring-0 leading-relaxed"
        />
        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Clock className="size-3" />
            Notes are private to your workspace.
          </p>
          <Button
            disabled={!noteDraft.trim() || actions.createNote.isPending}
            className="px-6 h-9"
          >
            {actions.createNote.isPending ? (
              <LoaderCircle className="size-4 animate-spin mr-2" />
            ) : (
              <StickyNote className="size-4 mr-2" />
            )}
            Add Note
          </Button>
        </div>
      </form>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <div className="rounded-full bg-muted p-6">
            <StickyNote className="size-8 text-muted-foreground/30" />
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            No notes captured for this document yet. Start typing above to save
            your first insight.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {notes.map((note) => (
            <article
              key={note.id}
              className="group/note flex flex-col rounded-xl border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-sm"
            >
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-muted">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {formatDistanceToNow(new Date(note.createdAt), {
                    addSuffix: true,
                  })}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover/note:opacity-100 transition-opacity">
                  <Button
                    onClick={() => handleStartEditingNote(note.id, note.content)}
                    size="icon-sm"
                    variant="ghost"
                    className="h-7 w-7"
                  >
                    <PencilLine className="size-3.5" />
                  </Button>
                  <Button
                    onClick={() => setDeletingNoteId(note.id)}
                    size="icon-sm"
                    variant="ghost"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>

              {editingNoteId === note.id ? (
                <div className="space-y-3">
                  <Textarea
                    value={editingNoteDraft}
                    onChange={(event) => setEditingNoteDraft(event.target.value)}
                    autoFocus
                    className="min-h-[100px] text-sm resize-none"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      onClick={handleCancelEditingNote}
                      variant="ghost"
                      size="sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => void handleSaveNote(note.id)}
                      size="sm"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm leading-relaxed text-foreground/85 whitespace-pre-wrap flex-1">
                  {note.content}
                </p>
              )}
            </article>
          ))}
        </div>
      )}

      <ConfirmationDialog
        open={deletingNoteId !== null}
        openChangeAction={(open) => {
          if (!open) setDeletingNoteId(null);
        }}
        confirmAction={() => actions.deleteNote.mutateAsync(deletingNoteId!)}
        isPending={actions.deleteNote.isPending}
        title="Delete note?"
        description="This note will be removed permanently from the document."
        confirmLabel="Delete note"
        tone="destructive"
      />
    </div>
  );
}

'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { DocumentStatus } from '@repo/types';
import {
  ArrowUpRight,
  Brain,
  LoaderCircle,
  MoreHorizontal,
  RefreshCcw,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty';
import { Field, FieldLabel } from '@/components/ui/field';
import {
  Menu,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from '@/components/ui/menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  useCreateNote,
  useDeleteDocument,
  useDeleteNote,
  useDeleteSummary,
  useDocument,
  useDocumentIngestion,
  useDocumentTranscript,
  useFolders,
  useGenerateSummary,
  useGenerateTranscript,
  useNotes,
  useRetryIngestion,
  useUpdateDocument,
} from '../hooks';
import {
  DocumentPreviewSurface,
  DocumentPreviewUnavailable,
} from './document-preview-surface';
import { getStatusLabel, getTypeLabel } from '../utils/document-helpers';

const STATUS_OPTIONS = Object.values(DocumentStatus);

export function DocumentDetailView({ id }: { id: string }) {
  const router = useRouter();
  const [noteDraft, setNoteDraft] = React.useState('');
  const { data: document, error, isLoading } = useDocument(id);
  const { data: ingestion } = useDocumentIngestion(id);
  const { data: transcriptResponse, error: transcriptError } =
    useDocumentTranscript(id);
  const { data: notes = [] } = useNotes(id);
  const { data: folders = [] } = useFolders();
  const updateDocument = useUpdateDocument(id);
  const generateSummary = useGenerateSummary(id);
  const deleteSummary = useDeleteSummary(id);
  const generateTranscript = useGenerateTranscript(id);
  const retryIngestion = useRetryIngestion(id);
  const createNote = useCreateNote(id);
  const deleteDocument = useDeleteDocument();
  const deleteNote = useDeleteNote(id);

  const folder = folders.find((item) => item.id === document?.folderId);

  async function handleDeleteDocument() {
    if (!document) return;
    if (!window.confirm(`Delete "${document.title}"?`)) return;

    await deleteDocument.mutateAsync(document.id);
    router.push('/library');
  }

  async function handleCreateNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = noteDraft.trim();
    if (!content) return;

    await createNote.mutateAsync({ content, documentId: id });
    setNoteDraft('');
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-128 w-full" />
      </div>
    );
  }

  if (error || !document) {
    return (
      <Card>
        <CardContent className="p-6">
          <Empty className="py-8">
            <EmptyHeader>
              <EmptyTitle>Document not available</EmptyTitle>
              <EmptyDescription>
                {(error as Error | undefined)?.message ??
                  'The document could not be loaded.'}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button render={<Link href="/library" />} variant="outline">
                Back to Library
              </Button>
            </EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-2">
            <CardTitle>{document.title}</CardTitle>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary">{getStatusLabel(document.status)}</Badge>
              <span>
                {[getTypeLabel(document.type), folder?.name]
                  .filter(Boolean)
                  .join(' · ')}
              </span>
              <span>
                Updated{' '}
                {formatDistanceToNow(new Date(document.updatedAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>

          <Menu>
            <MenuTrigger
              render={
                <Button size="icon-sm" variant="outline">
                  <MoreHorizontal className="size-4" />
                </Button>
              }
            />
            <MenuPopup align="end">
              {document.sourceUrl && (
                <MenuItem
                  render={
                    <a href={document.sourceUrl} rel="noreferrer" target="_blank" />
                  }
                >
                  <ArrowUpRight className="size-4" />
                  Open Source
                </MenuItem>
              )}
              <MenuSeparator />
              <MenuItem onClick={handleDeleteDocument} variant="destructive">
                <Trash2 className="size-4" />
                Delete
              </MenuItem>
            </MenuPopup>
          </Menu>
        </CardHeader>
        <CardContent className="max-w-sm">
          <Field>
            <FieldLabel>Status</FieldLabel>
            <Select
              onValueChange={(value) =>
                updateDocument.mutate({ status: value as DocumentStatus })
              }
              value={document.status}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {getStatusLabel(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="min-h-128 overflow-hidden rounded-b-2xl border-t bg-muted/20">
                {document.sourceUrl || document.content ? (
                  <DocumentPreviewSurface document={document} />
                ) : (
                  <DocumentPreviewUnavailable sourceUrl={document.sourceUrl} />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle>Summary</CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={() => generateSummary.mutate(id)}
                  size="sm"
                  variant="outline"
                >
                  {generateSummary.isPending ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <Sparkles className="size-4" />
                  )}
                  Generate
                </Button>
                {document.summary ? (
                  <Button
                    onClick={() => deleteSummary.mutate(id)}
                    size="sm"
                    variant="ghost"
                  >
                    Remove
                  </Button>
                ) : null}
              </div>
            </CardHeader>
            <CardContent className="whitespace-pre-wrap text-sm text-muted-foreground">
              {document.summary ?? 'No summary generated yet.'}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle>Notes</CardTitle>
              <span className="text-sm text-muted-foreground">
                {notes.length} notes
              </span>
            </CardHeader>
            <CardContent className="space-y-4">
              <form className="space-y-3" onSubmit={handleCreateNote}>
                <Textarea
                  onChange={(event) => setNoteDraft(event.target.value)}
                  placeholder="Capture takeaways, action items, or references."
                  value={noteDraft}
                />
                <div className="flex justify-end">
                  <Button disabled={!noteDraft.trim() || createNote.isPending}>
                    {createNote.isPending ? 'Saving...' : 'Add Note'}
                  </Button>
                </div>
              </form>

              {notes.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No notes yet for this document.
                </p>
              ) : (
                <div className="space-y-3">
                  {notes.map((note) => (
                    <Card key={note.id}>
                      <CardHeader className="flex flex-row items-center justify-between gap-3">
                        <div className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(note.createdAt), {
                            addSuffix: true,
                          })}
                        </div>
                        <Button
                          onClick={() => deleteNote.mutate(note.id)}
                          size="sm"
                          variant="ghost"
                        >
                          Delete
                        </Button>
                      </CardHeader>
                      <CardContent className="whitespace-pre-wrap text-sm">
                        {note.content}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle>Transcript</CardTitle>
              <Button
                onClick={() => generateTranscript.mutate(id)}
                size="sm"
                variant="outline"
              >
                {generateTranscript.isPending ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Brain className="size-4" />
                )}
                Generate
              </Button>
            </CardHeader>
            <CardContent className="whitespace-pre-wrap text-sm text-muted-foreground">
              {transcriptResponse?.content ??
                (transcriptError
                  ? 'Transcript is not available for this document yet.'
                  : 'No transcript generated yet.')}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <CardTitle>Details</CardTitle>
              <Button
                onClick={() => retryIngestion.mutate(id)}
                size="sm"
                variant="outline"
              >
                {retryIngestion.isPending ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <RefreshCcw className="size-4" />
                )}
                Retry
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <MetaRow
                label="Ingestion status"
                value={ingestion?.ingestionStatus ?? 'unknown'}
              />
              <MetaRow
                label="Embeddings"
                value={ingestion?.embeddingsReady ? 'Ready' : 'Pending'}
              />
              <MetaRow label="Source type" value={document.sourceType} />
              <MetaRow
                label="Created"
                value={new Date(document.createdAt).toLocaleString()}
              />
              <MetaRow
                label="Updated"
                value={new Date(document.updatedAt).toLocaleString()}
              />
              <MetaRow
                label="Last opened"
                value={
                  document.lastOpenedAt
                    ? new Date(document.lastOpenedAt).toLocaleString()
                    : 'Not tracked'
                }
              />
              {ingestion?.currentStage ? (
                <p className="text-muted-foreground">{ingestion.currentStage}</p>
              ) : null}
              {ingestion?.ingestionError ? (
                <p className="text-destructive">{ingestion.ingestionError}</p>
              ) : null}
              {Object.keys(document.metadata).length > 0 ? (
                <div className="space-y-2 pt-2">
                  <p className="text-muted-foreground">Metadata</p>
                  <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
                    {JSON.stringify(document.metadata, null, 2)}
                  </pre>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}

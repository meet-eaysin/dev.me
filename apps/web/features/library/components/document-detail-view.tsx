'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { DocumentStatus, IngestionStatus } from '@repo/types';
import {
  ArrowUpRight,
  Brain,
  ChevronLeft,
  Clock,
  FileText,
  LoaderCircle,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  PencilLine,
  RefreshCcw,
  Sparkles,
  StickyNote,
  Trash2,
  X,
  Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toastManager } from '@/components/ui/toast';
import {
  useCreateNote,
  useDeleteDocument,
  useDeleteNote,
  useDeleteSummary,
  useDocument,
  useDocumentIngestion,
  useDocumentTranscript,
  useGenerateSummary,
  useGenerateTranscript,
  useNotes,
  useRetryIngestion,
  useUpdateDocument,
  useUpdateNote,
} from '../hooks';
import {
  DocumentPreviewSurface,
  DocumentPreviewUnavailable,
} from './document-preview-surface';
import {
  getStatusBadgeVariant,
  getStatusLabel,
  getTypeLabel,
} from '../utils/document-helpers';

const STATUS_OPTIONS = Object.values(DocumentStatus);

export function DocumentDetailView({ id }: { id: string }) {
  const router = useRouter();
  const [noteDraft, setNoteDraft] = React.useState('');
  const [deleteDocumentOpen, setDeleteDocumentOpen] = React.useState(false);
  const [removeSummaryOpen, setRemoveSummaryOpen] = React.useState(false);
  const [deletingNoteId, setDeletingNoteId] = React.useState<string | null>(
    null,
  );
  const [editingNoteId, setEditingNoteId] = React.useState<string | null>(null);
  const [editingNoteDraft, setEditingNoteDraft] = React.useState('');
  const [readerExpanded, setReaderExpanded] = React.useState(false);

  const { data: document, error, isLoading } = useDocument(id);
  const { data: ingestion } = useDocumentIngestion(id);
  const isYoutubeDocument = document?.type === 'youtube';
  const { data: transcriptResponse } =
    useDocumentTranscript(id, isYoutubeDocument);
  const { data: notes = [] } = useNotes(id);
  const updateDocument = useUpdateDocument(id);
  const generateSummary = useGenerateSummary(id);
  const deleteSummary = useDeleteSummary(id);
  const generateTranscript = useGenerateTranscript(id);
  const retryIngestion = useRetryIngestion(id);
  const createNote = useCreateNote(id);
  const deleteDocument = useDeleteDocument();
  const deleteNote = useDeleteNote(id);
  const updateNote = useUpdateNote(id);

  const canRetryIngestion =
    ingestion?.ingestionStatus === IngestionStatus.FAILED &&
    !ingestion.embeddingsReady;

  function showTranscriptUnavailableToast() {
    toastManager.add({
      title: 'Transcript unavailable',
      description: 'This is available only for YouTube documents.',
      type: 'info',
    });
  }

  function handleGenerateTranscript() {
    if (!isYoutubeDocument) {
      showTranscriptUnavailableToast();
      return;
    }
    generateTranscript.mutate(id);
  }

  async function handleDeleteDocument() {
    if (!document) return;
    await deleteDocument.mutateAsync(document.id);
    router.push('/app/library');
  }

  async function handleDeleteNote(noteId: string) {
    await deleteNote.mutateAsync(noteId);
    setDeletingNoteId(null);
  }

  async function handleRemoveSummary() {
    await deleteSummary.mutateAsync(id);
    setRemoveSummaryOpen(false);
  }

  async function handleCreateNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = noteDraft.trim();
    if (!content) return;
    await createNote.mutateAsync({ content, documentId: id });
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
    await updateNote.mutateAsync({ id: noteId, content });
    handleCancelEditingNote();
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-7 w-1/2" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-5 h-[600px] w-full" />
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="max-w-md w-full border-dashed">
          <CardContent className="p-10">
            <Empty>
              <EmptyHeader>
                <EmptyTitle>Document not available</EmptyTitle>
                <EmptyDescription>
                  {(error as Error | undefined)?.message ??
                    'The document could not be loaded.'}
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  render={<Link href="/app/library" />}
                  variant="outline"
                  size="sm"
                >
                  <ChevronLeft className="size-4" />
                  Back to Library
                </Button>
              </EmptyContent>
            </Empty>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasContent = !!(document.sourceUrl || document.content);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 pb-3 mb-2">
        <div className="min-w-0 space-y-3">
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <Button
              variant="ghost"
              size="icon-sm"
              className="-ml-2 h-8 w-8"
              render={<Link href="/app/library" />}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-xs font-medium uppercase tracking-wider">Document Library</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground/90">
            {document.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            <Badge
              variant={getStatusBadgeVariant(document.status)}
              className="rounded-full px-3 py-1 text-xs font-semibold"
            >
              <div className="flex items-center gap-1.5">
                <div className={`size-1.5 rounded-full ${
                  document.status === DocumentStatus.ARCHIVED ? 'bg-muted-foreground' :
                  'bg-green-500'
                }`} />
                {getStatusLabel(document.status)}
              </div>
            </Badge>
            {document.type && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                <FileText className="size-3.5 opacity-70" />
                {getTypeLabel(document.type)}
              </span>
            )}
            <Separator orientation="vertical" className="h-4 hidden sm:block" />
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="size-3.5 opacity-70" />
              Updated{' '}
              {formatDistanceToNow(new Date(document.updatedAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 pt-10">
          <Select
            onValueChange={(value) =>
              updateDocument.mutate({ status: value as DocumentStatus })
            }
            value={document.status}
          >
            <SelectTrigger className="h-9 w-40 text-sm font-medium">
              <SelectValue>{getStatusLabel(document.status)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status} value={status} className="text-sm">
                  {getStatusLabel(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Menu>
            <MenuTrigger
              render={
                <Button size="icon" variant="outline" className="h-9 w-9">
                  <MoreHorizontal className="size-4.5" />
                </Button>
              }
            />
            <MenuPopup align="end" className="w-48">
              {document.sourceUrl && (
                <MenuItem
                  render={
                    <a
                      href={document.sourceUrl}
                      rel="noreferrer"
                      target="_blank"
                    />
                  }
                >
                  <ArrowUpRight className="size-4" />
                  Open Original Source
                </MenuItem>
              )}
              <MenuSeparator />
              <MenuItem
                onClick={() => setDeleteDocumentOpen(true)}
                variant="destructive"
              >
                <Trash2 className="size-4" />
                Delete Document
              </MenuItem>
            </MenuPopup>
          </Menu>
        </div>
      </div>

      <section className="space-y-8">
        <div
          className={`group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all duration-300 ${
            readerExpanded ? 'ring-2 ring-primary/20 scale-[1.01]' : 'hover:shadow-md'
          }`}
        >
          <div className="absolute right-4 top-4 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
            {document.sourceUrl && (
              <a href={document.sourceUrl} rel="noreferrer" target="_blank">
                <Button
                  size="icon-sm"
                  variant="secondary"
                  className="h-8 w-8 bg-background/80 backdrop-blur-sm border shadow-sm"
                >
                  <ArrowUpRight className="size-4" />
                </Button>
              </a>
            )}
            <Button
              size="icon-sm"
              variant="secondary"
              className="h-8 w-8 bg-background/80 backdrop-blur-sm border shadow-sm"
              onClick={() => setReaderExpanded((v) => !v)}
            >
              {readerExpanded ? (
                <Minimize2 className="size-4" />
              ) : (
                <Maximize2 className="size-4" />
              )}
            </Button>
          </div>

          <div
            className={`w-full transition-all duration-500 ease-in-out ${
              readerExpanded
                ? 'h-[calc(100vh-12rem)] min-h-[82vh]'
                : 'h-[clamp(36rem,75vh,60rem)] shadow-inner'
            }`}
          >
            {hasContent ? (
              <DocumentPreviewSurface document={document} />
            ) : (
              <DocumentPreviewUnavailable sourceUrl={document.sourceUrl} />
            )}
          </div>
        </div>

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
                        onClick={() => generateSummary.mutate(id)}
                        size="sm"
                        disabled={generateSummary.isPending}
                        className="gap-2 shadow-sm"
                      >
                        {generateSummary.isPending ? (
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
                           onClick={() => generateSummary.mutate(id)}
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
                      <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Quick Insights</h4>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-sm">
                           <div className="mt-1 size-1.5 rounded-full bg-primary shrink-0" />
                           <span className="text-foreground/70">Automatically identifies key themes and topics.</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm">
                           <div className="mt-1 size-1.5 rounded-full bg-primary shrink-0" />
                           <span className="text-foreground/70">Saves you time by distilling long content.</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm">
                           <div className="mt-1 size-1.5 rounded-full bg-primary shrink-0" />
                           <span className="text-foreground/70">Context-aware generation based on your library.</span>
                        </li>
                      </ul>
                   </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="focus-visible:outline-none">
              <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">Research Notes</h3>
                    <p className="text-sm text-muted-foreground">Capture your thoughts and takeaways as you digest the content.</p>
                  </div>
                </div>

                <form
                  onSubmit={handleCreateNote}
                  className="group relative rounded-2xl border bg-card p-6 shadow-sm transition-all focus-within:ring-2 focus-within:ring-primary/20 hover:shadow-md"
                >
                  <Textarea
                    onChange={(e) => setNoteDraft(e.target.value)}
                    onKeyDown={(event) => {
                      if (
                        (event.metaKey || event.ctrlKey) &&
                        event.key === 'Enter'
                      ) {
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
                      disabled={!noteDraft.trim() || createNote.isPending}
                      className="px-6 h-9"
                    >
                      {createNote.isPending ? (
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
                      No notes captured for this document yet. Start typing above to save your first insight.
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
                             {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
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
                              <Button onClick={handleCancelEditingNote} variant="ghost" size="sm">Cancel</Button>
                              <Button onClick={() => void handleSaveNote(note.id)} size="sm">Save</Button>
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
              </div>
            </TabsContent>

            {isYoutubeDocument && (
              <TabsContent value="transcript" className="focus-visible:outline-none">
                <div className="max-w-4xl mx-auto space-y-6">
                   <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">Video Transcript</h3>
                      <p className="text-sm text-muted-foreground">Full extraction of the audio content from the video source.</p>
                    </div>
                    <Button
                      onClick={handleGenerateTranscript}
                      disabled={generateTranscript.isPending}
                      variant="outline"
                      className="gap-2"
                    >
                      {generateTranscript.isPending ? (
                        <LoaderCircle className="size-4 animate-spin" />
                      ) : (
                        <Brain className="size-4" />
                      )}
                      {transcriptResponse?.content ? 'Regenerate Transcript' : 'Generate Transcript'}
                    </Button>
                  </div>

                  {transcriptResponse?.content ? (
                    <div className="rounded-2xl border bg-muted/30 overflow-hidden">
                       <ScrollArea className="h-[60vh] max-h-[800px]">
                          <div className="p-8">
                             <p className="text-base leading-relaxed text-foreground/80 whitespace-pre-wrap font-mono-subtle">
                                {transcriptResponse.content}
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
                           Generate a transcript to search through video content and save highlights.
                        </p>
                      </div>
                      <Button onClick={handleGenerateTranscript} className="mt-2">
                        Start Processing
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            )}

            <TabsContent value="details" className="focus-visible:outline-none">
              <div className="grid gap-8 lg:grid-cols-2">
                <Card className="p-6 space-y-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold flex items-center gap-2">
                      <Zap className="size-5 text-amber-500" />
                      Ingestion Pipeline
                    </h3>
                    <Button
                      onClick={() => retryIngestion.mutate(id)}
                      size="sm"
                      variant="outline"
                      disabled={!canRetryIngestion || retryIngestion.isPending}
                      className="h-8 gap-2"
                    >
                      {retryIngestion.isPending ? (
                        <LoaderCircle className="size-3.5 animate-spin" />
                      ) : (
                        <RefreshCcw className="size-3.5" />
                      )}
                      Retry Pipeline
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40">
                      <span className="text-sm font-medium text-muted-foreground">Pipeline Status</span>
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
                      <MetaRow label="Embedding Vector" value={ingestion?.embeddingsReady ? 'Ready & Indexed' : 'Pending'} />
                      <MetaRow label="Semantic Stage" value={ingestion?.currentStage ?? 'Ready'} />
                      <MetaRow label="Source Connector" value={document.sourceType ?? 'Direct Upload'} />
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
                      <MetaRow label="Created On" value={new Date(document.createdAt).toLocaleString()} />
                      <MetaRow label="Last Modified" value={new Date(document.updatedAt).toLocaleString()} />
                      <MetaRow
                        label="Last Read"
                        value={document.lastOpenedAt ? new Date(document.lastOpenedAt).toLocaleString() : 'Never opened'}
                      />
                   </div>

                   {Object.keys(document.metadata).length > 0 && (
                     <div className="space-y-3">
                       <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Raw JSON Metadata</p>
                       <ScrollArea className="h-48 rounded-xl border bg-muted/20 p-4">
                         <pre className="text-xs leading-relaxed font-mono">
                           {JSON.stringify(document.metadata, null, 2)}
                         </pre>
                       </ScrollArea>
                     </div>
                   )}
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </section>

      <ConfirmationDialog
        open={deleteDocumentOpen}
        openChangeAction={setDeleteDocumentOpen}
        confirmAction={handleDeleteDocument}
        isPending={deleteDocument.isPending}
        title="Delete document?"
        description={`This will permanently delete "${document.title}" and remove its notes, summary, and related data.`}
        confirmLabel="Delete document"
        tone="destructive"
      />

      <ConfirmationDialog
        open={removeSummaryOpen}
        openChangeAction={setRemoveSummaryOpen}
        confirmAction={handleRemoveSummary}
        isPending={deleteSummary.isPending}
        title="Remove summary?"
        description="This removes the generated summary from the document. You can generate it again later."
        confirmLabel="Remove summary"
        tone="destructive"
      />

      <ConfirmationDialog
        open={deletingNoteId !== null}
        openChangeAction={(open) => {
          if (!open) setDeletingNoteId(null);
        }}
        confirmAction={() => handleDeleteNote(deletingNoteId!)}
        isPending={deleteNote.isPending}
        title="Delete note?"
        description="This note will be removed permanently from the document."
        confirmLabel="Delete note"
        tone="destructive"
      />
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 px-4 transition-colors hover:bg-muted/30">
      <span className="shrink-0 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
      <span className="max-w-[65%] text-right text-xs font-medium text-foreground/80 break-all">
        {value}
      </span>
    </div>
  );
}

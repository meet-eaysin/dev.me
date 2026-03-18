'use client';

import * as React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  DocumentDetailProvider,
  useDocumentDetail,
} from './document-detail/context';
import { DocumentDetailHeader } from './document-detail/header';
import { DocumentDetailReader } from './document-detail/reader';
import { DocumentDetailTabs } from './document-detail/tabs';
import { DocumentDetailSkeleton } from './document-detail/skeleton';

export function DocumentDetailView({ id }: { id: string }) {
  return (
    <DocumentDetailProvider id={id}>
      <DocumentDetailContent />
    </DocumentDetailProvider>
  );
}

function DocumentDetailContent() {
  const { document, error, isLoading } = useDocumentDetail();

  if (isLoading) {
    return <DocumentDetailSkeleton />;
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

  return (
    <div className="space-y-5">
      <DocumentDetailHeader />
      <section className="space-y-8">
        <DocumentDetailReader />
        <DocumentDetailTabs />
      </section>
    </div>
  );
}

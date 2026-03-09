'use client';

import * as React from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import {
  Card,
  CardHeader,
  CardPanel,
  CardFooter,
  CardAction,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverPopup,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { DocumentRow } from '@/features/library/types';
import {
  getDocumentIcon,
  getStatusBadgeVariant,
  getStatusLabel,
  getTypeLabel,
} from '../../utils/document-helpers';
import { CardActions } from './card-actions';
import { DocumentPreviewSurface } from '../document-preview-surface';

interface BaseDocumentCardProps {
  document: DocumentRow;
  children: React.ReactNode;
}

export function BaseDocumentCard({
  document,
  children,
}: BaseDocumentCardProps) {
  const Icon = getDocumentIcon(document.type);
  const statusVariant = getStatusBadgeVariant(document.status);
  const statusLabel = getStatusLabel(document.status);
  const typeLabel = getTypeLabel(document.type);

  return (
    <Link
      href={`/library/${document.id}`}
      className="block group outline-none"
    >
      <Card className="h-full flex flex-col transition-shadow duration-200 hover:shadow-md overflow-hidden">
        <CardHeader className="flex flex-row items-center gap-3 p-4 pb-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors group-hover:text-primary">
            <Icon className="size-4" />
          </div>
          <span className="flex-1 truncate text-xs font-medium capitalize tracking-wider text-muted-foreground">
            {typeLabel}
          </span>
          <Badge variant={statusVariant} size="sm">
            {statusLabel}
          </Badge>
          <CardAction>
            <CardActions document={document} />
          </CardAction>
        </CardHeader>

        <CardPanel className="flex-1 px-4 pb-2 pt-0">{children}</CardPanel>

        <div className="px-4 pb-3">
          <div className="h-40 overflow-hidden rounded-xl border bg-muted/30">
            <DocumentPreviewSurface compact document={document} />
          </div>
        </div>

        <CardFooter className="flex items-center justify-between gap-2 px-4 pb-4 pt-2">
          <div className="flex gap-1.5 overflow-hidden">
            {document.tags.slice(0, 2).map((tag) => (
              <Badge variant="secondary" size="sm" key={tag}>
                {tag}
              </Badge>
            ))}
            {document.tags.length > 2 && (
              <Popover>
                <PopoverTrigger
                  render={
                    <Badge
                      render={<button type="button" />}
                      size="sm"
                      variant="outline"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                    >
                      +{document.tags.length - 2} More
                    </Badge>
                  }
                />
                <PopoverPopup
                  align="start"
                  className="max-w-64 p-3"
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                >
                  <div className="flex flex-wrap gap-1.5">
                    {document.tags.map((tag) => (
                      <Badge key={tag} size="sm" variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </PopoverPopup>
              </Popover>
            )}
          </div>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(document.updatedAt), {
              addSuffix: true,
            })}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}

'use client';

import * as React from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogPopup,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogPanel,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { AddDocumentForm } from './add-document-form';

export function AddDocumentDialog() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button>
            <PlusIcon aria-hidden="true" />
            Add Document
          </Button>
        }
      />
      <DialogPopup className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add to Library</DialogTitle>
          <DialogDescription>
            Save a new link, upload a PDF, or create a note.
          </DialogDescription>
        </DialogHeader>
        <DialogPanel>
          <AddDocumentForm
            onSuccess={() => setOpen(false)}
            onCancel={() => setOpen(false)}
          />
        </DialogPanel>
      </DialogPopup>
    </Dialog>
  );
}

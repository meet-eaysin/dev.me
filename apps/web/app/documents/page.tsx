import { FeatureShellPage } from '@/components/app/feature-shell-page';
import { apiGet } from '@/lib/api';

type DocumentRow = {
  id: string;
  title: string;
  source: string;
  type: string;
  status: string;
  updatedAt: string;
};

type DocumentsListData = {
  items: DocumentRow[];
  total: number;
  page: number;
  limit: number;
};

function formatStatus(status: string) {
  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default async function DocumentsPage() {
  let data: DocumentsListData | null = null;
  let loadError: string | null = null;

  try {
    data = await apiGet<DocumentsListData>('/documents?page=1&limit=20', {
      next: { revalidate: 15 },
    });
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : 'Unable to load documents';
  }

  return (
    <FeatureShellPage
      title="Documents"
      subtitle="Ingestion and library"
      description="Manage all ingested sources (URL, YouTube, PDF, image, text), track ingestion state, and trigger summary/transcript actions."
      ctaLabel="Add Document"
      ctaHref="/documents/new"
      endpoints={[
        'GET /documents',
        'POST /documents',
        'POST /documents/upload',
        'GET /documents/:id',
        'PATCH /documents/:id',
        'DELETE /documents/:id',
        'GET /documents/:id/ingestion-status',
        'POST /documents/:id/retry-ingestion',
        'POST /documents/:id/summary',
        'DELETE /documents/:id/summary',
        'GET /documents/:id/transcript',
        'POST /documents/:id/transcript',
      ]}
    >
      <section className="bg-default border-subtle mt-4 rounded-md border">
        <header className="border-subtle flex items-center justify-between border-b px-5 py-3">
          <h2 className="text-emphasis text-sm font-semibold">
            Recent Documents
          </h2>
          <span className="text-subtle text-xs">
            {data ? `${data.total} total` : 'Waiting for backend'}
          </span>
        </header>

        {loadError ? (
          <div className="px-5 py-4">
            <p className="text-destructive text-sm font-medium">{loadError}</p>
            <p className="text-subtle mt-1 text-sm">
              Set `NEXT_PUBLIC_API_BASE_URL` if your API is not on
              `http://localhost:3001`.
            </p>
          </div>
        ) : data && data.items.length > 0 ? (
          <ul className="divide-subtle divide-y">
            {data.items.map((doc) => (
              <li
                key={doc.id}
                className="grid grid-cols-12 gap-3 px-5 py-3 text-sm"
              >
                <div className="col-span-12 sm:col-span-5">
                  <p className="text-emphasis truncate font-semibold">
                    {doc.title}
                  </p>
                  <p className="text-subtle mt-0.5 truncate text-xs">
                    {doc.source}
                  </p>
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <p className="text-muted text-xs uppercase tracking-wide">
                    Type
                  </p>
                  <p className="text-default font-medium">{doc.type}</p>
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <p className="text-muted text-xs uppercase tracking-wide">
                    Status
                  </p>
                  <p className="text-default font-medium">
                    {formatStatus(doc.status)}
                  </p>
                </div>
                <div className="col-span-4 sm:col-span-3">
                  <p className="text-muted text-xs uppercase tracking-wide">
                    Updated
                  </p>
                  <p className="text-default font-medium">
                    {new Date(doc.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-5 py-4 text-sm text-subtle">
            No documents found.
          </div>
        )}
      </section>
    </FeatureShellPage>
  );
}

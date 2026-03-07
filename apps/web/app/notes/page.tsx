import { FeatureShellPage } from '@/components/app/feature-shell-page';

export default function NotesPage() {
  return (
    <FeatureShellPage
      title="Notes"
      subtitle="Document-linked notes"
      description="Capture insights in rich notes attached to documents, then use them during search and review."
      endpoints={[
        'GET /knowledge/notes',
        'POST /knowledge/notes',
        'GET /knowledge/notes/:id',
        'PATCH /knowledge/notes/:id',
        'DELETE /knowledge/notes/:id',
      ]}
    />
  );
}

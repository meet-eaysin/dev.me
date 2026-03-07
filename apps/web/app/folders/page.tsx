import { FeatureShellPage } from '@/components/app/feature-shell-page';

export default function FoldersPage() {
  return (
    <FeatureShellPage
      title="Folders"
      subtitle="Knowledge organization"
      description="Organize documents into folders to keep your learning graph structured by topic or project."
      endpoints={[
        'GET /knowledge/folders',
        'POST /knowledge/folders',
        'GET /knowledge/folders/:id',
        'PATCH /knowledge/folders/:id',
        'DELETE /knowledge/folders/:id',
        'GET /knowledge/folders/:id/documents',
      ]}
    />
  );
}

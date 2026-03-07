import { FeatureShellPage } from '@/components/app/feature-shell-page';

export default function TagsPage() {
  return (
    <FeatureShellPage
      title="Tags"
      subtitle="Taxonomy and labeling"
      description="Use tags for lightweight classification across documents, notes, and graph relationships."
      endpoints={[
        'GET /knowledge/tags',
        'POST /knowledge/tags',
        'PATCH /knowledge/tags/:id',
        'DELETE /knowledge/tags/:id',
        'GET /knowledge/tags/:id/documents',
      ]}
    />
  );
}

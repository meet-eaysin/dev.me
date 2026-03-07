import { FeatureShellPage } from '@/components/app/feature-shell-page';

export default function NewDocumentPage() {
  return (
    <FeatureShellPage
      title="Add Document"
      subtitle="Create a new ingestion task"
      description="Next step is implementing the ingestion form with type-specific inputs for URL, YouTube, PDF, image, and text content."
      endpoints={['POST /documents', 'POST /documents/upload']}
    />
  );
}

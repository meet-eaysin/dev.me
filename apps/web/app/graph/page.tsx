import { FeatureShellPage } from '@/components/app/feature-shell-page';

export default function GraphPage() {
  return (
    <FeatureShellPage
      title="Graph"
      subtitle="Knowledge graph"
      description="Visualize your document network and semantic relationships, then inspect document-focused subgraphs."
      endpoints={['GET /graph', 'GET /graph/document/:docId', 'POST /graph/rebuild/:docId']}
    />
  );
}

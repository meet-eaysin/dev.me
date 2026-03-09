import { FeatureShellPage } from '@/components/shell/feature-shell-page';

export default function SearchPage() {
  return (
    <FeatureShellPage
      title="Search"
      subtitle="Semantic retrieval"
      description="Find relevant information across your knowledge base with semantic search and filtered result ranking."
      ctaLabel="Ask AI"
      ctaHref="/search/ask"
      endpoints={['GET /search']}
    />
  );
}

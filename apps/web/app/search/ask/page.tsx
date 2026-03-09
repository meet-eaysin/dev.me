import { FeatureShellPage } from '@/components/shell/feature-shell-page';

export default function AskAiPage() {
  return (
    <FeatureShellPage
      title="Ask AI"
      subtitle="RAG question answering"
      description="Ask questions against your personal corpus. Responses should include source attribution from matching documents."
      endpoints={['POST /search/ask']}
    />
  );
}

import { FeatureShellPage } from '@/components/app/feature-shell-page';

export default function IntegrationsPage() {
  return (
    <FeatureShellPage
      title="Integrations"
      subtitle="External services"
      description="Manage external integrations and sync behavior for your knowledge workflow."
      ctaLabel="Open Notion"
      ctaHref="/integrations/notion"
    />
  );
}

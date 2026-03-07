import { FeatureShellPage } from '@/components/app/feature-shell-page';

export default function NotionPage() {
  return (
    <FeatureShellPage
      title="Notion"
      subtitle="Two-way sync configuration"
      description="Connect your Notion workspace, select databases, configure sync direction, and trigger sync jobs."
      endpoints={[
        'GET /notion/config',
        'POST /notion/connect',
        'GET /notion/databases',
        'PATCH /notion/config',
        'POST /notion/sync',
        'DELETE /notion/config',
      ]}
    />
  );
}

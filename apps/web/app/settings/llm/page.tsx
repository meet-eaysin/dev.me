import { FeatureShellPage } from '@/components/shell/feature-shell-page';

export default function LlmSettingsPage() {
  return (
    <FeatureShellPage
      title="LLM Config"
      subtitle="Model provider settings"
      description="Configure model provider credentials and defaults, validate settings, and save secure runtime configuration."
      endpoints={[
        'GET /llm-config',
        'PUT /llm-config',
        'POST /llm-config/validate',
        'DELETE /llm-config',
      ]}
    />
  );
}

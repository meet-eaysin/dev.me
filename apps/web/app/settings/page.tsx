import { FeatureShellPage } from '@/components/app/feature-shell-page';

export default function SettingsPage() {
  return (
    <FeatureShellPage
      title="Settings"
      subtitle="Application and account"
      description="Configure profile, password, provider credentials, and personal preferences."
      ctaLabel="LLM Config"
      ctaHref="/settings/llm"
    />
  );
}

import { FeatureShellPage } from '@/components/app/feature-shell-page';

export default function ReviewPage() {
  return (
    <FeatureShellPage
      title="Review"
      subtitle="Daily learning loop"
      description="Review documents due today, dismiss reviewed items, and inspect AI-generated recommendations."
      endpoints={[
        'GET /review/daily',
        'POST /review/dismiss/:docId',
        'GET /review/recommendations',
      ]}
    />
  );
}

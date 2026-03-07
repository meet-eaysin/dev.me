import { FeatureShellPage } from '@/components/app/feature-shell-page';

export default function AnalyticsPage() {
  return (
    <FeatureShellPage
      title="Analytics"
      subtitle="Activity and engagement"
      description="Track learning consistency, heatmap activity, totals, and streaks."
      endpoints={['GET /analytics/heatmap', 'GET /analytics/stats']}
    />
  );
}

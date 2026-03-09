import type { AnalyticsHeatmapItem } from '@repo/types';
import { apiGet } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/api-endpoints';

export type AnalyticsStatsResponse = {
  totalDocuments: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  totalNotes: number;
  currentStreak: number;
  longestStreak: number;
  mostActiveDay: string | null;
};

export type AnalyticsHeatmapResponse = {
  heatmap: AnalyticsHeatmapItem[];
};

export const analyticsApi = {
  getHeatmap: (days = 90) =>
    apiGet<AnalyticsHeatmapResponse>(
      `${API_ENDPOINTS.ANALYTICS.HEATMAP}?days=${days}`,
    ),
  getStats: () => apiGet<AnalyticsStatsResponse>(API_ENDPOINTS.ANALYTICS.STATS),
};

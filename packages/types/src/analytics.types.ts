export interface AnalyticsBreakdown {
  doc_added: number;
  doc_opened: number;
  note_created: number;
  summary_generated: number;
}

export interface AnalyticsHeatmapItem {
  date: string;
  count: number;
  breakdown: AnalyticsBreakdown;
}

export interface AnalyticsStatsAggregationResult {
  _id: string;
  count: number;
  doc_added: number;
  doc_opened: number;
  note_created: number;
  summary_generated: number;
}

export interface AnalyticsDocumentStatsAggregationResult {
  _id: string;
  count: number;
}

export interface AnalyticsStreakDetails {
  currentStreak: number;
  longestStreak: number;
  mostActiveDay: string | null;
}

export interface AnalyticsHeatmapItem {
  date: string;
  count: number;
  breakdown: {
    doc_added: number;
    doc_opened: number;
    note_created: number;
    summary_generated: number;
  };
}

export interface AnalyticsStats {
  totalDocuments: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  totalNotes: number;
  currentStreak: number;
  longestStreak: number;
  mostActiveDay: string | null;
}

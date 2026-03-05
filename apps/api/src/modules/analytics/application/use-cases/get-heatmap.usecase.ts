import { Injectable } from '@nestjs/common';
import { UserActivityModel } from '@repo/db';
import { AnalyticsHeatmapItem, AnalyticsStatsAggregationResult, AnalyticsBreakdown } from '@repo/types';

@Injectable()
export class GetHeatmapUseCase {
  async execute(
    userId: string,
    days: number = 365,
  ): Promise<{ heatmap: AnalyticsHeatmapItem[] }> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const aggregation: AnalyticsStatsAggregationResult[] = await UserActivityModel.aggregate<AnalyticsStatsAggregationResult>([
      {
        $match: {
          userId,
          createdAt: { $gte: startDate },
        },
      },
      {
        $project: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          action: 1,
        },
      },
      {
        $group: {
          _id: '$date',
          count: { $sum: 1 },
          doc_added: {
            $sum: { $cond: [{ $eq: ['$action', 'doc_added'] }, 1, 0] },
          },
          doc_opened: {
            $sum: { $cond: [{ $eq: ['$action', 'doc_opened'] }, 1, 0] },
          },
          note_created: {
            $sum: { $cond: [{ $eq: ['$action', 'note_created'] }, 1, 0] },
          },
          summary_generated: {
            $sum: { $cond: [{ $eq: ['$action', 'summary_generated'] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]).exec();

    const statsMap = new Map<
      string,
      { count: number; breakdown: AnalyticsBreakdown }
    >();

    aggregation.forEach((item: AnalyticsStatsAggregationResult) => {
      const dateStr: string = item._id;
      statsMap.set(dateStr, {
        count: item.count,
        breakdown: {
          doc_added: item.doc_added,
          doc_opened: item.doc_opened,
          note_created: item.note_created,
          summary_generated: item.summary_generated,
        },
      });
    });

    const heatmap: AnalyticsHeatmapItem[] = [];

    for (let i = 0; i <= days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0] ?? '';

      const existing = statsMap.get(dateStr);
      heatmap.push({
        date: dateStr,
        count: existing?.count ?? 0,
        breakdown: existing?.breakdown ?? {
          doc_added: 0,
          doc_opened: 0,
          note_created: 0,
          summary_generated: 0,
        },
      });
    }

    return { heatmap };
  }
}

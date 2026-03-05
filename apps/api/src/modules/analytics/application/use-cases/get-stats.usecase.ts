import { Injectable } from '@nestjs/common';
import { DocumentModel, NoteModel, UserActivityModel } from '@repo/db';
import { AnalyticsStats } from '@repo/types';

@Injectable()
export class GetStatsUseCase {
  async execute(userId: string): Promise<AnalyticsStats> {
    const [
      totalDocuments,
      docsByType,
      docsByStatus,
      totalNotes,
      activityHistory,
    ] = await Promise.all([
      DocumentModel.countDocuments({ userId }),
      DocumentModel.aggregate([
        { $match: { userId } },
        { $group: { _id: '$type', count: { $sum: 1 } } },
      ]),
      DocumentModel.aggregate([
        { $match: { userId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      NoteModel.countDocuments({ userId }),
      UserActivityModel.aggregate([
        { $match: { userId } },
        {
          $project: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          },
        },
        { $group: { _id: '$date' } },
        { $sort: { _id: -1 } },
      ]),
    ]);

    // Format distributions
    const byType: Record<string, number> = {};
    (docsByType as { _id: string; count: number }[]).forEach((item) => {
      byType[item._id] = item.count;
    });

    const byStatus: Record<string, number> = {};
    (docsByStatus as { _id: string; count: number }[]).forEach((item) => {
      byStatus[item._id] = item.count;
    });

    // Streak calculation
    const activeDates = activityHistory.map(
      (item: { _id: string }) => item._id,
    );
    const { currentStreak, longestStreak, mostActiveDay } =
      await this.calculateStreakDetails(userId, activeDates);

    return {
      totalDocuments,
      byType,
      byStatus,
      totalNotes,
      currentStreak,
      longestStreak,
      mostActiveDay,
    };
  }

  private async calculateStreakDetails(
    userId: string,
    activeDates: string[],
  ): Promise<{
    currentStreak: number;
    longestStreak: number;
    mostActiveDay: string | null;
  }> {
    if (activeDates.length === 0) {
      return { currentStreak: 0, longestStreak: 0, mostActiveDay: null };
    }

    // Longest and Most Active
    const mostActiveAggregation = await UserActivityModel.aggregate([
      { $match: { userId } },
      {
        $project: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        },
      },
      { $group: { _id: '$date', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);
    const mostActiveDay = mostActiveAggregation[0]?._id ?? null;

    // Current Streak
    const today = new Date().toISOString().split('T')[0] ?? '';
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0] ?? '';

    let currentStreak = 0;
    const checkDate = activeDates.includes(today)
      ? today
      : activeDates.includes(yesterdayStr)
        ? yesterdayStr
        : null;

    if (checkDate) {
      const tempDate = new Date(checkDate);
      while (activeDates.includes(tempDate.toISOString().split('T')[0] ?? '')) {
        currentStreak++;
        tempDate.setDate(tempDate.getDate() - 1);
      }
    }

    // Longest Streak
    let longestStreak = 0;
    let currentTempStreak = 0;

    // Sort ascending for longest streak calc
    const sortedDates = [...activeDates].sort();
    let prevDate: Date | null = null;

    for (const dateStr of sortedDates) {
      const currentDate = new Date(dateStr);
      if (prevDate) {
        const diff =
          (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          currentTempStreak++;
        } else {
          currentTempStreak = 1;
        }
      } else {
        currentTempStreak = 1;
      }
      longestStreak = Math.max(longestStreak, currentTempStreak);
      prevDate = currentDate;
    }

    return { currentStreak, longestStreak, mostActiveDay };
  }
}

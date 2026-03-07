import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AnalyticsBreakdownDto {
  @ApiProperty({ example: 5 })
  doc_added!: number;

  @ApiProperty({ example: 12 })
  doc_opened!: number;

  @ApiProperty({ example: 3 })
  note_created!: number;

  @ApiProperty({ example: 2 })
  summary_generated!: number;
}

export class AnalyticsHeatmapItemDto {
  @ApiProperty({ example: '2026-03-05' })
  date!: string;

  @ApiProperty({ example: 22 })
  count!: number;

  @ApiProperty({ type: AnalyticsBreakdownDto })
  breakdown!: AnalyticsBreakdownDto;
}

export class AnalyticsStreakDetailsDto {
  @ApiProperty({ example: 5, description: 'Current consecutive days active' })
  currentStreak!: number;

  @ApiProperty({ example: 14, description: 'Longest consecutive days active' })
  longestStreak!: number;

  @ApiPropertyOptional({
    example: '2026-03-04',
    nullable: true,
    description: 'The day with the highest activity',
  })
  mostActiveDay!: string | null;
}

export class AnalyticsStatsResponseDto {
  @ApiProperty({ type: AnalyticsStreakDetailsDto })
  streaks!: AnalyticsStreakDetailsDto;

  @ApiProperty({ type: [AnalyticsHeatmapItemDto] })
  heatmap!: AnalyticsHeatmapItemDto[];
}

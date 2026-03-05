import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotionSyncDirectionType } from '@repo/types';

export class NotionConfigPublicViewDto {
  @ApiProperty()
  userId!: string;

  @ApiProperty()
  workspaceId!: string;

  @ApiPropertyOptional()
  workspaceName?: string;

  @ApiPropertyOptional()
  targetDatabaseId?: string;

  @ApiProperty()
  syncEnabled!: boolean;

  @ApiProperty({ enum: NotionSyncDirectionType })
  syncDirection!: NotionSyncDirectionType;

  @ApiPropertyOptional()
  lastSyncedAt?: string;
}

export class NotionDatabaseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;
}

export class NotionSyncResultDto {
  @ApiProperty()
  synced!: number;

  @ApiProperty()
  failed!: number;

  @ApiProperty({ type: [String] })
  errors!: string[];
}

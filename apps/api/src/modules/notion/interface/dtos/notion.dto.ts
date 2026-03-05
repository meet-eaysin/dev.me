import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotionSyncDirectionType } from '@repo/types';

export class ConnectNotionDto {
  @ApiProperty({ description: 'The OAuth access token from Notion' })
  @IsString()
  @IsNotEmpty()
  accessToken!: string;
}

export class UpdateNotionConfigDto {
  @ApiPropertyOptional({ description: 'The ID of the Notion database to sync with' })
  @IsString()
  @IsOptional()
  targetDatabaseId?: string;

  @ApiPropertyOptional({ description: 'Whether automatic background sync is enabled' })
  @IsBoolean()
  @IsOptional()
  syncEnabled?: boolean;

  @ApiPropertyOptional({ enum: NotionSyncDirectionType, description: 'Direction of synchronization' })
  @IsEnum(NotionSyncDirectionType)
  @IsOptional()
  syncDirection?: NotionSyncDirectionType;
}

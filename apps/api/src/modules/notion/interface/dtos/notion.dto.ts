import { IsBoolean, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { NotionSyncDirectionType } from '@repo/types';

export class ConnectNotionDto {
  @IsString()
  @MinLength(1)
  accessToken!: string;
}

export class UpdateNotionConfigDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  targetDatabaseId?: string;

  @IsOptional()
  @IsBoolean()
  syncEnabled?: boolean;

  @IsOptional()
  @IsEnum(NotionSyncDirectionType)
  syncDirection?: NotionSyncDirectionType;
}

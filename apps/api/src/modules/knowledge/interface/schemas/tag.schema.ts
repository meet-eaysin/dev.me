import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({
    description: 'Unique name of the tag',
    example: 'Neuroscience',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  name!: string;

  @ApiPropertyOptional({
    description: 'Tag color hex or name',
    example: '#4CAF50',
  })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  color?: string;

  @ApiPropertyOptional({
    description: 'Origin or source of the tag',
    example: 'manual',
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  source?: string;
}

export class UpdateTagDto {
  @ApiPropertyOptional({ description: 'New tag name' })
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(50)
  name?: string;

  @ApiPropertyOptional({ description: 'New tag color' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  color?: string;
}

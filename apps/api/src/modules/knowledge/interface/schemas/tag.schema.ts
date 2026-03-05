import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTagDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  name!: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  color?: string;

  @IsString()
  @IsOptional()
  source?: string;
}

export class UpdateTagDto {
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(50)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  color?: string;
}

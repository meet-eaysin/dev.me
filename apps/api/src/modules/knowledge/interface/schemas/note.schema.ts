import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  documentId!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(10000)
  content!: string;
}

export class UpdateNoteDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(10000)
  content!: string;
}

export class ListNotesDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  documentId!: string;
}

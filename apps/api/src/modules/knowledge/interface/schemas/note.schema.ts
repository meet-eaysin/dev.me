import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNoteDto {
  @ApiProperty({ description: 'The ID of the document this note belongs to', example: '65f1a2b3c4d5e6f7a8b9c0d3' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  documentId!: string;

  @ApiProperty({ description: 'The markdown or text content of the note', example: 'Check out the new features in v1.0!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(10000)
  content!: string;
}

export class UpdateNoteDto {
  @ApiProperty({ description: 'Updated markdown or text content' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(10000)
  content!: string;
}

export class ListNotesDto {
  @ApiProperty({ description: 'The document ID to filter notes by' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  documentId!: string;
}

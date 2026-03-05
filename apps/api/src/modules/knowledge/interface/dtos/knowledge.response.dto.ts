import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FolderViewDto {
  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d1' })
  id!: string;

  @ApiProperty({ example: 'Productivity' })
  name!: string;

  @ApiPropertyOptional({ example: 'Shared notes about productivity.' })
  description?: string;

  @ApiPropertyOptional({ example: '#FF5733' })
  color?: string;

  @ApiPropertyOptional({ example: 'parent_folder_id' })
  parentId?: string | null;

  @ApiProperty({ example: '2026-03-05T12:00:00.000Z' })
  createdAt!: string;
}

export class TagViewDto {
  @ApiProperty({ example: 'tag_1' })
  id!: string;

  @ApiProperty({ example: 'Neuroscience' })
  name!: string;

  @ApiPropertyOptional({ example: '#4CAF50' })
  color?: string;

  @ApiPropertyOptional({ example: 'manual' })
  source?: string;
}

export class NoteViewDto {
  @ApiProperty({ example: 'note_1' })
  id!: string;

  @ApiProperty({ example: '65f1a2b3c4d5e6f7a8b9c0d3' })
  documentId!: string;

  @ApiProperty({ example: 'This is a test note.' })
  content!: string;

  @ApiProperty({ example: '2026-03-05T12:00:00.000Z' })
  createdAt!: string;
}

export class FolderResponseDto {
  @ApiProperty({ type: FolderViewDto })
  folder!: FolderViewDto;
}

export class FoldersResponseDto {
  @ApiProperty({ type: [FolderViewDto] })
  folders!: FolderViewDto[];
}

export class TagResponseDto {
  @ApiProperty({ type: TagViewDto })
  tag!: TagViewDto;
}

export class TagsResponseDto {
  @ApiProperty({ type: [TagViewDto] })
  tags!: TagViewDto[];
}

export class NoteResponseDto {
  @ApiProperty({ type: NoteViewDto })
  note!: NoteViewDto;
}

export class NotesResponseDto {
  @ApiProperty({ type: [NoteViewDto] })
  notes!: NoteViewDto[];
}

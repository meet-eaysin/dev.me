import { BadRequestException } from '@nestjs/common';

const MAGIC_BYTES = {
  PDF: '25504446',
  JPEG: 'ffd8ff',
  PNG: '89504e47',
  WEBP: '52494646',
};

export type FileType = 'pdf' | 'image';

export function validateFileType(
  buffer: Buffer,
  declaredMime: string,
): FileType {
  const hex = buffer.toString('hex', 0, 4).toLowerCase();

  if (hex === MAGIC_BYTES.PDF) {
    if (declaredMime !== 'application/pdf') {
      throw new BadRequestException(
        'Mime type mismatch: expected application/pdf',
      );
    }
    return 'pdf';
  }

  if (
    hex.startsWith('ffd8ff') ||
    hex.startsWith('89504e47') ||
    hex.startsWith('52494646')
  ) {
    if (!declaredMime.startsWith('image/')) {
      throw new BadRequestException('Mime type mismatch: expected image/*');
    }
    return 'image';
  }

  throw new BadRequestException('Invalid file type');
}

import { createWorker } from 'tesseract.js';
import sharp from 'sharp';

export class ImageExtractor {
  async extractImage(
    buffer: Buffer,
  ): Promise<{ text: string; ocrConfidence: number }> {
    // Sharp to auto-orient + resize (max 4000px) before OCR
    const processedBuffer = await sharp(buffer)
      .rotate()
      .resize(4000, 4000, { fit: 'inside', withoutEnlargement: true })
      .toBuffer();

    const worker = await createWorker('eng');
    const { data } = await worker.recognize(processedBuffer);
    await worker.terminate();

    return {
      text: data.text,
      ocrConfidence: data.confidence,
    };
  }
}
export const imageExtractor = new ImageExtractor();

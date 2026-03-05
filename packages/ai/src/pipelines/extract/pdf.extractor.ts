import pdf from "pdf-parse";
import { createWorker } from "tesseract.js";
import pLimit from "p-limit";

export interface PdfExtractResult {
  text: string;
  pageCount: number;
  type: "text" | "image" | "mixed";
  ocrConfidence: number;
}

export class AppError extends Error {
  constructor(
    public message: string,
    public code: string,
  ) {
    super(message);
  }
}

export class UnprocessableError extends AppError {
  constructor(message: string) {
    super(message, "UNPROCESSABLE_ENTITY");
  }
}

export class PdfExtractor {
  async extractPdf(
    buffer: Buffer,
    _documentId: string,
  ): Promise<PdfExtractResult> {
    try {
      const data = await pdf(buffer);
      const text = data.text;
      const pageCount = data.numpages;

      // Detection: if < 100 chars per page average -> image PDF
      const charsPerPage = text.length / pageCount;
      if (charsPerPage < 100) {
        return this.ocrPdf(buffer, pageCount);
      }

      return {
        text,
        pageCount,
        type: "text",
        ocrConfidence: 100,
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("password")) {
          throw new UnprocessableError("PDF is password protected");
        }
        if (
          error.message.includes("corrupted") ||
          error.message.includes("Invalid PDF structure")
        ) {
          throw new UnprocessableError("PDF file is corrupted");
        }
      }
      throw error;
    }
  }

  private async ocrPdf(
    buffer: Buffer,
    pageCount: number,
  ): Promise<PdfExtractResult> {
    const limit = pLimit(10);

    // Lazy import to avoid loading canvas native module at startup
    const pdfConvert = await import("pdf-img-convert");
    const pageImages = await pdfConvert.convert(buffer);

    const results = await Promise.all(
      pageImages.map((img, index) =>
        limit(async () => {
          const imageBuffer = typeof img === "string" ? img : Buffer.from(img);
          const worker = await createWorker("eng");
          const { data } = await worker.recognize(imageBuffer);
          await worker.terminate();
          return {
            text: data.text,
            confidence: data.confidence,
            index,
          };
        }),
      ),
    );

    const fullText = results
      .sort((a, b) => a.index - b.index)
      .map((r) => r.text)
      .join("\n");

    const avgConfidence =
      results.reduce((acc, r) => acc + r.confidence, 0) / results.length;

    return {
      text: fullText,
      pageCount,
      type: "image",
      ocrConfidence: avgConfidence,
    };
  }
}
export const pdfExtractor = new PdfExtractor();

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { transcriptQueue } from '@repo/queue';
import { IDocumentRepository } from '../../domain/repositories/document.repository';
import { DocumentTranscriptModel } from '@repo/db';

@Injectable()
export class TranscriptUseCase {
  constructor(private readonly documentRepository: IDocumentRepository) {}

  async getTranscript(documentId: string, userId: string) {
    const doc = await this.documentRepository.findById(documentId, userId);
    if (!doc) throw new NotFoundException('Document not found');

    if (doc.props.type !== 'youtube') {
      throw new BadRequestException(
        'Transcripts are only available for YouTube documents',
      );
    }

    const transcript = await DocumentTranscriptModel.findOne()
      .where('documentId')
      .equals(documentId)
      .exec();

    if (!transcript) {
      return { available: false, segments: [], fullText: '' };
    }

    return {
      available: true,
      segments: transcript.segments,
      fullText: transcript.content,
    };
  }

  async generateTranscript(documentId: string, userId: string) {
    const doc = await this.documentRepository.findById(documentId, userId);
    if (!doc) throw new NotFoundException('Document not found');

    if (doc.props.type !== 'youtube') {
      throw new BadRequestException(
        'Transcripts are only available for YouTube documents',
      );
    }

    const transcript = await DocumentTranscriptModel.findOne()
      .where('documentId')
      .equals(documentId)
      .exec();

    if (transcript) {
      return {
        alreadyExists: true,
        transcript: {
          segments: transcript.segments,
          fullText: transcript.content,
        },
      };
    }

    await transcriptQueue.addJob(documentId, userId);
    return { alreadyExists: false };
  }
}

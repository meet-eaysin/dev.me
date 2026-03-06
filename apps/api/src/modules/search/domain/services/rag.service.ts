import {
  Injectable,
  Logger,
  ServiceUnavailableException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AskResultDto, SourceRefDto } from '../../interface/schemas/search.schema';
import { QdrantWrapper, embeddingAdapter, ResolvedLLMConfig } from '@repo/ai';
import { env } from '../../../../shared/utils/env';
import { DocumentChunkModel, DocumentModel, IDocument } from '@repo/db';
import { Types } from 'mongoose';
import axios from 'axios';

interface QdrantPayload {
  documentId: string;
  userId: string;
  chunkIndex: number;
  [key: string]: unknown;
}

@Injectable()
export class RagService {
  private readonly logger = new Logger(RagService.name);
  private qdrant: QdrantWrapper;

  constructor() {
    this.qdrant = new QdrantWrapper(env.QDRANT_URL, env.QDRANT_API_KEY);
  }

  private transformUserId(userId: string): string {
    if (/^[0-9a-fA-F]{24}$/.test(userId)) {
      return userId;
    }
    const hex = Buffer.from(userId).toString('hex');
    return hex.padEnd(24, '0').slice(0, 24);
  }

  async ask(
    userId: string,
    question: string,
    llmConfig: ResolvedLLMConfig,
    documentIds?: string[],
  ): Promise<AskResultDto> {
    const internalUserId = this.transformUserId(userId);

    // 1. Count embedded docs
    const embeddedDocsCount = await DocumentModel.countDocuments({
      userId: new Types.ObjectId(internalUserId),
      embeddingsReady: true,
      ...(documentIds && documentIds.length > 0
        ? { _id: { $in: documentIds.map((id) => new Types.ObjectId(id)) } }
        : {}),
    }).exec();

    if (embeddedDocsCount === 0) {
      throw new UnprocessableEntityException(
        'No indexed documents found for search',
      );
    }

    const queryVector = await embeddingAdapter.embedText(question, llmConfig);

    // 3. Search Qdrant
    const filterMust: Record<string, unknown>[] = [
      { key: 'userId', match: { value: internalUserId } },
    ];

    if (documentIds && documentIds.length > 0) {
      filterMust.push({
        key: 'documentId',
        match: { any: documentIds },
      });
    }

    const qdrantResults = await this.qdrant.searchSimilar(
      'mindstack',
      queryVector,
      { must: filterMust },
      8,
    );

    // 4. Low score check
    const highestScore =
      qdrantResults.length > 0 ? (qdrantResults[0]?.score ?? 0) : 0;
    if (highestScore < 0.35) {
      return {
        answer:
          "I couldn't find any relevant information in your documents to answer this question.",
        sources: [],
        tokensUsed: 0,
      };
    }

    // 5. Deduplicate (max 2 chunks per doc)
    const docChunkCounts = new Map<string, number>();
    const selectedChunks: {
      documentId: string;
      chunkIndex: number;
      score: number;
    }[] = [];

    for (const result of qdrantResults) {
      const payload = result.payload as QdrantPayload;
      if (!payload || !payload.documentId || result.score! < 0.35) continue;

      const docId = payload.documentId;
      const count = docChunkCounts.get(docId) ?? 0;

      if (count < 2) {
        docChunkCounts.set(docId, count + 1);
        selectedChunks.push({
          documentId: docId,
          chunkIndex: payload.chunkIndex,
          score: result.score!,
        });
      }
    }

    if (selectedChunks.length === 0) {
      return {
        answer: 'No relevant information found.',
        sources: [],
        tokensUsed: 0,
      };
    }

    // 6. Fetch metadata & content
    const uniqueDocIds = Array.from(
      new Set(selectedChunks.map((c) => c.documentId)),
    );
    const docs = await DocumentModel.find({
      _id: { $in: uniqueDocIds.map((id) => new Types.ObjectId(id)) },
    })
      .select('title author createdAt sourceType sourceUrl metadata')
      .lean<IDocument[]>()
      .exec();

    const docMap = new Map(docs.map((d) => [d._id.toString(), d]));

    const chunkDataArray = await Promise.all(
      selectedChunks.map(async (chunk) => {
        const chunkDoc = await DocumentChunkModel.findOne({
          documentId: new Types.ObjectId(chunk.documentId),
          index: chunk.chunkIndex,
        })
          .lean()
          .exec();

        return {
          ...chunk,
          content: chunkDoc?.content ?? '',
        };
      }),
    );

    // Filter missing chunks and sort by score
    const validChunks = chunkDataArray
      .filter((c) => c.content.length > 0)
      .sort((a, b) => b.score - a.score);

    // 7. & 8. Build context and limit tokens
    let contextStr = '';
    let estimatedTokens = 0;
    const sourcesMap = new Map<string, SourceRefDto>();

    for (const chunk of validChunks) {
      const doc = docMap.get(chunk.documentId);
      if (!doc) continue;

      const title = doc.title || 'Untitled Document';
      const author = (doc.metadata?.author as string) || null;
      const date = (
        doc.createdAt
          ? new Date(doc.createdAt).toISOString().split('T')[0]
          : null
      ) as string | null;
      const originalSource = (doc.sourceUrl as string | null) || null;

      if (!sourcesMap.has(chunk.documentId)) {
        sourcesMap.set(chunk.documentId, {
          documentId: chunk.documentId,
          title,
          author,
          publishedAt: date,
          originalSource: originalSource,
        });
      }

      const chunkText = `[Source: ${title}${author ? ` by ${author}` : ''} (${date || 'Unknown date'})]\n${chunk.content}\n---\n`;
      const chunkTokens = Math.ceil(chunkText.length / 4);

      if (estimatedTokens + chunkTokens > 6000) {
        break; // Stop adding chunks if we exceed token limit
      }

      contextStr += chunkText;
      estimatedTokens += chunkTokens;
    }

    // 9. LLM call
    const systemPrompt = `You are a helpful AI assistant. Answer the user's question ONLY using the provided context. If the context does not contain the answer, say "I cannot answer this based on the provided documents." clearly. Always cite which document your answer comes from using the [Source: Title] format.`;

    let answer = '';

    try {
      if (llmConfig.provider === 'ollama') {
        const response = await axios.post(
          `${llmConfig.baseUrl}/api/chat`,
          {
            model: llmConfig.chatModel,
            messages: [
              { role: 'system', content: systemPrompt },
              {
                role: 'user',
                content: `Context:\n${contextStr}\n\nQuestion: ${question}`,
              },
            ],
            stream: false,
          },
          { timeout: 60000 },
        );
        const content = response.data?.message?.content;
        if (typeof content === 'string') {
          answer = content;
        } else {
          throw new Error('Invalid response from Ollama endpoint');
        }
      } else {
        const response = await axios.post(
          `${llmConfig.baseUrl || 'https://api.openai.com/v1'}/chat/completions`,
          {
            model: llmConfig.chatModel,
            messages: [
              { role: 'system', content: systemPrompt },
              {
                role: 'user',
                content: `Context:\n${contextStr}\n\nQuestion: ${question}`,
              },
            ],
          },
          {
            headers: { Authorization: `Bearer ${llmConfig.apiKey}` },
            timeout: 60000,
          },
        );
        const content = response.data?.choices?.[0]?.message?.content;
        if (typeof content === 'string') {
          answer = content;
        } else {
          throw new Error('Invalid response from OpenAI endpoint');
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`LLM call failed: ${message}`);
      throw new ServiceUnavailableException(
        'LLM service is currently unavailable',
      );
    }

    return {
      answer,
      sources: Array.from(sourcesMap.values()),
      tokensUsed: estimatedTokens,
    };
  }
}

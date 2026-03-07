import axios from 'axios';
import { ResolvedLLMConfig } from '../providers/provider.factory';
import { DocumentType } from '@repo/types';

export class SummarizePipeline {
  private async callLlm(
    prompt: string,
    text: string,
    llmConfig: ResolvedLLMConfig,
  ): Promise<string> {
    const messages = [
      { role: 'system', content: prompt },
      { role: 'user', content: text },
    ];

    try {
      if (llmConfig.provider === 'ollama') {
        const response = await axios.post(`${llmConfig.baseUrl}/api/chat`, {
          model: llmConfig.chatModel,
          messages,
          stream: false,
          options: {
            temperature: 0.3, // Lower temp for more factual summaries
          },
        });
        return response.data.message.content;
      } else {
        const response = await axios.post(
          `${llmConfig.baseUrl}/chat/completions`,
          {
            model: llmConfig.chatModel,
            messages,
            temperature: 0.3,
          },
          {
            headers: {
              Authorization: `Bearer ${llmConfig.apiKey}`,
            },
          },
        );
        return response.data.choices[0].message.content;
      }
    } catch {
      throw new Error('Service Unavailable Error: LLM provider failed');
    }
  }

  private splitTextIntoSegments(text: string, maxTokens: number): string[] {
    // Rough estimation: 4 chars per token
    const maxChars = maxTokens * 4;
    const segments: string[] = [];
    let currentIndex = 0;

    while (currentIndex < text.length) {
      let nextIndex = currentIndex + maxChars;
      if (nextIndex < text.length) {
        // Try to break at a newline or period if possible
        const lastNewline = text.lastIndexOf('\n', nextIndex);
        const lastPeriod = text.lastIndexOf('. ', nextIndex);
        if (lastNewline > currentIndex + maxChars / 2) {
          nextIndex = lastNewline + 1;
        } else if (lastPeriod > currentIndex + maxChars / 2) {
          nextIndex = lastPeriod + 2;
        }
      } else {
        nextIndex = text.length;
      }
      segments.push(text.slice(currentIndex, nextIndex));
      currentIndex = nextIndex;
    }

    return segments;
  }

  async generateSummary(
    text: string,
    _docType: DocumentType,
    llmConfig: ResolvedLLMConfig,
  ): Promise<string> {
    if (!text || text.trim() === '') {
      throw new Error('No text provided for summary generation');
    }

    const systemPrompt =
      'You are a learning assistant. Write a concise, learning-focused summary. Focus on key concepts, main arguments, and practical takeaways. Use clear prose. 3-5 paragraphs maximum.';

    const estimatedTokens = text.length / 4;

    // Map-Reduce logic
    if (estimatedTokens > 6000) {
      const segments = this.splitTextIntoSegments(text, 4000);
      const miniSummaries: string[] = [];

      // Process segments sequentially or in parallel depending on the provider limits
      // For general reliability, particularly with local Ollama, we'll run sequentially
      for (const segment of segments) {
        const miniSummary = await this.callLlm(
          'Summarize the following text segment concisely, focusing on key points.',
          segment,
          llmConfig,
        );
        miniSummaries.push(miniSummary);
      }

      const combinedMiniSummaries = miniSummaries.join('\n\n---\n\n');

      // Final reduction pass
      return this.callLlm(
        systemPrompt +
          ' Please synthesize these segment summaries into one cohesive final summary.',
        combinedMiniSummaries,
        llmConfig,
      );
    } else {
      // Direct summarization
      return this.callLlm(systemPrompt, text, llmConfig);
    }
  }
}

export const summarizePipeline = new SummarizePipeline();

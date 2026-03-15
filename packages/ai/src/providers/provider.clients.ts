import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';
import type { ChatCompletionMessageParam as OpenAIParam } from 'openai/resources/chat/completions';

export type ChatCompletionMessageParam = OpenAIParam;

export interface ResolvedClient {
  readonly providerId: string;
  readonly modelId: string;

  complete(params: {
    messages: ChatCompletionMessageParam[];
    temperature?: number;
  }): Promise<string>;

  stream(params: {
    messages: ChatCompletionMessageParam[];
    temperature?: number;
    onToken: (token: string) => Promise<void> | void;
  }): Promise<string>;
}

export class OpenAIResolvedClient implements ResolvedClient {
  constructor(
    private client: OpenAI,
    public readonly providerId: string,
    public readonly modelId: string,
  ) {}

  async complete(params: {
    messages: ChatCompletionMessageParam[];
    temperature?: number;
  }): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.modelId,
        messages: params.messages,
        temperature: params.temperature ?? 0.7,
      });
      return response.choices[0]?.message?.content || '';
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`LLM call failed (${this.providerId}): ${message}`);
    }
  }

  async stream(params: {
    messages: ChatCompletionMessageParam[];
    temperature?: number;
    onToken: (token: string) => Promise<void> | void;
  }): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.modelId,
        messages: params.messages,
        temperature: params.temperature ?? 0.7,
        stream: true,
      });

      let fullText = '';
      for await (const chunk of response) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullText += content;
          await params.onToken(content);
        }
      }
      return fullText;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`LLM streaming failed (${this.providerId}): ${message}`);
    }
  }
}

export class GeminiResolvedClient implements ResolvedClient {
  private client: GoogleGenAI;

  constructor(
    apiKey: string,
    public readonly providerId: string,
    public readonly modelId: string,
  ) {
    this.client = new GoogleGenAI({ apiKey });
  }

  private mapMessages(messages: ChatCompletionMessageParam[]) {
    return messages.map((m) => {
      let role = 'user';
      if (m.role === 'assistant') role = 'model';
      return {
        role,
        parts: [{ text: String(m.content) }],
      };
    });
  }

  async complete(params: {
    messages: ChatCompletionMessageParam[];
    temperature?: number;
  }): Promise<string> {
    try {
      const response = await this.client.models.generateContent({
        model: this.modelId,
        contents: this.mapMessages(params.messages),
        config: {
          temperature: params.temperature,
        },
      });
      return response.text ?? '';
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`LLM call failed (gemini): ${message}`);
    }
  }

  async stream(params: {
    messages: ChatCompletionMessageParam[];
    temperature?: number;
    onToken: (token: string) => Promise<void> | void;
  }): Promise<string> {
    try {
      const response = await this.client.models.generateContentStream({
        model: this.modelId,
        contents: this.mapMessages(params.messages),
        config: {
          temperature: params.temperature,
        },
      });

      let fullText = '';
      for await (const chunk of response) {
        const content = chunk.text || '';
        if (content) {
          fullText += content;
          await params.onToken(content);
        }
      }
      return fullText;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`LLM streaming failed (gemini): ${message}`);
    }
  }
}

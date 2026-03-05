import { IsEnum, IsOptional, IsString, MinLength, IsUrl } from 'class-validator';

export enum LLMProvider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  OLLAMA = 'ollama',
}

export class SaveLLMConfigDto {
  @IsEnum(LLMProvider)
  provider!: LLMProvider;

  @IsString()
  @MinLength(1)
  chatModel!: string;

  @IsString()
  @MinLength(1)
  embeddingModel!: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  apiKey?: string;

  @IsOptional()
  @IsUrl()
  baseUrl?: string;
}

export class ValidateLLMConfigDto
  extends SaveLLMConfigDto
{}

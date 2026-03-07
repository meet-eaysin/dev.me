import { IsString, IsNotEmpty, IsOptional, IsIn, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum LLMProvider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  OLLAMA = 'ollama',
}

export class SaveLLMConfigDto {
  @ApiProperty({ enum: ['openai', 'anthropic', 'ollama'], example: 'openai' })
  @IsString()
  @IsNotEmpty()
  @IsIn(['openai', 'anthropic', 'ollama'])
  provider!: 'openai' | 'anthropic' | 'ollama';

  @ApiProperty({ example: 'gpt-4o' })
  @IsString()
  @IsNotEmpty()
  chatModel!: string;

  @ApiProperty({ example: 'text-embedding-3-small' })
  @IsString()
  @IsNotEmpty()
  embeddingModel!: string;

  @ApiPropertyOptional({
    description: 'API key for the provider (encrypted at rest)',
  })
  @IsString()
  @IsOptional()
  apiKey?: string;

  @ApiPropertyOptional({
    description: 'Custom base URL if using a proxy or Ollama',
    example: 'http://localhost:11434',
  })
  @IsOptional()
  @IsUrl()
  baseUrl?: string;
}

export class ValidateLLMConfigDto extends SaveLLMConfigDto {}

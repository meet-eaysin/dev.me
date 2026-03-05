import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LLMCapabilitiesDto {
  @ApiProperty()
  chat!: boolean;

  @ApiProperty()
  embeddings!: boolean;
}

export class LLMConfigPublicViewDto {
  @ApiProperty()
  userId!: string;

  @ApiProperty({ enum: ['openai', 'anthropic', 'ollama'] })
  provider!: 'openai' | 'anthropic' | 'ollama';

  @ApiProperty()
  chatModel!: string;

  @ApiProperty()
  embeddingModel!: string;

  @ApiPropertyOptional({ nullable: true })
  baseUrl!: string | null;

  @ApiProperty({ type: LLMCapabilitiesDto })
  capabilities!: LLMCapabilitiesDto;

  @ApiPropertyOptional({ nullable: true })
  validatedAt!: string | null;
}

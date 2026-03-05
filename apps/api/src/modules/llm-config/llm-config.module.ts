import { Module } from '@nestjs/common';
import { LLMValidatorService } from './domain/services/llm-validator.service';
import { GetLLMConfigUseCase } from './application/use-cases/get-llm-config.usecase';
import { SaveLLMConfigUseCase } from './application/use-cases/save-llm-config.usecase';
import { ValidateLLMConfigUseCase } from './application/use-cases/validate-llm-config.usecase';
import { LLMConfigController } from './interface/llm-config.controller';

@Module({
  controllers: [LLMConfigController],
  providers: [
    LLMValidatorService,
    GetLLMConfigUseCase,
    SaveLLMConfigUseCase,
    ValidateLLMConfigUseCase,
  ],
  exports: [GetLLMConfigUseCase, SaveLLMConfigUseCase, LLMValidatorService],
})
export class LLMConfigModule {}

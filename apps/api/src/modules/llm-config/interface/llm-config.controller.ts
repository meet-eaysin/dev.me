import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DevUserGuard } from '../../../shared/guards/dev-user.guard';
import { User } from '../../../shared/decorators/user.decorator';
import { GetLLMConfigUseCase } from '../application/use-cases/get-llm-config.usecase';
import { SaveLLMConfigUseCase } from '../application/use-cases/save-llm-config.usecase';
import { ValidateLLMConfigUseCase } from '../application/use-cases/validate-llm-config.usecase';
import { LLMConfigModel } from '@repo/db';
import { Types } from 'mongoose';
import {
  SaveLLMConfigDto,
  ValidateLLMConfigDto,
} from './dtos/llm-config.dto';

@Controller('llm-config')
@UseGuards(DevUserGuard)
export class LLMConfigController {
  constructor(
    private readonly getUseCase: GetLLMConfigUseCase,
    private readonly saveUseCase: SaveLLMConfigUseCase,
    private readonly validateUseCase: ValidateLLMConfigUseCase,
  ) {}

  @Get()
  async getConfig(@User('userId') userId: string) {
    const config = await this.getUseCase.execute(userId);
    return { success: true, data: config };
  }

  @Put()
  async saveConfig(
    @User('userId') userId: string,
    @Body() body: SaveLLMConfigDto,
  ) {
    const config = await this.saveUseCase.execute(userId, body);
    return { success: true, data: config };
  }

  @Post('validate')
  async validateConfig(
    @User('userId') userId: string,
    @Body() body: ValidateLLMConfigDto,
  ) {
    const capabilities = await this.validateUseCase.execute(userId, body);
    return { success: true, data: capabilities };
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteConfig(@User('userId') userId: string) {
    await LLMConfigModel.deleteOne({
      userId: new Types.ObjectId(userId),
    });
  }
}

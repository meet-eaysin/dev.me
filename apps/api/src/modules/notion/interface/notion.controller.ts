import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { DevUserGuard } from '../../../shared/guards/dev-user.guard';
import { ConnectNotionUseCase } from '../application/use-cases/connect-notion.usecase';
import { ListNotionDatabasesUseCase } from '../application/use-cases/list-notion-databases.usecase';
import { UpdateNotionConfigUseCase } from '../application/use-cases/update-notion-config.usecase';
import { SyncAllToNotionUseCase } from '../application/use-cases/sync-all-to-notion.usecase';
import { DisconnectNotionUseCase } from '../application/use-cases/disconnect-notion.usecase';
import { NotionConfigModel } from '@repo/db';
import { User } from '../../../shared/decorators/user.decorator';
import { ConnectNotionDto, UpdateNotionConfigDto } from './dtos/notion.dto';

@Controller('notion')
@UseGuards(DevUserGuard)
export class NotionController {
  constructor(
    private readonly connectUseCase: ConnectNotionUseCase,
    private readonly listDatabasesUseCase: ListNotionDatabasesUseCase,
    private readonly updateConfigUseCase: UpdateNotionConfigUseCase,
    private readonly syncUseCase: SyncAllToNotionUseCase,
    private readonly disconnectUseCase: DisconnectNotionUseCase,
  ) {}

  @Get('config')
  async getConfig(@User('userId') userId: string) {
    const config = await NotionConfigModel.findOne({
      userId,
    });
    if (!config) throw new NotFoundException('Not connected');

    return {
      success: true,
      data: {
        userId: config.userId.toString(),
        workspaceId: config.workspaceId,
        workspaceName: config.workspaceName,
        targetDatabaseId: config.targetDatabaseId,
        syncEnabled: config.syncEnabled,
        syncDirection: config.syncDirection,
        lastSyncedAt: config.lastSyncedAt?.toISOString(),
      },
    };
  }

  @Post('connect')
  @HttpCode(HttpStatus.CREATED)
  async connect(
    @User('userId') userId: string,
    @Body() body: ConnectNotionDto,
  ) {
    const config = await this.connectUseCase.execute(userId, body.accessToken);
    return { success: true, data: config };
  }

  @Get('databases')
  async listDatabases(@User('userId') userId: string) {
    const databases = await this.listDatabasesUseCase.execute(userId);
    return { success: true, data: databases };
  }

  @Patch('config')
  async updateConfig(
    @User('userId') userId: string,
    @Body() body: UpdateNotionConfigDto,
  ) {
    const config = await this.updateConfigUseCase.execute(userId, body);
    return { success: true, data: config };
  }

  @Post('sync')
  @HttpCode(HttpStatus.ACCEPTED)
  async sync(@User('userId') userId: string) {
    const result = await this.syncUseCase.execute(userId);
    return { success: true, message: 'Sync complete', data: result };
  }

  @Delete('config')
  @HttpCode(HttpStatus.NO_CONTENT)
  async disconnect(@User('userId') userId: string) {
    await this.disconnectUseCase.execute(userId);
  }
}

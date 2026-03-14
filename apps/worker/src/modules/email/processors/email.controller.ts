import {
  Logger,
  Controller,
  Post,
  UseGuards,
  Body,
  Headers,
} from '@nestjs/common';
import { QUEUE_EMAILS } from '@repo/types';
import type { EmailJobData } from '@repo/types';
import { QStashGuard } from '../../../shared/guards/qstash.guard';

@Controller('api/webhooks')
export class EmailController {
  private readonly logger = new Logger(EmailController.name);

  @Post(QUEUE_EMAILS)
  @UseGuards(QStashGuard)
  async process(
    @Body() data: EmailJobData,
    @Headers('Upstash-Message-Id') messageId: string,
  ): Promise<void> {
    const { to, subject, body } = data;
    const jobId = messageId ?? 'unknown';
    this.logger.log(`Processing email job ${jobId} for recipient ${to}`);

    // TODO: Real mail provider integration should go here.
    this.logger.debug(`Email subject="${subject}" bodyLength=${body.length}`);
  }
}

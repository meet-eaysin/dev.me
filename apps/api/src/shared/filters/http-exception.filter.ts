import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Handle NestJS native HttpExceptions (like from ValidationPipe)
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const responseBody = exception.getResponse();

      let message: string | string[] = exception.message;
      let error = HttpStatus[statusCode] ?? 'Error';

      if (typeof responseBody === 'string') {
        message = responseBody;
      } else if (typeof responseBody === 'object' && responseBody !== null) {
        const body = responseBody as {
          message?: string | string[];
          error?: string;
        };
        if (body.message !== undefined) {
          message = body.message;
        }
        if (body.error) {
          error = body.error;
        }
      }

      return response.status(statusCode).json({
        statusCode,
        message,
        error,
      });
    }

    this.logger.error(
      `Unhandled exception: ${exception instanceof Error ? exception.message : 'Unknown'}`,
      exception instanceof Error ? exception.stack : '',
    );

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      error: 'Internal Server Error',
    });
  }
}

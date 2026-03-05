import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger, BadRequestException, ValidationError } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { env } from './shared/utils/env';
import { AllExceptionsFilter } from './shared/filters/http-exception.filter';

const logger = new Logger('Bootstrap');

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger:
      env.NODE_ENV === 'production'
        ? ['error', 'warn', 'log']
        : ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Security & Middleware
  app.use(helmet());

  // CORS Configuration
  app.enableCors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  });

  // Global Validation Pipe for DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const formatErrors = (errs: ValidationError[]): Record<string, string[]> => {
          const result: Record<string, string[]> = {};
          for (const error of errs) {
            if (error.constraints) {
              const constraints = error.constraints as Record<string, string>;
              result[error.property] = Object.values(constraints);
            }
            if (error.children && error.children.length > 0) {
              const childErrors = formatErrors(error.children);
              for (const [key, val] of Object.entries(childErrors)) {
                result[`${error.property}.${key}`] = val;
              }
            }
          }
          return result;
        };

        const messages = formatErrors(errors);
        
        return new BadRequestException({
          message: 'Validation failed',
          error: 'VALIDATION_ERROR',
          details: Object.entries(messages).map(([field, message]) => ({
            field,
            message: message[0], // Only take the first message per field for compactness, or join them
          })),
        });
      },
    }),
  );

  // Global Error Handling
  app.useGlobalFilters(new AllExceptionsFilter());

  // Versioned API prefix
  app.setGlobalPrefix('api/v1');

  const PORT = env.PORT;
  const HOST = env.HOST ?? '0.0.0.0';

  await app.listen(PORT, HOST);
}

bootstrap().catch((error) => {
  logger.error('Application failed to start:', error);
  process.exit(1);
});

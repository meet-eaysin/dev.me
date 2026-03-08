import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';

const nodeEnv = process.env.NODE_ENV ?? 'development';
const envFileName = nodeEnv === 'production' ? '.env.production' : '.env.local';

const envCandidates = [
  path.resolve(process.cwd(), 'apps/api', envFileName),
  path.resolve(process.cwd(), envFileName),
  path.resolve(__dirname, '../../../', envFileName),
];

for (const envPath of envCandidates) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}

function getEnv(key: string, required = true, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;
  if (required && value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value ?? '';
}

function getRedisUrl(): string {
  const host = getEnv('REDIS_HOST');
  const port = getEnv('REDIS_PORT');
  const password = getEnv('REDIS_PASSWORD', false);
  const auth = password ? `:${encodeURIComponent(password)}@` : '';

  return `redis://${auth}${host}:${port}`;
}

export const env = {
  PORT: getEnv('PORT', false, '3000'),
  HOST: getEnv('HOST', false, '0.0.0.0'),
  NODE_ENV: getEnv('NODE_ENV', false, 'development'),
  MONGODB_URI: getEnv('MONGODB_URI'),
  REDIS_HOST: getEnv('REDIS_HOST'),
  REDIS_PORT: Number(getEnv('REDIS_PORT', false, '6379')),
  REDIS_PASSWORD: getEnv('REDIS_PASSWORD', false),
  REDIS_URL: getRedisUrl(),
  QDRANT_URL: getEnv('QDRANT_URL'),
  QDRANT_API_KEY: getEnv('QDRANT_API_KEY', false),
  OLLAMA_URL: getEnv('OLLAMA_URL'),
  JWT_SECRET: getEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN'),
  REFRESH_TOKEN_SECRET: getEnv('REFRESH_TOKEN_SECRET'),
  REFRESH_TOKEN_EXPIRES_IN: getEnv('REFRESH_TOKEN_EXPIRES_IN'),
  ENCRYPTION_KEY: getEnv('ENCRYPTION_KEY'),
  GOOGLE_CLIENT_ID: getEnv('GOOGLE_CLIENT_ID', false),
  GOOGLE_CLIENT_SECRET: getEnv('GOOGLE_CLIENT_SECRET', false),
  GOOGLE_CALLBACK_URL: getEnv('GOOGLE_CALLBACK_URL', false),
  GITHUB_CLIENT_ID: getEnv('GITHUB_CLIENT_ID', false),
  GITHUB_CLIENT_SECRET: getEnv('GITHUB_CLIENT_SECRET', false),
  GITHUB_CALLBACK_URL: getEnv('GITHUB_CALLBACK_URL', false),
  WEB_APP_URL: getEnv('WEB_APP_URL', false),
  FILE_UPLOAD_DIR: getEnv('FILE_UPLOAD_DIR'),
  MAX_FILE_SIZE_MB: Number(getEnv('MAX_FILE_SIZE_MB', false, '50')),
  CORS_ORIGIN: getEnv('CORS_ORIGIN'),
};

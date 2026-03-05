import dotenv from 'dotenv';

dotenv.config();

function getEnv(key: string, required = true, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value as string;
}

export const env = {
  PORT: getEnv('PORT', false, '3000'),
  HOST: getEnv('HOST', false, '0.0.0.0'),
  NODE_ENV: getEnv('NODE_ENV', false, 'development'),
  MONGODB_URI: getEnv('MONGODB_URI'),
  REDIS_URL: getEnv('REDIS_URL'),
  QDRANT_URL: getEnv('QDRANT_URL'),
  QDRANT_API_KEY: getEnv('QDRANT_API_KEY', false),
  OLLAMA_URL: getEnv('OLLAMA_URL'),
  JWT_SECRET: getEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: getEnv('JWT_EXPIRES_IN'),
  REFRESH_TOKEN_SECRET: getEnv('REFRESH_TOKEN_SECRET'),
  REFRESH_TOKEN_EXPIRES_IN: getEnv('REFRESH_TOKEN_EXPIRES_IN'),
  ENCRYPTION_KEY: getEnv('ENCRYPTION_KEY'),
  FILE_UPLOAD_DIR: getEnv('FILE_UPLOAD_DIR'),
  MAX_FILE_SIZE_MB: Number(getEnv('MAX_FILE_SIZE_MB', false, '50')),
  CORS_ORIGIN: getEnv('CORS_ORIGIN'),
};

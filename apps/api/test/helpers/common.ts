import { expect } from '@jest/globals';
import mongoose from 'mongoose';

export const TEST_USER_ID = '65f1a2b3c4d5e6f7a8b9c0d1';

export interface HealthResponse {
  status: string;
  timestamp: string;
}

export interface ErrorResponse {
  success: boolean;
  statusCode: number;
  error: string;
  message: string;
  details?: Array<{ field: string; message: string }>;
  timestamp: string;
  path: string;
}

export function isHealthResponse(body: unknown): body is HealthResponse {
  return (
    typeof body === 'object' &&
    body !== null &&
    'status' in body &&
    'timestamp' in body
  );
}

export function isErrorResponse(body: unknown): body is ErrorResponse {
  return (
    typeof body === 'object' &&
    body !== null &&
    'success' in body &&
    body.success === false &&
    'statusCode' in body &&
    'message' in body &&
    'error' in body &&
    'timestamp' in body &&
    'path' in body
  );
}

export function assertHealthSuccess(body: unknown): void {
  if (isHealthResponse(body)) {
    expect(body.status).toBe('ok');
    expect(body.timestamp).toEqual(expect.any(String));
  } else {
    throw new Error('Response body does not match HealthResponse shape');
  }
}

export function assertErrorShape(body: unknown, statusCode: number, error: string): void {
  if (isErrorResponse(body)) {
    expect(body.success).toBe(false);
    expect(body.statusCode).toBe(statusCode);
    expect(body.error).toBe(error);
    expect(typeof body.message).toBe('string');
    expect(typeof body.timestamp).toBe('string');
    expect(typeof body.path).toBe('string');
  } else {
    throw new Error('Response body does not match ErrorResponse shape');
  }
}

export function generateId(): string {
  return new mongoose.Types.ObjectId().toHexString();
}

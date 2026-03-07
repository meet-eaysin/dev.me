export type ApiEnvelope<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';
const DEV_USER_ID =
  process.env.NEXT_PUBLIC_DEV_USER_ID ?? '65f1a2b3c4d5e6f7a8b9c0d3';

async function parseEnvelope<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const errorBody = (await response.json()) as { message?: string };
      if (typeof errorBody?.message === 'string') {
        message = errorBody.message;
      }
    } catch {
      // Keep fallback message when response is not JSON.
    }
    throw new ApiError(message, response.status);
  }

  const payload = (await response.json()) as ApiEnvelope<T>;
  return payload.data;
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'x-user-id': DEV_USER_ID,
    },
    cache: 'no-store',
  });

  return parseEnvelope<T>(response);
}

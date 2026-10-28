import "server-only";

import type { ApiErrorPayload } from "@/types/api";

export const API_BASE_URL = (
  process.env.LARAVEL_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://127.0.0.1:8000/api"
).replace(/\/+$/, "");

type NextFetchOptions = {
  revalidate?: number | false;
  tags?: string[];
};

export interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  token?: string | null;
  next?: NextFetchOptions;
}

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status = 0, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

function extractMessage(payload: ApiErrorPayload | null, fallback: string): string {
  if (payload?.message && typeof payload.message === "string") return payload.message;
  if (payload?.errors) {
    const first = Object.values(payload.errors)[0]?.[0];
    if (first) return first;
  }
  return fallback;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { body, token, headers, next, ...rest } = options;
  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const requestHeaders = new Headers(headers);
  requestHeaders.set("Accept", "application/json");
  requestHeaders.set("Accept-Language", "id-ID");
  if (body !== undefined) requestHeaders.set("Content-Type", "application/json");
  if (token) requestHeaders.set("Authorization", `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(url, {
      ...rest,
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: next ? undefined : "no-store",
      next,
      signal: rest.signal ?? AbortSignal.timeout(15000),
    } as RequestInit & { next?: NextFetchOptions });
  } catch {
    throw new ApiError(
      "Tidak dapat terhubung ke layanan data TeraPublic. Pastikan backend Laravel sedang berjalan.",
      0,
    );
  }

  const text = await response.text();
  let payload: unknown = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    const errorPayload = payload as ApiErrorPayload | null;
    throw new ApiError(
      extractMessage(errorPayload, `Permintaan data gagal (${response.status}).`),
      response.status,
      errorPayload?.errors,
    );
  }

  return payload as T;
}

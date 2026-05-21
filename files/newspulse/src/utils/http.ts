import { FETCH_TIMEOUT_MS, RETRY_ATTEMPTS, RETRY_BASE_DELAY_MS } from "../constants";
import { sleep } from "./index";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class TimeoutError extends Error {
  constructor(url: string) {
    super(`Request to ${url} timed out after ${FETCH_TIMEOUT_MS}ms`);
    this.name = "TimeoutError";
  }
}

interface FetchOptions extends RequestInit {
  timeoutMs?: number;
  retries?: number;
}

/**
 * Fetch with timeout using AbortController.
 */
async function fetchWithTimeout(url: string, options: FetchOptions = {}): Promise<Response> {
  const { timeoutMs = FETCH_TIMEOUT_MS, ...fetchOptions } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    return response;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new TimeoutError(url);
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Exponential backoff retry wrapper.
 * Retries on network errors and 5xx responses.
 * Does NOT retry on 4xx (client error — retrying won't help).
 */
export async function fetchWithRetry<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const maxAttempts = options.retries ?? RETRY_ATTEMPTS;
  let lastError: Error = new Error("Unknown error");

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await fetchWithTimeout(url, options);

      if (!response.ok) {
        // 4xx — don't retry, surface immediately
        if (response.status >= 400 && response.status < 500) {
          const body = await response.json().catch(() => ({}));
          throw new ApiError(
            body.message ?? `Request failed: ${response.status}`,
            response.status,
            body.code
          );
        }

        // 5xx — throw to trigger retry
        throw new ApiError(`Server error: ${response.status}`, response.status);
      }

      return response.json() as Promise<T>;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      // Don't retry on ApiError with 4xx
      if (err instanceof ApiError && err.status && err.status < 500) {
        throw err;
      }

      // Don't retry on last attempt
      if (attempt < maxAttempts - 1) {
        const delay = RETRY_BASE_DELAY_MS * Math.pow(2, attempt);
        await sleep(delay);
      }
    }
  }

  throw lastError;
}

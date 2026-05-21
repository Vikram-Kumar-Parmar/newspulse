import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError, TimeoutError, fetchWithRetry } from "../utils/http";

// We mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function makeResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

describe("fetchWithRetry", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns parsed JSON on success", async () => {
    mockFetch.mockResolvedValueOnce(makeResponse({ articles: [], totalResults: 0, status: "ok" }));

    const result = await fetchWithRetry<{ articles: unknown[] }>("https://api.example.com/news", {
      retries: 1,
    });
    expect(result).toEqual({ articles: [], totalResults: 0, status: "ok" });
  });

  it("throws ApiError on 4xx without retrying", async () => {
    mockFetch.mockResolvedValueOnce(
      makeResponse({ message: "Invalid API key", code: "apiKeyInvalid" }, 401)
    );

    await expect(
      fetchWithRetry("https://api.example.com/news", { retries: 3 })
    ).rejects.toBeInstanceOf(ApiError);

    // Should only have been called once — no retry on 4xx
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("retries on 5xx errors", async () => {
    mockFetch
      .mockResolvedValueOnce(makeResponse({ error: "Server Error" }, 500))
      .mockResolvedValueOnce(makeResponse({ articles: [], totalResults: 0, status: "ok" }));

    const promise = fetchWithRetry<{ articles: unknown[] }>("https://api.example.com/news", {
      retries: 3,
    });

    // Advance timers to bypass exponential backoff delay
    await vi.runAllTimersAsync();

    const result = await promise;
    expect(result).toEqual({ articles: [], totalResults: 0, status: "ok" });
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("throws TimeoutError when request times out", async () => {
    // Simulate fetch that never resolves (hangs)
    mockFetch.mockImplementationOnce(
      (_url: string, options: RequestInit) =>
        new Promise((_resolve, reject) => {
          // The AbortController signal from fetchWithTimeout should fire
          options.signal?.addEventListener("abort", () => {
            reject(new DOMException("The operation was aborted", "AbortError"));
          });
        })
    );

    const promise = fetchWithRetry("https://api.example.com/news", {
      retries: 1,
      timeoutMs: 100,
    });

    // Advance timers past timeout
    await vi.advanceTimersByTimeAsync(200);

    await expect(promise).rejects.toBeInstanceOf(TimeoutError);
  });
});

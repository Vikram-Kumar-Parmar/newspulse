import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cache } from "../utils/cache";

describe("MemoryCache", () => {
  beforeEach(() => {
    cache.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("stores and retrieves a value", () => {
    cache.set("key1", { articles: [] }, 60_000);
    expect(cache.get("key1")).toEqual({ articles: [] });
  });

  it("returns null for missing keys", () => {
    expect(cache.get("nope")).toBeNull();
  });

  it("returns null after TTL expires", () => {
    cache.set("expiring", "value", 1_000);
    vi.advanceTimersByTime(2_000);
    expect(cache.get("expiring")).toBeNull();
  });

  it("does not expire before TTL", () => {
    cache.set("alive", "data", 10_000);
    vi.advanceTimersByTime(5_000);
    expect(cache.get("alive")).toBe("data");
  });

  it("invalidates a specific key", () => {
    cache.set("remove-me", 42, 60_000);
    cache.invalidate("remove-me");
    expect(cache.get("remove-me")).toBeNull();
  });

  it("clears all keys", () => {
    cache.set("a", 1, 60_000);
    cache.set("b", 2, 60_000);
    cache.clear();
    expect(cache.get("a")).toBeNull();
    expect(cache.get("b")).toBeNull();
  });
});

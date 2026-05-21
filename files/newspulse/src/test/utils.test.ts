import { describe, expect, it } from "vitest";
import {
  buildCacheKey,
  clamp,
  formatRelativeTime,
  hashString,
  sanitizeQuery,
  truncate,
} from "../utils";

describe("hashString", () => {
  it("returns a string", () => {
    expect(typeof hashString("https://example.com/article")).toBe("string");
  });

  it("is deterministic — same input, same output", () => {
    const url = "https://bbc.com/news/world-123";
    expect(hashString(url)).toBe(hashString(url));
  });

  it("produces different values for different inputs", () => {
    expect(hashString("foo")).not.toBe(hashString("bar"));
  });
});

describe("truncate", () => {
  it("returns the original string when shorter than limit", () => {
    expect(truncate("short", 20)).toBe("short");
  });

  it("truncates without cutting mid-word", () => {
    const result = truncate("the quick brown fox", 12);
    expect(result).toBe("the quick…");
  });

  it("handles exact-length strings without truncating", () => {
    expect(truncate("hello", 5)).toBe("hello");
  });
});

describe("sanitizeQuery", () => {
  it("trims whitespace", () => {
    expect(sanitizeQuery("  hello world  ")).toBe("hello world");
  });

  it("collapses multiple spaces", () => {
    expect(sanitizeQuery("foo   bar")).toBe("foo bar");
  });

  it("strips dangerous special characters", () => {
    // Unmatched backticks and angle brackets should be removed
    const cleaned = sanitizeQuery("search <script>alert(1)</script>");
    expect(cleaned).not.toContain("<");
    expect(cleaned).not.toContain(">");
  });

  it("preserves basic punctuation", () => {
    const result = sanitizeQuery("breaking news, 2024!");
    expect(result).toContain(",");
    expect(result).toContain("!");
  });

  it("returns empty string for empty input", () => {
    expect(sanitizeQuery("")).toBe("");
    expect(sanitizeQuery("   ")).toBe("");
  });

  it("caps output at 500 characters", () => {
    const long = "a".repeat(600);
    expect(sanitizeQuery(long).length).toBe(500);
  });
});

describe("clamp", () => {
  it("clamps below minimum", () => expect(clamp(-5, 0, 10)).toBe(0));
  it("clamps above maximum", () => expect(clamp(20, 0, 10)).toBe(10));
  it("returns value within range", () => expect(clamp(5, 0, 10)).toBe(5));
});

describe("buildCacheKey", () => {
  it("is consistent regardless of object key order", () => {
    const a = buildCacheKey({ country: "us", category: "general" });
    const b = buildCacheKey({ category: "general", country: "us" });
    expect(a).toBe(b);
  });

  it("produces different keys for different values", () => {
    const a = buildCacheKey({ country: "us" });
    const b = buildCacheKey({ country: "gb" });
    expect(a).not.toBe(b);
  });
});

describe("formatRelativeTime", () => {
  it("returns 'just now' for very recent dates", () => {
    const recent = new Date(Date.now() - 10_000);
    expect(formatRelativeTime(recent)).toBe("just now");
  });

  it("returns minutes for recent dates", () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    expect(formatRelativeTime(fiveMinutesAgo)).toMatch(/^\d+m ago$/);
  });

  it("returns hours for older dates", () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    expect(formatRelativeTime(twoHoursAgo)).toMatch(/^\d+h ago$/);
  });
});

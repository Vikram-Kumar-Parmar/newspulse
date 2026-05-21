/**
 * Simple hash for generating stable article IDs from URLs.
 * Not cryptographic — just needs to be unique enough for React keys.
 */
export function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // convert to 32-bit int
  }
  return Math.abs(hash).toString(36);
}

/**
 * Format a date relative to now (e.g. "3 hours ago").
 * Falls back to absolute date for anything older than a week.
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

/**
 * Truncate text to a max length without cutting mid-word.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  return lastSpace > 0 ? truncated.slice(0, lastSpace) + "…" : truncated + "…";
}

/**
 * Debounce a function. Returns a cleanup function.
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): [T, () => void] {
  let timer: ReturnType<typeof setTimeout>;
  const debounced = ((...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as T;
  const cancel = () => clearTimeout(timer);
  return [debounced, cancel];
}

/**
 * Sleep helper for retry backoff.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Sanitize user query input — strip characters that break NewsAPI queries.
 * NewsAPI can choke on unmatched quotes and certain special chars.
 */
export function sanitizeQuery(query: string): string {
  return query
    .trim()
    .replace(/[^\w\s\-'".,!?]/g, "") // keep alphanumeric + basic punctuation
    .replace(/\s+/g, " ")
    .slice(0, 500); // NewsAPI has an undocumented length limit we hedge against
}

/**
 * Build a cache key from search parameters.
 */
export function buildCacheKey(params: Record<string, string | number>): string {
  return Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}:${v}`)
    .join("|");
}

/**
 * Clamp a number within a range.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

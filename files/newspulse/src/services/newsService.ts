import { NEWS_API_BASE, PAGE_SIZE } from "../constants";
import type {
  Article,
  NewsApiResponse,
  NewsCategory,
  RawArticle,
  SortOrder,
} from "../types";
import { ApiError, fetchWithRetry } from "../utils/http";
import { buildCacheKey, hashString, sanitizeQuery } from "../utils";
import { cache } from "../utils/cache";

// The API key must be injected at build time via Vite's env system.
// We validate it once here rather than silently sending bad requests.
const API_KEY = import.meta.env.VITE_NEWS_API_KEY as string | undefined;

function getApiKey(): string {
  if (!API_KEY || API_KEY === "your_newsapi_key_here") {
    throw new ApiError(
      "NewsAPI key is not configured. Copy .env.example to .env and add your key from newsapi.org.",
      401,
      "missingApiKey"
    );
  }
  return API_KEY;
}

/**
 * Normalize a raw API article to our clean internal shape.
 * Guards against all the null/undefined fields NewsAPI can return.
 */
function normalizeArticle(raw: RawArticle): Article | null {
  // Articles with "[Removed]" titles are tombstoned by NewsAPI — skip them.
  if (!raw.title || raw.title === "[Removed]") return null;
  if (!raw.url) return null;

  let publishedAt: Date;
  try {
    publishedAt = new Date(raw.publishedAt);
    // Guard against invalid dates (e.g. "0001-01-01T00:00:00Z" from some sources)
    if (isNaN(publishedAt.getTime())) throw new Error("invalid date");
  } catch {
    publishedAt = new Date();
  }

  return {
    id: hashString(raw.url),
    source: raw.source?.name ?? "Unknown Source",
    author: raw.author?.trim() || "Staff Reporter",
    title: raw.title.trim(),
    description: raw.description?.trim() || "No description available.",
    url: raw.url,
    imageUrl: raw.urlToImage ?? null,
    publishedAt,
    content: raw.content?.replace(/\[\+\d+ chars\]$/, "").trim() || "",
  };
}

export interface TopHeadlinesParams {
  country: string;
  category: NewsCategory;
  query?: string;
  page?: number;
}

export async function fetchTopHeadlines(
  params: TopHeadlinesParams
): Promise<{ articles: Article[]; totalResults: number }> {
  const { country, category, query = "", page = 1 } = params;
  const sanitized = sanitizeQuery(query);

  const cacheKey = buildCacheKey({
    country,
    category,
    query: sanitized,
    page,
  });

  const cached = cache.get<{ articles: Article[]; totalResults: number }>(cacheKey);
  if (cached) return cached;

  const apiKey = getApiKey();
  const url = new URL(`${NEWS_API_BASE}/top-headlines`);
  url.searchParams.set("apiKey", apiKey);
  url.searchParams.set("country", country);
  url.searchParams.set("category", category);
  url.searchParams.set("pageSize", String(PAGE_SIZE));
  url.searchParams.set("page", String(page));
  if (sanitized) url.searchParams.set("q", sanitized);

  const data = await fetchWithRetry<NewsApiResponse>(url.toString());

  if (data.status !== "ok") {
    throw new ApiError(
      data.message ?? "NewsAPI returned an unexpected error",
      undefined,
      data.code
    );
  }

  const articles = (data.articles ?? [])
    .map(normalizeArticle)
    .filter((a): a is Article => a !== null);

  const result = { articles, totalResults: data.totalResults ?? 0 };
  cache.set(cacheKey, result);
  return result;
}

export interface SearchEverythingParams {
  query: string;
  sortBy?: SortOrder;
  page?: number;
  language?: string;
}

export async function searchEverything(
  params: SearchEverythingParams
): Promise<{ articles: Article[]; totalResults: number }> {
  const { query, sortBy = "publishedAt", page = 1, language = "en" } = params;
  const sanitized = sanitizeQuery(query);

  if (!sanitized) {
    return { articles: [], totalResults: 0 };
  }

  const cacheKey = buildCacheKey({ query: sanitized, sortBy, page, language, mode: "everything" });
  const cached = cache.get<{ articles: Article[]; totalResults: number }>(cacheKey);
  if (cached) return cached;

  const apiKey = getApiKey();
  const url = new URL(`${NEWS_API_BASE}/everything`);
  url.searchParams.set("apiKey", apiKey);
  url.searchParams.set("q", sanitized);
  url.searchParams.set("sortBy", sortBy);
  url.searchParams.set("pageSize", String(PAGE_SIZE));
  url.searchParams.set("page", String(page));
  url.searchParams.set("language", language);

  const data = await fetchWithRetry<NewsApiResponse>(url.toString());

  if (data.status !== "ok") {
    throw new ApiError(
      data.message ?? "NewsAPI returned an unexpected error",
      undefined,
      data.code
    );
  }

  const articles = (data.articles ?? [])
    .map(normalizeArticle)
    .filter((a): a is Article => a !== null);

  const result = { articles, totalResults: data.totalResults ?? 0 };
  cache.set(cacheKey, result);
  return result;
}

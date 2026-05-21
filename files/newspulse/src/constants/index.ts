export const NEWS_API_BASE = "https://newsapi.org/v2";
export const COUNTRIES_API_BASE = "https://restcountries.com/v3.1";

// NewsAPI only supports a subset of ISO country codes
// This is the authoritative list from their docs
export const SUPPORTED_COUNTRY_CODES = new Set([
  "ae", "ar", "at", "au", "be", "bg", "br", "ca", "ch", "cn", "co", "cu",
  "cz", "de", "eg", "fr", "gb", "gr", "hk", "hu", "id", "ie", "il", "in",
  "it", "jp", "kr", "lt", "lv", "ma", "mx", "my", "ng", "nl", "no", "nz",
  "ph", "pl", "pt", "ro", "rs", "ru", "sa", "se", "sg", "si", "sk", "th",
  "tr", "tw", "ua", "us", "ve", "za",
]);

export const CATEGORIES = [
  { value: "general", label: "General" },
  { value: "business", label: "Business" },
  { value: "entertainment", label: "Entertainment" },
  { value: "health", label: "Health" },
  { value: "science", label: "Science" },
  { value: "sports", label: "Sports" },
  { value: "technology", label: "Technology" },
] as const;

export const SORT_OPTIONS = [
  { value: "publishedAt", label: "Newest" },
  { value: "popularity", label: "Most Popular" },
  { value: "relevancy", label: "Most Relevant" },
] as const;

export const DEFAULT_SEARCH_PARAMS = {
  query: "",
  country: "us",
  category: "general" as const,
  sortBy: "publishedAt" as const,
  page: 1,
};

export const PAGE_SIZE = 12;

// Retry config
export const RETRY_ATTEMPTS = 3;
export const RETRY_BASE_DELAY_MS = 800;
export const FETCH_TIMEOUT_MS = 10_000;

// Cache TTL in ms — headlines go stale fast
export const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Fallback placeholder for articles without images
export const FALLBACK_IMAGE = null;

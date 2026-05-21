// NewsAPI response shapes
export interface RawArticle {
  source: { id: string | null; name: string };
  author: string | null;
  title: string | null;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsApiResponse {
  status: "ok" | "error";
  totalResults?: number;
  articles?: RawArticle[];
  code?: string;
  message?: string;
}

// Normalized article — what the rest of the app works with
export interface Article {
  id: string; // derived from url hash
  source: string;
  author: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string | null;
  publishedAt: Date;
  content: string;
}

// REST Countries
export interface RawCountry {
  name: { common: string; official: string };
  cca2: string;
  flags: { svg: string; png: string; alt?: string };
  region: string;
  subregion?: string;
  population: number;
  languages?: Record<string, string>;
  capital?: string[];
}

export interface Country {
  code: string; // ISO 3166-1 alpha-2, used by NewsAPI
  name: string;
  flag: string;
  region: string;
  subregion: string;
  population: number;
  languages: string[];
  capital: string;
}

export type NewsCategory =
  | "general"
  | "business"
  | "entertainment"
  | "health"
  | "science"
  | "sports"
  | "technology";

export type SortOrder = "publishedAt" | "relevancy" | "popularity";

export interface SearchParams {
  query: string;
  country: string;
  category: NewsCategory;
  sortBy: SortOrder;
  page: number;
}

export type FetchStatus = "idle" | "loading" | "success" | "error";

export interface FetchState<T> {
  data: T | null;
  status: FetchStatus;
  error: string | null;
}

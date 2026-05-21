import { useCallback, useEffect, useRef, useState } from "react";
import type { Article, Country, FetchState, NewsCategory, SearchParams, SortOrder } from "../types";
import { fetchTopHeadlines, searchEverything } from "../services/newsService";
import { fetchSupportedCountries } from "../services/countriesService";
import { DEFAULT_SEARCH_PARAMS } from "../constants";
import { ApiError, TimeoutError } from "../utils/http";

function humanizeError(err: unknown): string {
  if (err instanceof TimeoutError) {
    return "The request timed out — the API might be slow. Try again.";
  }
  if (err instanceof ApiError) {
    if (err.code === "missingApiKey") return err.message;
    if (err.status === 401) return "Invalid API key. Check your .env file.";
    if (err.status === 429) return "Rate limit hit. Wait a moment before searching again.";
    if (err.status && err.status >= 500) return "NewsAPI is having issues. Try again shortly.";
    return err.message;
  }
  if (err instanceof TypeError && String(err).includes("fetch")) {
    return "Network error — check your internet connection.";
  }
  return "Something went wrong. Try again.";
}

// ---------------------------------------------------------------------------
// useCountries — fetches once, memoizes, survives re-renders
// ---------------------------------------------------------------------------
export function useCountries() {
  const [state, setState] = useState<FetchState<Country[]>>({
    data: null,
    status: "idle",
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    setState({ data: null, status: "loading", error: null });

    fetchSupportedCountries()
      .then((countries) => {
        if (!cancelled) setState({ data: countries, status: "success", error: null });
      })
      .catch((err) => {
        if (!cancelled) setState({ data: null, status: "error", error: humanizeError(err) });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

// ---------------------------------------------------------------------------
// useNews — drives the main feed
// ---------------------------------------------------------------------------
export interface UseNewsReturn {
  articles: Article[];
  totalResults: number;
  status: FetchState<Article[]>["status"];
  error: string | null;
  params: SearchParams;
  setQuery: (q: string) => void;
  setCountry: (c: string) => void;
  setCategory: (c: NewsCategory) => void;
  setSortBy: (s: SortOrder) => void;
  setPage: (p: number) => void;
  retry: () => void;
}

export function useNews(): UseNewsReturn {
  const [params, setParams] = useState<SearchParams>(DEFAULT_SEARCH_PARAMS);
  const [state, setState] = useState<FetchState<{ articles: Article[]; totalResults: number }>>({
    data: null,
    status: "idle",
    error: null,
  });

  // Track the latest request so stale responses don't clobber fresh ones
  const requestIdRef = useRef(0);

  const doFetch = useCallback(async (p: SearchParams) => {
    const thisRequestId = ++requestIdRef.current;
    setState((prev) => ({ ...prev, status: "loading", error: null }));

    try {
      const result = p.query
        ? await searchEverything({ query: p.query, sortBy: p.sortBy, page: p.page })
        : await fetchTopHeadlines({
            country: p.country,
            category: p.category,
            query: p.query,
            page: p.page,
          });

      if (thisRequestId === requestIdRef.current) {
        setState({ data: result, status: "success", error: null });
      }
    } catch (err) {
      if (thisRequestId === requestIdRef.current) {
        setState({ data: null, status: "error", error: humanizeError(err) });
      }
    }
  }, []);

  useEffect(() => {
    doFetch(params);
  }, [params, doFetch]);

  const setQuery = useCallback((query: string) => {
    setParams((p) => ({ ...p, query, page: 1 }));
  }, []);

  const setCountry = useCallback((country: string) => {
    setParams((p) => ({ ...p, country, page: 1 }));
  }, []);

  const setCategory = useCallback((category: NewsCategory) => {
    setParams((p) => ({ ...p, category, page: 1 }));
  }, []);

  const setSortBy = useCallback((sortBy: SortOrder) => {
    setParams((p) => ({ ...p, sortBy, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setParams((p) => ({ ...p, page }));
  }, []);

  const retry = useCallback(() => {
    doFetch(params);
  }, [doFetch, params]);

  return {
    articles: state.data?.articles ?? [],
    totalResults: state.data?.totalResults ?? 0,
    status: state.status,
    error: state.error,
    params,
    setQuery,
    setCountry,
    setCategory,
    setSortBy,
    setPage,
    retry,
  };
}

// ---------------------------------------------------------------------------
// useDebounce — for deferring search input
// ---------------------------------------------------------------------------
export function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

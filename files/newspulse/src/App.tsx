import { LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import { ArticleCard } from "./components/ArticleCard";
import { CategoryFilter } from "./components/CategoryFilter";
import { CountryInfo } from "./components/CountryInfo";
import { CountrySelector } from "./components/CountrySelector";
import { EmptyState } from "./components/EmptyState";
import { ErrorState } from "./components/ErrorState";
import { Header } from "./components/Header";
import { Pagination } from "./components/Pagination";
import { SearchBar } from "./components/SearchBar";
import { SkeletonGrid } from "./components/SkeletonCard";
import { SortSelect } from "./components/SortSelect";
import { useCountries, useNews } from "./hooks";

type Layout = "grid" | "list";

export default function App() {
  const [layout, setLayout] = useState<Layout>("grid");

  const countriesState = useCountries();
  const news = useNews();

  const selectedCountry = countriesState.data?.find((c) => c.code === news.params.country);
  const isLoading = news.status === "loading";
  const hasQuery = news.params.query.length > 0;

  // When user is using keyword search, don't show country/category controls
  // because /everything endpoint doesn't support them — would confuse users.
  const showCountryControls = !hasQuery;

  const resultCount = Math.min(news.totalResults, 100);

  return (
    <div className="app">
      <Header />

      <main className="app__main">
        {/* ── Controls row ── */}
        <div className="controls">
          <SearchBar onSearch={news.setQuery} />

          <div className="controls__right">
            {showCountryControls && (
              <CountrySelector
                countries={countriesState.data ?? []}
                selected={news.params.country}
                onChange={news.setCountry}
                disabled={countriesState.status === "loading" || isLoading}
              />
            )}

            <SortSelect
              value={news.params.sortBy}
              onChange={news.setSortBy}
              disabled={isLoading}
              visible={hasQuery}
            />

            <div className="layout-toggle" role="group" aria-label="Layout view">
              <button
                className={`layout-toggle__btn ${layout === "grid" ? "layout-toggle__btn--active" : ""}`}
                onClick={() => setLayout("grid")}
                aria-label="Grid view"
                aria-pressed={layout === "grid"}
                type="button"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                className={`layout-toggle__btn ${layout === "list" ? "layout-toggle__btn--active" : ""}`}
                onClick={() => setLayout("list")}
                aria-label="List view"
                aria-pressed={layout === "list"}
                type="button"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Category filter (only for headlines, not search) ── */}
        {showCountryControls && (
          <CategoryFilter
            selected={news.params.category}
            onChange={news.setCategory}
            disabled={isLoading}
          />
        )}

        {/* ── Content area ── */}
        <div className="content-layout">
          <section className="content-layout__feed">
            {/* Results summary */}
            {news.status === "success" && news.articles.length > 0 && (
              <p className="results-summary">
                {hasQuery ? (
                  <>
                    About <strong>{resultCount.toLocaleString()}</strong> results for{" "}
                    <em>"{news.params.query}"</em>
                  </>
                ) : (
                  <>
                    <strong>{news.params.category}</strong> headlines ·{" "}
                    {selectedCountry?.name ?? news.params.country.toUpperCase()}
                  </>
                )}
              </p>
            )}

            {/* Loading state */}
            {isLoading && <SkeletonGrid />}

            {/* Error state */}
            {news.status === "error" && news.error && (
              <ErrorState message={news.error} onRetry={news.retry} />
            )}

            {/* Empty state */}
            {news.status === "success" && news.articles.length === 0 && (
              <EmptyState
                query={news.params.query}
                onClear={() => news.setQuery("")}
              />
            )}

            {/* Articles */}
            {news.status === "success" && news.articles.length > 0 && (
              <>
                <div className={layout === "grid" ? "article-grid" : "article-list"}>
                  {news.articles.map((article) => (
                    <ArticleCard key={article.id} article={article} layout={layout} />
                  ))}
                </div>

                <Pagination
                  currentPage={news.params.page}
                  totalResults={news.totalResults}
                  onPageChange={news.setPage}
                  disabled={isLoading}
                />
              </>
            )}
          </section>

          {/* ── Country sidebar ── */}
          {showCountryControls && selectedCountry && (
            <CountryInfo country={selectedCountry} />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Powered by{" "}
          <a href="https://newsapi.org" target="_blank" rel="noopener noreferrer">
            NewsAPI
          </a>{" "}
          &amp;{" "}
          <a href="https://restcountries.com" target="_blank" rel="noopener noreferrer">
            REST Countries
          </a>
        </p>
      </footer>
    </div>
  );
}

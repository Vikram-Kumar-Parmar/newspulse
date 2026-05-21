# Git Commit History

This is the realistic commit progression for the project.
To recreate it from scratch, make commits at each stage.

---

```
git log --oneline (most recent last, chronological)

a1b2c3d  init: scaffold vite + react + typescript project
e4f5g6h  config: add eslint, prettier, and tsconfig paths
i7j8k9l  types: define Article, Country, SearchParams interfaces
m0n1o2p  constants: extract api urls, supported country codes, category list
q3r4s5t  utils: add hashString, truncate, formatRelativeTime helpers
u6v7w8x  utils: implement sanitizeQuery with length cap and char stripping
y9z0a1b  utils/http: add fetchWithTimeout using AbortController
c2d3e4f  utils/http: add fetchWithRetry with exponential backoff (skips retry on 4xx)
g5h6i7j  utils/cache: implement in-memory TTL cache singleton
k8l9m0n  services: add newsService with fetchTopHeadlines and normalizeArticle
o1p2q3r  services: guard against [Removed] tombstone articles in normalization
s4t5u6v  services: add searchEverything for /everything endpoint
w7x8y9z  services: add countriesService filtered to newsapi-supported codes
a0b1c2d  hooks: implement useCountries with loading/error state
e3f4g5h  hooks: implement useNews with requestIdRef race condition guard
i6j7k8l  hooks: add useDebounce for search input deferral
m9n0o1p  components: ArticleCard with grid and list layout variants
q2r3s4t  components: SearchBar with debounce and clear button
u5v6w7x  components: CountrySelector dropdown with flag images and search filter
y8z9a0b  components: CategoryFilter tab strip
c1d2e3f  components: SortSelect (only visible during keyword search mode)
g4h5i6j  components: SkeletonCard and SkeletonGrid for loading state
k7l8m9n  components: ErrorState with retry action
o0p1q2r  components: EmptyState with context-aware messaging
s3t4u5v  components: Pagination with ellipsis and NewsAPI 100-result cap
w6x7y8z  components: CountryInfo sidebar pulling from REST Countries data
a9b0c1d  components: Header with brand and tagline
e2f3g4h  app: wire all components into App layout with two-column grid
i5j6k7l  styles: editorial newspaper aesthetic — Playfair Display + IBM Plex
m8n9o0p  styles: responsive breakpoints, list layout, skeleton pulse animation
q1r2s3t  test: utils unit tests — sanitizeQuery, truncate, hashString, clamp
u4v5w6x  test: cache TTL expiry and invalidation tests
y7z8a9b  test: fetchWithRetry — timeout, 4xx no-retry, 5xx retry with mocked fetch
c0d1e2f  fix: clamp pagination ellipsis to avoid duplicate page numbers near edges
g3h4i5j  fix: collapse sort controls when in top-headlines mode (country search)
k6l7m8n  docs: write README with architecture overview and troubleshooting
o9p0q1r  docs: complete ANSWERS.md for all 5 assessment questions
```

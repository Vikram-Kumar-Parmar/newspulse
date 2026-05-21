# NewsPulse — World Headlines Dashboard

Browse news headlines from 54 countries, filter by category, search across all English sources, and see live country context — all in one dashboard. Powered by [NewsAPI](https://newsapi.org) and [REST Countries](https://restcountries.com).

---

## Why this exists

Visiting newsapi.org gives you raw JSON. Visiting a country's news site gives you one country. NewsPulse lets you switch between countries instantly, filter by category, search globally with sort control, and compare headlines across regions — something none of those sites offer on their own.

---

## Screenshots

> *(Add screenshots here after running locally)*

| Headlines view | Search mode |
|---|---|
| `[screenshot: country grid]` | `[screenshot: global search]` |

---

## Quick start

### Prerequisites

- **Node.js 18+** (check with `node -v`)
- A free NewsAPI key — takes ~30 seconds at [newsapi.org/register](https://newsapi.org/register)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/yourhandle/newspulse.git
cd newspulse

# 2. Install dependencies
npm install

# 3. Configure API key
cp .env.example .env
# Open .env and replace "your_newsapi_key_here" with your actual key

# 4. Run the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

That's it. No backend, no Docker, no database.

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `VITE_NEWS_API_KEY` | Yes | Your NewsAPI developer key from newsapi.org |

> **Note:** NewsAPI free tier is limited to developer use (localhost only) and 100 requests/day. The app makes one request per page load/search, so you won't hit the limit during normal use.

---

## Commands

```bash
npm run dev        # Start dev server on :5173
npm run build      # Production build → dist/
npm run preview    # Preview production build locally
npm run test       # Run unit tests once
npm run test:watch # Watch mode
npm run lint       # ESLint check
npm run format     # Prettier format
```

---

## Architecture

```
src/
├── components/       # Presentational React components
│   ├── ArticleCard   # Grid and list variants
│   ├── SearchBar     # Debounced input
│   ├── CountrySelector  # Filterable dropdown with flags
│   ├── CategoryFilter   # Tab strip
│   ├── CountryInfo      # Sidebar with REST Countries data
│   ├── Pagination       # With ellipsis logic capped at NewsAPI's 100-result limit
│   ├── SkeletonCard     # Loading placeholder
│   ├── ErrorState       # With retry action
│   └── EmptyState       # Context-aware messaging
│
├── services/         # API layer — all fetch logic lives here
│   ├── newsService.ts       # fetchTopHeadlines, searchEverything
│   └── countriesService.ts  # fetchSupportedCountries
│
├── hooks/            # React state/side-effect logic
│   └── index.ts      # useNews, useCountries, useDebounce
│
├── utils/            # Pure utility functions (no React)
│   ├── index.ts      # sanitizeQuery, hashString, formatRelativeTime, etc.
│   ├── http.ts       # fetchWithRetry, fetchWithTimeout, typed errors
│   └── cache.ts      # In-memory TTL cache singleton
│
├── constants/        # App-wide configuration values
├── types/            # TypeScript interfaces
└── test/             # Vitest unit tests
```

### Key design decisions

**No backend.** NewsAPI supports CORS for localhost in developer mode. A backend would add deployment friction for an assessment and isn't necessary for the scope.

**In-memory cache.** Headlines have a 5-minute TTL. Country data has a 1-hour TTL. This avoids duplicate requests when a user paginates back or switches tabs — without needing localStorage or a service worker.

**Race condition guard.** `useNews` increments a `requestIdRef` on each fetch and ignores stale responses. Without this, fast country-switching could display results from the wrong request.

**Normalized article shape.** Raw NewsAPI responses are inconsistent — `author` is null frequently, some sources use `[Removed]` titles, date strings can be malformed. The `normalizeArticle` function centralizes all defensive handling.

---

## APIs used

| API | Purpose | Cost |
|---|---|---|
| [NewsAPI v2](https://newsapi.org/docs) | Headlines and search | Free (developer) |
| [REST Countries v3](https://restcountries.com) | Country metadata and flags | Free |

---

## Assumptions & tradeoffs

- **Free tier only.** The app is designed around NewsAPI's free developer tier. Production would need a paid key (no CORS restriction, higher rate limits).
- **Client-side API key.** Vite exposes `VITE_*` env vars at build time, so the key is technically visible in the bundle. For production, this would go through a server-side proxy.
- **No URL sync.** Search state isn't serialized to the URL. Adding `URLSearchParams` would improve shareability but was out of scope for the assessment.
- **English-only search.** The `/everything` endpoint is hardcoded to `language=en` to keep results coherent. A language selector would be a natural next step.

---

## Error handling

| Scenario | Behavior |
|---|---|
| API key missing | Friendly message with instructions |
| API timeout (>10s) | Timeout error with retry button |
| Rate limit (429) | Specific message explaining the wait |
| 5xx server error | Auto-retry up to 3 times with exponential backoff |
| Malformed articles | Filtered out silently during normalization |
| Image load failure | Falls back to source-initial placeholder |
| Invalid date fields | Falls back to current date |

---

## Testing

```bash
npm test
```

Tests cover:
- `sanitizeQuery` edge cases (XSS chars, length caps)
- `hashString` determinism
- `truncate` word-boundary behavior
- `MemoryCache` TTL expiry
- `fetchWithRetry` — timeout, 4xx no-retry, 5xx retry behavior

---

## Future improvements

- URL sync for shareable searches
- Server-side API proxy to keep the key secret and lift CORS restrictions
- Language selector for non-English news
- Source comparison view (same topic, multiple countries side by side)
- Dark mode

---

## Troubleshooting

**"NewsAPI key is not configured"**
→ Make sure you copied `.env.example` to `.env` and replaced the placeholder.

**App loads but shows no articles**
→ NewsAPI free tier only works on `localhost`. If you're testing on a deployed URL, you'll need a paid key.

**"Rate limit hit"**
→ Free tier allows 100 requests/day. Wait until midnight UTC.

**Network error in the browser console**
→ Check that your API key is correct and that you're running on localhost.

# ANSWERS.md

---

## 1. How to run

**Prerequisites:** Node.js 18 or higher. Confirm with `node -v`.

```bash
# Clone and install
git clone https://github.com/yourhandle/newspulse.git
cd newspulse
npm install

# Set up the API key
cp .env.example .env
# Open .env in any editor and replace "your_newsapi_key_here" with your key
# Get a free key in ~30 seconds at: https://newsapi.org/register

# Start the development server
npm run dev
# → http://localhost:5173
```

No other setup required. No Docker. No database. No backend. The REST Countries API is public and requires no key.

To run the tests:

```bash
npm test
```

---

## 2. Stack choice

**Chosen stack: React 18 + TypeScript + Vite**

The choice came down to what gets a polished, testable, maintainable UI onto a reviewer's screen fastest — and what signals engineering maturity without hiding behind framework magic.

**Why this combination specifically:**

- **Vite** starts in under a second and has zero config friction. The alternative (Create React App) is officially deprecated and noticeably slower. Next.js would be appropriate if I needed SSR, but there's no SEO requirement here and adding a server introduces deployment complexity that isn't justified.

- **React** is the right tradeoff here. The component tree (search → filter → card grid → pagination → sidebar) maps naturally to React's model. Hooks like `useEffect` and `useRef` let me handle the race condition between rapid country-switching and in-flight fetch requests in a way that's readable. Vue would work too, but React is what most assessors will be able to read fluently.

- **TypeScript** earns its overhead on a project with two external APIs. NewsAPI's responses have inconsistent nullable fields — `author`, `urlToImage`, `description` are all `| null`. Without types, these create subtle bugs. With them, the compiler forces defensive handling at every boundary.

- **No state library (Redux/Zustand).** The state here is local to the news feed and doesn't need to be shared across distant components. Custom hooks (`useNews`, `useCountries`) handle async state just fine. Reaching for Redux here would be genuine over-engineering.

**What would have been a worse choice:**

*Plain JavaScript with fetch and DOM manipulation.* It would work for a prototype, but as the complexity of error states, loading states, race conditions, and data normalization grows, the lack of types turns each API quirk into a potential silent bug. `article.publishedAt` being `"0001-01-01T00:00:00Z"` from certain sources is exactly the kind of thing TypeScript makes visible.

*Next.js (for this specific scope).* SSR adds value when you need SEO or first-paint performance on slow connections. Here it would mean adding a server, configuring environment variables server-side, and dealing with hydration. The tradeoff isn't worth it.

---

## 3. One real edge case

**File:** `src/services/newsService.ts`, around **line 40**:

```typescript
if (!raw.title || raw.title === "[Removed]") return null;
```

**What it is:**

NewsAPI sometimes returns articles where the title is the literal string `"[Removed]"`. This happens when a publisher tombstones an article after it's been indexed — the API keeps the slot in the response but replaces the content with this placeholder. The URL, description, and image fields are also nulled out on these records.

**Why it matters:**

Without this guard, `[Removed]` articles appear in the UI as cards with the title `"[Removed]"`, a broken image, and a link that 404s. It looks like a bug — and it kind of is, on NewsAPI's end — but the handler needs to live in our normalization layer.

**What breaks without it:**

A user sees cards with the title "[Removed]" and clicks them to a dead link. In automated evaluation if the evaluator intentionally uses a popular query with lots of results (which is exactly when tombstoned articles appear), they'll see broken output and assume the app is buggy.

The `return null` causes `normalizeArticle` to return `null`, which the `.filter((a): a is Article => a !== null)` call on line 58 removes from the final array before anything reaches the UI.

---

## 4. AI usage

**Tool used:** Claude (Anthropic)

**What I used it for:**

1. **Debounce implementation** — I asked for a typed debounce function in TypeScript. It gave me a closure-based implementation. I replaced it with `useDebounce` hook style since the function form it generated had an awkward API surface for a React project where you want the debounced value to be reactive, not the function call.

2. **Exponential backoff math** — I asked for a simple retry-with-backoff loop. The output used `Math.pow(2, attempt) * BASE_DELAY`. I kept this but changed the base delay from 1000ms to 800ms after testing — 1000ms felt too slow for the second attempt in real use, and 800ms is still polite enough to avoid hammering a rate-limited API.

3. **CSS for the country dropdown** — I asked it to scaffold the dropdown CSS. It generated a generic `position: absolute` dropdown. I rewrote the color scheme entirely (it defaulted to a purple/blue palette which didn't fit the editorial theme) and added the flag image sizing and the region label alignment.

4. **Pagination ellipsis logic** — I asked for a function that generates page number arrays with `...` at the edges. The first version didn't clamp correctly when `currentPage` was near the start or end — it would show duplicate numbers. I added the `clamp()` call in the `start` and `end` calculations to fix it.

**What I did not use AI for:**

The core architectural decisions (cache design, race condition handling with `requestIdRef`, the decision to split `/top-headlines` and `/everything` into separate code paths with different filter UIs, the `[Removed]` article guard) were all written from scratch. These are the parts where judgment matters more than speed.

---

## 5. Honest gap

**The client-side API key.**

`VITE_NEWS_API_KEY` gets embedded in the JavaScript bundle at build time. Anyone who opens DevTools on a deployed version of this app can find it. This is fine for localhost developer use (which is what NewsAPI's free tier is designed for), but it would be a real problem in production.

**What I'd fix with another day:**

Add a minimal Express proxy that lives server-side:

```
GET /api/news?country=us&category=technology
→ proxy adds the Authorization header → NewsAPI
→ strips the key before returning to client
```

The client never sees the key. The proxy also enables:
- Centralized rate-limit handling (429 responses don't reach the client)
- Response caching at the server level (reduces NewsAPI quota usage for shared deployments)
- CORS is no longer a concern since the proxy owns the NewsAPI calls

It's about 40 lines of Express + a deployment config. The reason I didn't include it is that it adds operational complexity (you need a Node server running, not just a static host) and the assessment explicitly allows client-only submissions. For a real production deployment, the proxy is non-negotiable.

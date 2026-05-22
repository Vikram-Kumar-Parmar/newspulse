# 1. How to run

Install Node.js 20+, extract the project, run npm install and npm run dev.

# 2. Stack choice

React + TypeScript + Vite was chosen because it offers fast iteration, strict typing, strong Vercel compatibility, and clean reviewer ergonomics.

# 3. Real edge case

File: src/utils/fetcher.ts

The timeout abort logic prevents indefinitely hanging API requests. Without it, a slow npm endpoint could freeze the UI loading state permanently.

# 4. AI usage

AI assistance was used for architectural brainstorming and documentation drafting. Final implementation details, error handling structure, naming decisions, and project organization were manually refined.

# 5. Honest gap

A production backend caching layer was intentionally skipped to keep deployment simple for the assessment scope. Another day would add edge caching and analytics persistence.

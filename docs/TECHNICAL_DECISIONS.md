# Technical Decisions

Decisions we made during implementation 

## Next.js-only backend (no Express)

**Decision:** Use Next.js App Router for both UI and API. Business logic lives in `server/lib/`; HTTP endpoints are Next.js Route Handlers under `app/api/`. Do not run a separate Express server.

**Why:**

- One dev command (`npm run dev`) — no second terminal or CORS setup.
- Server Components can import `server/lib/` directly for reads (no HTTP round-trip).
- Client mutations (RSVP, nudge) use same-origin `/api/*` routes.
- RSVP/nudge state persists in `server/.demo-state.json` between restarts.

## Mock backend (Next.js + JSON) instead of Supabase

**Decision:** Use Next.js Route Handlers and `server/lib/` modules that read JSON files from `data/`. Do not deploy to Supabase or use a hosted database for this hackathon.

**Why:**

- The hackathon dataset is already flat JSON — no migration or schema setup needed.
- We can ship demo features faster without accounts, env vars, migrations, or deployment.
- The dataset is small and read-only; in-memory lookups are enough for the demo.
- One dev process (`npm run dev`) handles both UI and API — no CORS or second server.

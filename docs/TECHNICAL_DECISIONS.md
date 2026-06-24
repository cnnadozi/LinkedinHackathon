# Technical Decisions

Decisions we made during implementation 

## Fixed main user (`user_5736` — Alice Johnson)

**Decision:** The demo has exactly one logged-in member, exported as `MAIN_USER_ID` (`user_5736`, Alice Johnson). All server defaults, UI filters, RSVP/nudge state, and **Also attending** overlap logic assume this user.

**Why:**

- Hackathon judges and testers need a consistent “you” across pages — not a different random user per visit.
- Alice already has realistic `attending_event_ids` (3 events) so the **Attending** feed filter and attendee overlap UI work out of the box.
- A single constant (`lib/mainUser.ts`, `server/lib/data.js`) avoids scattering magic user IDs through components and API handlers.
- `DEMO_USER_ID` remains as a backward-compatible alias; new code should prefer `MAIN_USER_ID`.

**Override:** Set `MAIN_USER_ID` in the environment if you need a different demo profile without editing source.

**Do not** change the main user ID without updating `data/user_data.json` attendance, tests under `tests/lib/mainUser.test.ts`, and docs in [APP_MAP.md](./APP_MAP.md).

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

# Architecture

Overview of the tech stack, project layout, and data layer for LinkedIn Gather. Everything runs **locally** — no deployment planned for the hackathon.

## Tech stack

### Frontend

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | **React.js** | UI components and client-side logic |
| Language | **JavaScript / TypeScript** | TypeScript preferred for data models, API responses, and shared types |

### Routing

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | **Next.js** | App Router — pages, UI, and API route handlers |

### Backend

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | **Next.js Route Handlers** | `/api/*` in `app/api/` |
| Business logic | **`server/lib/`** | Loads JSON, derives attendees, RSVP/nudge state |
| Data source | **Local JSON** | Reads from the `data/` folder — no hosted database |
| Approach | **Next.js + JSON** | Mock backend that loads and filters dataset files |

The starter datasets live in `data/`. Server Components import `server/lib/` directly for reads; client mutations call `/api/*` route handlers. No external DB or auth required for the hackathon build.

### Local development

One process runs during development:

| Service | Default URL | Command |
|---------|-------------|---------|
| Next.js (UI + API) | `http://localhost:3000` | `npm run dev` |

Server Components read from `server/lib/` without HTTP. Browser `fetch()` calls same-origin `/api/*` routes — no CORS setup needed.

### Possible directions later

- **Supabase (Postgres)** — hosted DB if the team outgrows local JSON files
- **Prisma + SQLite** — add a real ORM layer if queries get complex

---

## Project layout

```
LinkedinHackathon/
├── app/                    # Next.js App Router (pages, layout, API routes)
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Redirects to /events
│   ├── events/             # Events feed and detail pages
│   ├── gather/             # Full-page calendar view
│   ├── api/                # Route handlers (/api/*)
│   │   ├── health/
│   │   └── events/[id]/    # RSVP + AI suggestions
│   └── globals.css         # Global CSS
├── components/             # Shared React components
│   └── linkedin/           # Reusable LinkedIn-style UI primitives
├── data/                   # Local JSON datasets
├── docs/                   # Project documentation
├── lib/                    # Client helpers + .server.ts (Gemini, ranking, dates)
├── prompts/                # Gemini prompt templates
├── public/events/          # Event cover images
├── scripts/                # One-off data prep (add-user-connections.js)
├── server/lib/             # Data loaders, events, RSVP state, suggestions
├── tests/                  # Vitest unit tests (mirrors source paths)
├── types/                  # TypeScript types (event.ts + JSON schema mirrors)
├── next.config.ts
├── tsconfig.json
└── package.json
```

### Folder responsibilities

| Path | Purpose |
|------|---------|
| `app/` | Next.js routes, pages, and `/api/*` route handlers. |
| `components/` | Reusable React components shared across pages. |
| `data/` | Static JSON datasets loaded by `server/lib/` at startup. |
| `docs/` | Architecture and UI design docs (`ARCHITECTURE.md`, `UI_DESIGN.md`). |
| `lib/` | Shared helpers — date formatting, Gemini client, event ranking, client API fetch. |
| `server/lib/` | Backend business logic shared by route handlers and Server Components. |
| `types/` | TypeScript models mirroring the JSON schemas. Import from `@/types` or specific files like `@/types/user`. |

---

## Data layer

How data is stored, linked, and served for LinkedIn Gather.

There is **no hosted database**. The “DB” is flat JSON in `data/`, loaded into memory at startup. Server Components import `server/lib/` directly; client code uses same-origin `/api/*` route handlers.

Base datasets come from [pit.najera.cc](https://pit.najera.cc/) (Possibilities in Tech · Hackathon 2026). Events were added locally for this project.

TypeScript models live in `types/` and mirror the JSON shapes.

### Storage overview

```
data/                          ← source of truth (JSON files)
  user_data.json
  jobs_data.json
  course_data.json
  events_data.json

server/lib/                    ← loads JSON, derived data, persisted RSVP state
app/api/                       ← Next.js route handlers (/api/*)
types/*.ts                     ← shared TypeScript types
```

| File | Records | Role in Gather |
|------|---------|----------------|
| `events_data.json` | 100 | **Primary** — event feed, calendar, detail pages |
| `user_data.json` | ~1,800 | Attendees, hosts, connections, AI panel context |
| `jobs_data.json` | 1,000 | Resolve member headlines, company, industry, title filters |
| `course_data.json` | 600 | Optional — skills / learning context |

Each file is a **flat JSON array**. Cross-entity links use string IDs, not nested objects.

| Source | Location |
|--------|----------|
| Hackathon dataset | `data/user_data.json`, `data/jobs_data.json`, `data/course_data.json`, `data/events_data.json` |
| Original source | [pit.najera.cc](https://pit.najera.cc/) |

### Schemas

#### Events (`events_data.json`) — primary entity

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | e.g. `"event_0001"` |
| `name` | string | Event title |
| `location` | string | City/region — used for localized discovery |
| `time` | string | ISO 8601 datetime (Apr–Sep 2026) |
| `description` | string | Event summary |
| `host_user_id` | string | → `user_data.json` |
| `industry` | string | From host’s most recent job |
| `company` | string | From host’s most recent job |

Events do **not** include attendee lists in `events_data.json`. Attendee counts come from each member's `attending_event_ids`. RSVP state for the demo user is still runtime-only (see below).

#### Members (`user_data.json`)

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | e.g. `"user_4579"` |
| `name` | string | Display name |
| `profile_picture_url` | string | Pravatar URL seeded by `id` |
| `school_history` | object[] | `school_name`, `degree`, `graduation_year` |
| `job_history` | string[] | Job IDs → `jobs_data.json` |
| `current_location` | string | e.g. `"Boston, MA"` — attendee filter + local events |
| `posts_activity` | string[] | AI **Shared Themes** / talking points |
| `skills` | string[] | Attendee filters, AI themes |
| `courses` | string[] | Course IDs → `course_data.json` |
| `attending_event_ids` | string[] | Events this member attends. Edit in data or run `node scripts/add-user-connections.js` |

#### Jobs (`jobs_data.json`)

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | e.g. `"job_550126"` |
| `company` | string | Attendee filter |
| `location` | string | |
| `position` | string | Role title — attendee filter |
| `salary_range` | object | `{ "from", "to" }` as USD strings |
| `industry` | string | Attendee filter |
| `level` | string | Seniority |
| `easy_apply` | boolean | |
| `description` | string | |

#### Courses (`course_data.json`)

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | e.g. `"course_1555"` |
| `name` | string | |
| `category` | string | |
| `skills` | string[] | |
| `length` | object | `{ "value", "unit" }` |
| `level` | string | Easy, Medium, Hard |

### Linking entities

```
event.host_user_id     →  user (host)
user.job_history[]     →  job (headline, company, industry)
user.courses[]         →  course
event.location         ↔  user.current_location   (attendee matching heuristic)
event.industry         ↔  job.industry            (attendee matching heuristic)
```

Build lookup maps once at server startup:

```javascript
const userById = Object.fromEntries(users.map((u) => [u.id, u]));
const jobById = Object.fromEntries(jobs.map((j) => [j.id, j]));

function resolveMemberJobs(member) {
  return member.job_history.map((id) => jobById[id]).filter(Boolean);
}

function latestJob(member) {
  const resolved = resolveMemberJobs(member);
  return resolved[resolved.length - 1] ?? null;
}
```

### Main user

The hackathon demo simulates a single logged-in LinkedIn member. **All “current user” behavior uses one fixed profile** — not a random or session-based user.

| | |
|--|--|
| **ID** | `user_5736` |
| **Name** | Alice Johnson |
| **Constants** | `MAIN_USER_ID` in `lib/mainUser.ts` and `server/lib/data.js` |
| **Env override** | `MAIN_USER_ID=user_XXXX` |

Alice’s `attending_event_ids` in `user_data.json` are the source of truth for guest lists, the **Attending** feed filter, and **Also attending** overlap. See `user_5736` in that file for the current list.

**Server helpers:** `getMainUser()`, `getMainUserAttendingEventIds()` in `server/lib/data.js`.

**Consumers:** `server/lib/events.js` (RSVP, attendees, mutual **Also attending** overlap), events feed **Attending** filter, calendar RSVPs, nudge/connection logic, nav avatar (`lib/profilePicture.ts`).

Do not change the main user casually — tests, attendee overlap, and the attending filter all assume `user_5736`.

### Derived / runtime data (not in JSON)

The UI needs data that does not exist in the starter files. The backend layer **generates or holds this** for the demo:

| Concept | Purpose | Suggested approach |
|---------|---------|-------------------|
| **Main user** | Fixed logged-in member for the whole demo | **`user_5736` (Alice Johnson)** — see [Main user](#main-user). Export `MAIN_USER_ID`; optional env override |
| **Event attendees** | Guest list modal | Users whose `attending_event_ids` includes the event; always include `host_user_id` |
| **Connection subset** | “Your connections”, “, X connections” | Derived from `connections` arrays in `user_data.json` relative to main user |
| **Connection degree** | 1st / 2nd / 3rd badge | Computed via `getConnectionDegree()` in `server/lib/data.js` |
| **RSVPs** | Calendar + “going” state | Persisted in `server/.demo-state.json` for main user |
| **Nudge state** | “Nudged ✓” | Persisted in `server/.demo-state.json` |
| **Mutual events** | Attendee modal **Also attending** + AI panel | Overlap of `attending_event_ids` between main user and attendee |
| **AI suggestions** | Talking points in Nudge chat | Gemini API with heuristic fallback (`lib/nudgeSuggestions.server.ts`) |

Keep derived logic in `server/lib/` so the frontend stays thin. RSVP and nudge state are written to `server/.demo-state.json`.

### Feature → data mapping

| UI feature | Data sources |
|------------|--------------|
| Events feed (`/events`) | `events_data.json` — **Attending** filter uses main user’s `attending_event_ids` |
| Event detail | Event + host user + resolved host job; RSVP/nudge relative to main user |
| Attendee modal | Users in `attending_event_ids` for the event; **Also attending** = overlap with main user’s events |
| Calendar overlay | `server/lib/data.js` + `server/lib/events.js` — main user’s RSVP’d events |
| AI connection panel | `POST /api/events/:id/suggestions` — talking points via Gemini + heuristic fallback |

### Loading data

#### Local (default)

`server/lib/` reads from `data/` at startup — no network or API keys.

#### Remote refresh (optional)

```bash
curl https://pit.najera.cc/user_data.json   -o data/user_data.json
curl https://pit.najera.cc/jobs_data.json   -o data/jobs_data.json
curl https://pit.najera.cc/course_data.json -o data/course_data.json
```

`events_data.json` is project-specific; not hosted on pit.najera.cc.

### Snapshot (at download)

- **Members by location:** New York, Boston, San Francisco, Seattle, Austin (~385–416 each)
- **Job industries:** Education, Technology, Retail, Healthcare, Finance
- **Events:** 100 records, Apr–Sep 2026, tied to host locations and industries
- **Course categories:** Business, Cybersecurity, Marketing, HR, Communication, and more

---

## API (Next.js Route Handlers)

All endpoints live under `app/api/`. Server Components import `server/lib/` directly for reads; client code calls the mutation routes below.

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/health` | Status + record counts (users, jobs, courses, events) |
| POST | `/api/events/:id/rsvp` | Toggle RSVP for main user |
| POST | `/api/events/:id/suggestions` | AI talking points for nudge chat |

---

## Source

- Starter data: [https://pit.najera.cc/](https://pit.najera.cc/)
- Synthetic hackathon data — members, jobs, courses from PIT; events generated for this repo

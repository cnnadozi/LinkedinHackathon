# Database Description

How data is stored, linked, and served for the LinkedIn Events Hub hackathon build.

There is **no hosted database**. The “DB” is flat JSON in `data/`, loaded into memory by the Express server at startup. The Next.js frontend reads everything through REST endpoints on `http://localhost:3001`.

Base datasets come from [pit.najera.cc](https://pit.najera.cc/) (Possibilities in Tech · Hackathon 2026). Events were added locally for this project.

TypeScript models live in `types/` and mirror the JSON shapes.

---

## Storage overview

```
data/                          ← source of truth (JSON files)
  user_data.json
  jobs_data.json
  course_data.json
  events_data.json

server/index.js                ← loads JSON, exposes /api/*
types/*.ts                     ← shared TypeScript types
```

| File | Records | Role in Events Hub |
|------|---------|-------------------|
| `events_data.json` | 100 | **Primary** — event feed, calendar, detail pages |
| `user_data.json` | 2,000 | Attendees, hosts, connections, AI panel context |
| `jobs_data.json` | 1,000 | Resolve member headlines, company, industry, title filters |
| `course_data.json` | 600 | Optional — skills / learning context |

Each file is a **flat JSON array**. Cross-entity links use string IDs, not nested objects.

---

## Schemas

### Events (`events_data.json`) — primary entity

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

Events do **not** include attendee lists or RSVP state in the JSON. Those are derived at runtime (see below).

### Members (`user_data.json`)

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | e.g. `"user_4579"` |
| `name` | string | Display name |
| `school_history` | object[] | `school_name`, `degree`, `graduation_year` |
| `job_history` | string[] | Job IDs → `jobs_data.json` |
| `current_location` | string | e.g. `"Boston, MA"` — attendee filter + local events |
| `posts_activity` | string[] | AI **Shared Themes** / talking points |
| `skills` | string[] | Attendee filters, AI themes |
| `courses` | string[] | Course IDs → `course_data.json` |

### Jobs (`jobs_data.json`)

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

### Courses (`course_data.json`)

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | e.g. `"course_1555"` |
| `name` | string | |
| `category` | string | |
| `skills` | string[] | |
| `length` | object | `{ "value", "unit" }` |
| `level` | string | Easy, Medium, Hard |

---

## Linking entities

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

---

## Derived / runtime data (not in JSON)

The UI needs data that does not exist in the starter files. The Express layer (or client helpers) **generates or holds this in memory** for the demo:

| Concept | Purpose | Suggested approach |
|---------|---------|-------------------|
| **Current user** | Fixed “logged-in” member for connections / RSVPs | Pick one `user_*` ID as demo user (env or constant) |
| **Event attendees** | Guest list modal | Sample users by matching `event.location` / `event.industry`; always include `host_user_id` |
| **Connection subset** | “Your connections”, “, X connections” | Deterministic subset of attendees (e.g. hash of `userId + eventId`) |
| **Connection degree** | 1st / 2nd / 3rd badge | Mock: 1st = connection subset; others = remaining attendees |
| **RSVPs** | Calendar + “going” state | In-memory map `{ userId: eventId[] }` or JSON file added later |
| **Nudge state** | “Nudged ✓” | In-memory `Set` of `{ eventId, targetUserId }` |
| **Mutual events** | AI panel | Events where both current user and target appear in derived attendee sets (last 6 months) |
| **AI suggestions** | Talking points | Rule-based from `posts_activity`, `skills`, `school_history`, mutual events |

Keep derived logic in `server/` so the frontend stays thin. Persist to a new JSON file only if needed between restarts.

---

## Feature → data mapping

| UI feature | Data sources |
|------------|--------------|
| Events feed (`/`) | `events_data.json` — filter/sort by `time`, boost by `location` vs current user |
| Event detail | Event + host user + resolved host job |
| Attendee modal | Derived attendee list + resolved jobs for headline/company |
| Attendee filters | `latestJob(member).company`, `.position`, `.industry`, `member.current_location`, `school_history` |
| Calendar overlay | RSVP’d events for current user |
| AI connection panel | Both users’ `skills`, `posts_activity`, shared schools; mutual events from derived attendance |
| Messaging | Target user profile + mock thread (optional static copy) |

---

## API (Express)

### Implemented

| Method | Path | Returns |
|--------|------|---------|
| GET | `/api/health` | Status + record counts (users, jobs, courses) |
| GET | `/api/users` | All members |
| GET | `/api/users/:id` | Single member |
| GET | `/api/jobs` | All jobs |
| GET | `/api/jobs/:id` | Single job |
| GET | `/api/courses` | All courses |
| GET | `/api/courses/:id` | Single course |

### Planned (Events Hub)

| Method | Path | Returns |
|--------|------|---------|
| GET | `/api/events` | All events; query: `?location=`, `?industry=` |
| GET | `/api/events/:id` | Event + resolved host |
| GET | `/api/events/:id/attendees` | Derived attendee rows + filters via query params |
| POST | `/api/events/:id/rsvp` | Toggle RSVP for current user |
| POST | `/api/events/:id/nudge` | Record nudge to target user |
| GET | `/api/users/:id/suggestions` | Mock AI panel payload vs current user |

Update `/api/health` to include `events: events.length` when the events loader is added.

---

## Loading data

### Local (default)

Express reads from `data/` at startup — no network or API keys.

### Remote refresh (optional)

```bash
curl https://pit.najera.cc/user_data.json   -o data/user_data.json
curl https://pit.najera.cc/jobs_data.json   -o data/jobs_data.json
curl https://pit.najera.cc/course_data.json -o data/course_data.json
```

`events_data.json` is project-specific; not hosted on pit.najera.cc.

---

## Snapshot (at download)

- **Members by location:** New York, Boston, San Francisco, Seattle, Austin (~385–416 each)
- **Job industries:** Education, Technology, Retail, Healthcare, Finance
- **Events:** 100 records, Apr–Sep 2026, tied to host locations and industries
- **Course categories:** Business, Cybersecurity, Marketing, HR, Communication, and more

---

## Source

- Starter data: [https://pit.najera.cc/](https://pit.najera.cc/)
- Synthetic hackathon data — members, jobs, courses from PIT; events generated for this repo

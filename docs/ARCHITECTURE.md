# Architecture

Overview of the tech stack and project layout for this hackathon project. Everything runs **locally** — no deployment planned for the hackathon.

## Tech stack

### Frontend

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | **React.js** | UI components and client-side logic |
| Language | **JavaScript / TypeScript** | TypeScript preferred for data models, API responses, and shared types |

### Routing

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | **Next.js** | App Router — file-based routing and frontend shell only |

Next.js handles pages and UI. The API lives in a separate Express server (see Backend).

### Backend

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | **Express.js** | Standalone API server in `server/` |
| Data source | **Local JSON** | Reads from the `data/` folder — no hosted database |
| Approach | **Express + JSON** | Mock backend that loads and filters dataset files |

The starter datasets live in `data/` (see [DATASET_USAGE.md](./DATASET_USAGE.md)). Express reads those JSON files and exposes REST endpoints to the Next.js frontend. No external DB or auth required for the hackathon build.

### Local development

Two processes run during development:

| Service | Default URL | Command |
|---------|-------------|---------|
| Next.js (frontend) | `http://localhost:3000` | `npm run dev` |
| Express (API) | `http://localhost:3001` | `npm run dev:server` |

The frontend calls the Express API (e.g. `http://localhost:3001/api/jobs`). CORS is enabled on Express for browser requests from the Next.js origin.

### Possible directions later

- **Supabase (Postgres)** — hosted DB if the team outgrows local JSON files
- **Prisma + SQLite** — add a real ORM layer inside Express if queries get complex

### Data

| Source | Location |
|--------|----------|
| Hackathon dataset | `data/user_data.json`, `data/jobs_data.json`, `data/course_data.json` |
| Documentation | [DATASET_USAGE.md](./DATASET_USAGE.md) |
| Original source | [pit.najera.cc](https://pit.najera.cc/) |

---

## Project layout

```
LinkedinHackathon/
├── app/                    # Next.js App Router (pages, layout, global styles)
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global CSS
├── components/             # Shared React components
├── data/                   # Local JSON datasets
│   ├── user_data.json      # Member profiles
│   ├── jobs_data.json      # Job postings
│   └── course_data.json    # Learning courses
├── docs/                   # Project documentation
│   ├── ARCHITECTURE.md     # This file — tech stack + folder layout
│   └── DATASET_USAGE.md    # Dataset schemas and linking guide
├── server/                 # Express API (reads data/*.json)
│   └── index.js            # API entry point, routes, CORS
├── types/                  # TypeScript types (one file per domain)
│   ├── user.ts             # User, SchoolHistory
│   ├── job.ts              # Job, SalaryRange
│   ├── course.ts           # Course, CourseLength
│   └── index.ts            # Barrel re-exports
├── next.config.ts          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── eslint.config.mjs       # ESLint configuration
└── package.json            # Scripts and dependencies
```

### Folder responsibilities

| Path | Purpose |
|------|---------|
| `app/` | Next.js routes and page-level UI. Add new routes as folders/files under `app/`. |
| `components/` | Reusable React components shared across pages. |
| `data/` | Static JSON datasets loaded by the Express server at startup. |
| `docs/` | Architecture, dataset usage, and other project docs. |
| `server/` | Standalone Express API. All REST endpoints live here. |
| `types/` | TypeScript models mirroring the JSON schemas. Import from `@/types` or specific files like `@/types/user`. |

### API routes (Express)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Server status and dataset record counts |
| GET | `/api/users` | All members |
| GET | `/api/users/:id` | Single member by ID |
| GET | `/api/jobs` | All job postings |
| GET | `/api/jobs/:id` | Single job by ID |
| GET | `/api/courses` | All courses |
| GET | `/api/courses/:id` | Single course by ID |

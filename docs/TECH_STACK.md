# Tech Stack

Overview of the tools and architecture for this hackathon project. Everything runs **locally** — no deployment planned for the hackathon.

## Frontend

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | **React.js** | UI components and client-side logic |
| Language | **JavaScript / TypeScript** | TypeScript preferred where type safety helps (data models, API responses) |

## Routing

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | **Next.js** | File-based routing and frontend shell only |

Next.js handles pages and UI. The API lives in a separate Express server (see Backend).

## Backend

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | **Express.js** | Standalone API server |
| Data source | **Local JSON** | Reads from the `data/` folder — no hosted database |
| Approach | **Option B — Express + JSON** | Mock backend that loads and filters dataset files |

The starter datasets are already downloaded into `data/` (see [DATASET_USAGE.md](./DATASET_USAGE.md)). Express reads those JSON files and exposes REST endpoints to the Next.js frontend. No external DB or auth required for the hackathon build.

### Local development

Two processes run during development:

| Service | Default URL | Command (TBD on scaffold) |
|---------|-------------|---------------------------|
| Next.js (frontend) | `http://localhost:3000` | `npm run dev` |
| Express (API) | `http://localhost:3001` | `npm run dev:server` |

The frontend calls the Express API (e.g. `http://localhost:3001/api/jobs`). CORS must be enabled on Express for browser requests from the Next.js origin.

### Possible directions later

- **Supabase (Postgres)** — hosted DB if the team outgrows local JSON files
- **Prisma + SQLite** — add a real ORM layer inside Express if queries get complex

## Data

| Source | Location |
|--------|----------|
| Hackathon dataset | `data/user_data.json`, `data/jobs_data.json`, `data/course_data.json` |
| Documentation | [DATASET_USAGE.md](./DATASET_USAGE.md) |
| Original source | [pit.najera.cc](https://pit.najera.cc/) |

## Project structure (planned)

```
LinkedinHackathon/
├── data/                 # Local JSON datasets
├── docs/                 # Project documentation
│   ├── DATASET_USAGE.md
│   └── TECH_STACK.md
├── server/               # Express API (reads data/*.json)
├── app/ or pages/        # Next.js routes (TBD on scaffold)
├── components/           # React components (TBD)
└── ...
```

Structure will be finalized when the Next.js app and Express server are scaffolded.

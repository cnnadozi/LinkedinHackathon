# Tech Stack

Overview of the tools and architecture for this hackathon project.

## Frontend

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | **React.js** | UI components and client-side logic |
| Language | **JavaScript / TypeScript** | TypeScript preferred where type safety helps (data models, API responses) |

## Routing

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | **Next.js** | File-based routing, SSR/SSG options, and API routes if needed |

Next.js serves as both the frontend shell and a potential place to host lightweight server logic (e.g. API routes) without a separate backend service.

## Backend

| Layer | Choice | Notes |
|-------|--------|-------|
| Data layer | **Undecided** | May stay local for the hackathon |
| Current plan | **Mock backend** | Serve data from the local `data/` folder instead of a hosted database |

The starter datasets are already downloaded into `data/` (see [DATASET_USAGE.md](./DATASET_USAGE.md)). A mock backend can read those JSON files directly or expose them through Next.js API routes — no external DB or auth required for an initial build.

### Possible directions later

- **Next.js API routes** — read from `data/*.json` and return filtered JSON to the client
- **Supabase (Postgres)** — hosted DB with a real API if the team outgrows local files
- **Custom backend** — Express, FastAPI, etc., if requirements grow beyond what Next.js routes handle

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
├── app/ or pages/        # Next.js routes (TBD on scaffold)
├── components/           # React components (TBD)
└── ...
```

Structure will be finalized when the Next.js app is scaffolded.

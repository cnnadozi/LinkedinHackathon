# Technical Decisions

Decisions we made during implementation 

## Mock backend (Express + JSON) instead of Supabase

**Decision:** Use a local Express server that reads JSON files from `data/` and exposes REST endpoints. Do not deploy to Supabase or use a hosted database for this hackathon.

**Why:**

- The hackathon dataset is already flat JSON — no migration or schema setup needed.
- We can ship demo features faster without accounts, env vars, migrations, or deployment.
- The dataset is small and read-only; in-memory lookups are enough for the demo.

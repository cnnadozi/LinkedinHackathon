# Agent docs

Before making changes, read the docs in `docs/` for project context:

Make sure to update these documents regularly with new information.

| Doc | Purpose |
|-----|---------|
| [README.md](./README.md) | Project vision, hackathon context, and key features (1-click access, attendee insights, integrated calendar) for the LinkedIn Events Hub |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Tech stack, folder layout, data layer, schemas, Next.js API routes, and `server/lib/` |
| [docs/TECHNICAL_DECISIONS.md](./docs/TECHNICAL_DECISIONS.md) | Implementation decisions and rationale (not duplicated from ARCHITECTURE) |
| [docs/UI_DESIGN.md](./docs/UI_DESIGN.md) | Color tokens, typography, layout, and UI patterns. Read this before doing anything UI related |
| [docs/APP_MAP.md](./docs/APP_MAP.md) | **Start here** — all pages, overlays, components, and **main user** (`user_5736`) |

## Agent skills

Project skills live in `.cursor/skills/`. The agent should load and follow them when the task matches.

| Skill | When to use |
|-------|-------------|
| [ui-ux](.cursor/skills/ui-ux/SKILL.md) | **Before any UI work** — copy styles from live linkedin.com into `app/globals.css`; reuse `components/linkedin/` primitives |
| [unit-testing](.cursor/skills/unit-testing/SKILL.md) | **After every feature implementation** — write unit tests in `tests/` (mirror source paths), run `npm test`, and do not mark work complete until tests pass |

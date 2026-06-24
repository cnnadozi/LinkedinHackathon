---
name: unit-testing
description: >-
  Write and run unit tests for new or changed code in this Next.js + Express
  project. Use when implementing features, adding components, API routes,
  utilities, hooks, or bug fixes — and before marking any feature work complete.
---

# Unit Testing

**Mandatory after every feature implementation.** Do not consider feature work done until tests are written and `npm test` passes.

## Quick workflow

Copy this checklist and track progress:

```
Feature testing:
- [ ] Identify testable units (components, utils, route handlers)
- [ ] Add or update tests under `tests/` (mirror source paths)
- [ ] Run `npm test`
- [ ] Fix failures before finishing
```

## Test stack

| Layer | Tool |
|-------|------|
| Runner | [Vitest](https://vitest.dev/) |
| React | [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro/) |
| DOM | jsdom |
| API (when needed) | [supertest](https://github.com/ladjs/supertest) |

Commands:

```bash
npm test          # run once (CI-style)
npm run test:watch  # watch mode while developing
```

## File placement

All tests live in the top-level `tests/` directory, mirroring source paths:

```
components/linkedin/Button.tsx          → tests/components/linkedin/Button.test.tsx
lib/formatDate.ts                       → tests/lib/formatDate.test.ts
server/routes/users.js                  → tests/server/routes/users.test.js
```

Import source modules via the `@/` alias (e.g. `@/components/linkedin/Button`).

Naming: `*.test.ts`, `*.test.tsx`, or `*.spec.ts(x)`.

## What to test

### Always test

- Pure functions and utilities (input → output, edge cases)
- Component behavior users care about (render, click, form submit, conditional UI)
- API route handlers (status codes, JSON shape, 404 paths)
- Bug fixes — add a regression test that would have caught the bug

### Skip or defer

- Trivial one-liner wrappers with no logic
- Third-party library internals
- Visual pixel-perfect layout (use component behavior instead)
- Full E2E browser flows (out of scope for unit tests)

## Writing tests

### React components

- Import from `@testing-library/react` — prefer `screen.getByRole`, `getByText`, `getByLabelText`
- Test behavior, not implementation details (avoid asserting on internal state or class names unless that's the contract)
- Use `@testing-library/user-event` for interactions when available

```tsx
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/linkedin/Button";

it("renders label and calls onClick", async () => {
  const onClick = vi.fn();
  render(<Button onClick={onClick}>Save</Button>);
  await screen.getByRole("button", { name: "Save" }).click();
  expect(onClick).toHaveBeenCalledOnce();
});
```

### Express API

Export the Express `app` without calling `listen()` so tests can use supertest:

```js
const request = require("supertest");
const { app } = require("./app");

it("GET /api/health returns ok", async () => {
  const res = await request(app).get("/api/health");
  expect(res.status).toBe(200);
  expect(res.body.status).toBe("ok");
});
```

If `app` is not yet exported, extract `server/app.js` as part of the feature (minimal refactor).

### Types and mocks

- Use `vi.fn()` / `vi.mock()` for Vitest mocks
- Reuse types from `types/` — do not duplicate domain shapes in tests
- Mock fetch for frontend API calls; do not hit the real Express server in component unit tests

## Feature completion gate

Before telling the user a feature is done:

1. Run `npm test` in the terminal
2. If tests fail, fix code or tests — do not skip
3. Summarize what was tested in the final response (1–2 sentences)

If the change is docs-only or config-only with no testable logic, state why tests were not added.

## Additional resources

- Project-specific examples: [examples.md](examples.md)

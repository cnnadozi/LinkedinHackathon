# Unit testing examples — LinkedIn Events Hub

Tests live in `tests/` and mirror source file paths. Import source via `@/`.

## Button component

`tests/components/linkedin/Button.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "@/components/linkedin/Button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Connect</Button>);
    expect(screen.getByRole("button", { name: "Connect" })).toBeInTheDocument();
  });

  it("applies variant class", () => {
    render(<Button variant="secondary">Cancel</Button>);
    expect(screen.getByRole("button")).toHaveClass("li-btn--secondary");
  });

  it("forwards onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
```

## Pure utility

`tests/lib/formatEventDate.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { formatEventDate } from "@/lib/formatEventDate";

describe("formatEventDate", () => {
  it("formats ISO date for display", () => {
    expect(formatEventDate("2026-06-15T18:00:00Z")).toMatch(/Jun 15, 2026/);
  });

  it("returns fallback for invalid input", () => {
    expect(formatEventDate("")).toBe("Date TBD");
  });
});
```

## Express route (with exported app)

`tests/server/routes/users.test.js`:

```js
const request = require("supertest");
const { describe, expect, it } = require("vitest");
const { createApp } = require("@/server/app");

describe("GET /api/users/:id", () => {
  it("returns 404 for unknown id", async () => {
    const app = createApp({ users: [] });
    const res = await request(app).get("/api/users/missing");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("User not found");
  });
});
```

## Mocking fetch in a component

`tests/components/JobList.test.tsx`:

```tsx
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { JobList } from "@/components/JobList";

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ id: "1", title: "Engineer" }],
    })
  );
});

describe("JobList", () => {
  it("shows jobs after load", async () => {
    render(<JobList />);
    await waitFor(() => {
      expect(screen.getByText("Engineer")).toBeInTheDocument();
    });
  });
});
```

import { describe, expect, it } from "vitest";
import {
  buildNudgeContext,
  generateNudgeSuggestions,
  nudgeSuggestionsHeuristic,
  type NudgeContext,
} from "@/lib/nudgeSuggestions.server";

const EVENT_NAME = "Breaking Into HR Coordinator Roles";
// Real attendee of Alice's event_0002 (see server/lib data).
const REAL_ATTENDEE = "user_3397";

describe("buildNudgeContext", () => {
  it("assembles sender, recipient, the shared event, and shared signals", () => {
    const ctx = buildNudgeContext(REAL_ATTENDEE, EVENT_NAME);
    expect(ctx).not.toBeNull();
    expect(ctx!.sender.name).toBe("Alice Johnson");
    expect(ctx!.recipient.name).toBe("Edward Norton");
    expect(ctx!.event.name).toBe(EVENT_NAME);
    expect(Array.isArray(ctx!.shared.skills)).toBe(true);
    expect(Array.isArray(ctx!.shared.schools)).toBe(true);
    expect(Array.isArray(ctx!.shared.themes)).toBe(true);
  });

  it("returns null for an unknown user", () => {
    expect(buildNudgeContext("user_does_not_exist", EVENT_NAME)).toBeNull();
  });

  it("returns null when target is the main user (cannot nudge yourself)", () => {
    expect(buildNudgeContext("user_5736", EVENT_NAME)).toBeNull();
  });
});

describe("nudgeSuggestionsHeuristic", () => {
  const base: NudgeContext = {
    sender: { name: "Alice Johnson" },
    recipient: {
      name: "Ben Ashton",
      headline: "Data Scientist at Acme",
      company: "Acme",
      industry: "Technology",
    },
    event: { name: "Data Science Networking Night" },
    shared: { skills: [], schools: [], themes: [] },
  };

  it("returns exactly 3 non-empty suggestions", () => {
    const out = nudgeSuggestionsHeuristic(base);
    expect(out).toHaveLength(3);
    expect(out.every((s) => s.trim().length > 0)).toBe(true);
  });

  it("addresses the recipient by first name only", () => {
    const out = nudgeSuggestionsHeuristic(base);
    expect(out.every((s) => s.includes("Ben"))).toBe(true);
    expect(out.some((s) => s.includes("Ashton"))).toBe(false);
  });

  it("references the shared event by name", () => {
    const out = nudgeSuggestionsHeuristic(base);
    expect(out.some((s) => s.includes("Data Science Networking Night"))).toBe(true);
  });

  it("weaves in a shared skill on the advice angle", () => {
    const out = nudgeSuggestionsHeuristic({
      ...base,
      shared: { skills: ["Teaching"], schools: [], themes: [] },
    });
    expect(out[1]).toContain("Teaching");
  });

  it("mentions a shared school on the warm angle when present", () => {
    const out = nudgeSuggestionsHeuristic({
      ...base,
      shared: { skills: [], schools: ["Rice University"], themes: [] },
    });
    expect(out[0]).toContain("Rice University");
  });
});

describe("generateNudgeSuggestions (no API key → heuristic)", () => {
  it("returns 3 suggestions for a real attendee", async () => {
    const out = await generateNudgeSuggestions(REAL_ATTENDEE, EVENT_NAME);
    expect(out).not.toBeNull();
    expect(out).toHaveLength(3);
  });

  it("returns null for an unknown user", async () => {
    expect(await generateNudgeSuggestions("user_nope", EVENT_NAME)).toBeNull();
  });
});

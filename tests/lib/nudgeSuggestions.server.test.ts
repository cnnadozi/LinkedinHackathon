import { describe, expect, it } from "vitest";
import {
  buildNudgeContext,
  generateNudgeSuggestions,
  getNudgePanel,
  nudgeSuggestionsHeuristic,
  parseNudgeSuggestionsResponse,
  type NudgeContext,
} from "@/lib/nudgeSuggestions.server";

const EVENT_NAME = "Breaking Into HR Coordinator Roles";
// Real attendee of Alice's event_0002 (see server/lib data).
const REAL_ATTENDEE = "user_3397";

describe("parseNudgeSuggestionsResponse", () => {
  it("parses a standard suggestions array", () => {
    const out = parseNudgeSuggestionsResponse(
      JSON.stringify({
        suggestions: ["Mention the event.", "Bring up Python.", "Ask Ben about Acme."],
      }),
    );
    expect(out).toEqual(["Mention the event.", "Bring up Python.", "Ask Ben about Acme."]);
  });

  it("strips markdown fences and alternate keys", () => {
    const out = parseNudgeSuggestionsResponse(`\`\`\`json
{
  "talking_points": ["One", "Two", "Three"]
}
\`\`\``);
    expect(out).toEqual(["One", "Two", "Three"]);
  });

  it("coerces object-shaped suggestions", () => {
    const out = parseNudgeSuggestionsResponse(
      JSON.stringify({
        suggestions: [
          { text: "Mention the event." },
          { suggestion: "Bring up Python." },
          { idea: "Ask Ben about Acme." },
        ],
      }),
    );
    expect(out).toHaveLength(3);
  });

  it("throws when fewer than 3 suggestions are present", () => {
    expect(() =>
      parseNudgeSuggestionsResponse(JSON.stringify({ suggestions: ["Only one"] })),
    ).toThrow("Gemini response missing 3 valid suggestions");
  });
});

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

  it("produces ideas, not sendable messages (no greetings or first person)", () => {
    const out = nudgeSuggestionsHeuristic(base);
    for (const idea of out) {
      expect(idea).not.toMatch(/^\s*(hi|hey|hello)\b/i);
      expect(idea).not.toMatch(/\bI'd\b|\bI'm\b|\bI \b/);
    }
  });

  it("uses the recipient's first name only when naming them", () => {
    const out = nudgeSuggestionsHeuristic(base);
    expect(out.some((s) => s.includes("Ben"))).toBe(true);
    expect(out.some((s) => s.includes("Ashton"))).toBe(false);
  });

  it("references the shared event by name on the first idea", () => {
    const out = nudgeSuggestionsHeuristic(base);
    expect(out[0]).toContain("Data Science Networking Night");
  });

  it("uses a shared skill for the 'something in common' idea", () => {
    const out = nudgeSuggestionsHeuristic({
      ...base,
      shared: { skills: ["Teaching"], schools: [], themes: [] },
    });
    expect(out[1]).toContain("Teaching");
  });

  it("prefers a shared school over a skill for the common-ground idea", () => {
    const out = nudgeSuggestionsHeuristic({
      ...base,
      shared: { skills: ["Teaching"], schools: ["Rice University"], themes: [] },
    });
    expect(out[1]).toContain("Rice University");
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

describe("getNudgePanel", () => {
  it("returns the three connection-panel sections for a real attendee", async () => {
    const panel = await getNudgePanel(REAL_ATTENDEE, EVENT_NAME);
    expect(panel).not.toBeNull();
    expect(Array.isArray(panel!.sharedThemes)).toBe(true);
    expect(Array.isArray(panel!.mutualEvents)).toBe(true);
    expect(panel!.talkingPoints).toHaveLength(3);
  });

  it("includes the shared event among mutual events (last 6 months)", async () => {
    const panel = await getNudgePanel(REAL_ATTENDEE, EVENT_NAME);
    expect(panel!.mutualEvents.some((e) => e.name === EVENT_NAME)).toBe(true);
  });

  it("de-duplicates shared themes", async () => {
    const panel = await getNudgePanel(REAL_ATTENDEE, EVENT_NAME);
    const themes = panel!.sharedThemes;
    expect(new Set(themes).size).toBe(themes.length);
  });

  it("returns null for an unknown user", async () => {
    expect(await getNudgePanel("user_nope", EVENT_NAME)).toBeNull();
  });
});

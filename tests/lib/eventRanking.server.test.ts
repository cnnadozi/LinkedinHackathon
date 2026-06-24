import { describe, expect, it } from "vitest";
import {
  applyRankedIds,
  rankEventsHeuristic,
  scoreEvent,
  type MemberProfile,
} from "@/lib/eventRanking.server";
import type { Event } from "@/types/event";

const member: MemberProfile = {
  current_location: "Seattle, WA",
  industry: "Education",
  skills: ["Teaching", "Mentoring"],
  courses: ["Public Speaking"],
};

function makeEvent(overrides: Partial<Event>): Event {
  return {
    id: "event_x",
    name: "Event",
    location: "Austin, TX",
    time: "2026-05-01T18:00:00.000Z",
    description: "A networking event.",
    host_user_id: "user_1",
    industry: "Technology",
    company: "Acme",
    image: "/events/cover_1.png",
    ...overrides,
  };
}

describe("scoreEvent", () => {
  it("ranks an exact location match highest", () => {
    const local = makeEvent({ id: "a", location: "Seattle, WA" });
    const remote = makeEvent({ id: "b", location: "Austin, TX" });
    expect(scoreEvent(local, member)).toBeGreaterThan(scoreEvent(remote, member));
  });

  it("gives partial credit for a shared city token", () => {
    const sameCity = makeEvent({ location: "Seattle, WA" });
    const partial = makeEvent({ location: "Greater Seattle Area" });
    const none = makeEvent({ location: "Austin, TX" });
    expect(scoreEvent(sameCity, member)).toBeGreaterThan(scoreEvent(partial, member));
    expect(scoreEvent(partial, member)).toBeGreaterThan(scoreEvent(none, member));
  });

  it("rewards a matching industry", () => {
    const edu = makeEvent({ industry: "Education" });
    const tech = makeEvent({ industry: "Technology" });
    expect(scoreEvent(edu, member)).toBeGreaterThan(scoreEvent(tech, member));
  });

  it("rewards events that reference the member's skills and courses", () => {
    const skilled = makeEvent({
      description: "Teaching workshop with public speaking practice.",
    });
    const plain = makeEvent({ description: "A generic meetup." });
    expect(scoreEvent(skilled, member)).toBeGreaterThan(scoreEvent(plain, member));
  });
});

describe("rankEventsHeuristic", () => {
  it("orders events most-relevant first", () => {
    const events = [
      makeEvent({ id: "remote", location: "Austin, TX", industry: "Technology" }),
      makeEvent({ id: "local", location: "Seattle, WA", industry: "Education" }),
    ];
    const ranked = rankEventsHeuristic(events, member);
    expect(ranked[0].id).toBe("local");
    expect(ranked[1].id).toBe("remote");
  });

  it("is a stable sort for equally-scored events", () => {
    const events = [
      makeEvent({ id: "first", location: "Austin, TX", industry: "Technology" }),
      makeEvent({ id: "second", location: "Austin, TX", industry: "Technology" }),
    ];
    const ranked = rankEventsHeuristic(events, member);
    expect(ranked.map((e) => e.id)).toEqual(["first", "second"]);
  });

  it("returns every event exactly once", () => {
    const events = [
      makeEvent({ id: "a" }),
      makeEvent({ id: "b" }),
      makeEvent({ id: "c" }),
    ];
    const ranked = rankEventsHeuristic(events, member);
    expect(ranked.map((e) => e.id).sort()).toEqual(["a", "b", "c"]);
  });
});

describe("applyRankedIds", () => {
  const events = [
    makeEvent({ id: "a" }),
    makeEvent({ id: "b" }),
    makeEvent({ id: "c" }),
  ];

  it("reorders events to match the id list", () => {
    expect(applyRankedIds(events, ["c", "a", "b"]).map((e) => e.id)).toEqual([
      "c",
      "a",
      "b",
    ]);
  });

  it("appends events the model omitted, in original order", () => {
    expect(applyRankedIds(events, ["b"]).map((e) => e.id)).toEqual([
      "b",
      "a",
      "c",
    ]);
  });

  it("ignores unknown or duplicate ids", () => {
    expect(
      applyRankedIds(events, ["a", "a", "zzz", "b", "c"]).map((e) => e.id),
    ).toEqual(["a", "b", "c"]);
  });
});

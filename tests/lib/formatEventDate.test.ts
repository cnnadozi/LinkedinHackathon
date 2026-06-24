import { describe, expect, it } from "vitest";
import {
  eventBannerClass,
  formatEventDate,
} from "@/lib/formatEventDate";

describe("formatEventDate", () => {
  it("returns readable date and time labels", () => {
    const result = formatEventDate("2026-04-05T19:00:00.000Z");

    expect(result.dateLabel).toContain("2026");
    expect(result.timeLabel.length).toBeGreaterThan(0);
    expect(result.fullLabel).toContain("·");
    expect(result.scheduleLabel).toContain("(your local time)");
  });
});

describe("eventBannerClass", () => {
  it("normalizes industry names into banner modifier classes", () => {
    expect(eventBannerClass("Technology")).toBe(
      "event-detail__banner--technology",
    );
    expect(eventBannerClass("Health Care")).toBe(
      "event-detail__banner--health-care",
    );
  });
});

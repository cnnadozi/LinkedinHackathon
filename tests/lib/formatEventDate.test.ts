import { describe, expect, it, vi } from "vitest";
import {
  eventBannerClass,
  formatEventDate,
  formatSidebarEventStatus,
  isEventLive,
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

describe("formatSidebarEventStatus", () => {
  it("shows Happening now for events in progress", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-05T19:15:00.000Z"));

    expect(formatSidebarEventStatus("2026-04-05T19:00:00.000Z")).toEqual({
      label: "Happening now",
      isLive: true,
    });

    vi.useRealTimers();
  });

  it("formats same-day events as Today with time", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-05T12:00:00.000Z"));

    const result = formatSidebarEventStatus("2026-04-05T19:00:00.000Z");

    expect(result.isLive).toBe(false);
    expect(result.label).toMatch(/^Today,/);

    vi.useRealTimers();
  });
});

describe("isEventLive", () => {
  it("returns false before the event starts", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-05T18:00:00.000Z"));

    expect(isEventLive("2026-04-05T19:00:00.000Z")).toBe(false);

    vi.useRealTimers();
  });
});

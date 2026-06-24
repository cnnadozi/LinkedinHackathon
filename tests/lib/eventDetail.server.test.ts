import { describe, expect, it } from "vitest";
import { loadEventDetailFromDataset } from "@/lib/eventDetail.server";

describe("loadEventDetailFromDataset", () => {
  it("loads a real event from events_data.json by id", () => {
    const detail = loadEventDetailFromDataset("event_0001");

    expect(detail).not.toBeNull();
    expect(detail?.event.id).toBe("event_0001");
    expect(detail?.event.name).toBe("Breaking Into DevOps Engineer Roles");
    expect(detail?.attendance.total).toBeGreaterThan(0);
  });

  it("returns null for unknown ids", () => {
    expect(loadEventDetailFromDataset("event_does_not_exist")).toBeNull();
  });
});

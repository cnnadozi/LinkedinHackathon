import { describe, expect, it } from "vitest";
import { MAIN_USER_ID } from "@/lib/mainUser";

describe("mainUser", () => {
  it("exports a stable main user id from the dataset", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { userById, getMainUserAttendingEventIds } = require("../../server/lib/data");

    expect(MAIN_USER_ID).toBe("user_5736");
    expect(userById[MAIN_USER_ID]?.name).toBe("Alice Johnson");
    expect(getMainUserAttendingEventIds().length).toBeGreaterThan(0);
  });
});

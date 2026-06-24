import { describe, expect, it } from "vitest";
import {
  DEMO_USER_ID,
  DEMO_USER_PROFILE_PICTURE_URL,
  getProfilePictureUrl,
} from "@/lib/profilePicture";

describe("getProfilePictureUrl", () => {
  it("returns a Pravatar URL seeded by user id", () => {
    expect(getProfilePictureUrl("user_4579")).toBe(
      "https://i.pravatar.cc/150?u=user_4579",
    );
  });

  it("supports custom sizes", () => {
    expect(getProfilePictureUrl("user_4579", 64)).toBe(
      "https://i.pravatar.cc/64?u=user_4579",
    );
  });

  it("encodes special characters in the seed", () => {
    expect(getProfilePictureUrl("user/a b")).toBe(
      "https://i.pravatar.cc/150?u=user%2Fa%20b",
    );
  });

  it("exposes demo user profile picture constant", () => {
    expect(DEMO_USER_PROFILE_PICTURE_URL).toBe(
      getProfilePictureUrl(DEMO_USER_ID),
    );
  });
});

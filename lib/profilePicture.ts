/** Pravatar URLs — deterministic per user id (see https://pravatar.cc/). */
const PRAVATAR_BASE = "https://i.pravatar.cc";

export function getProfilePictureUrl(userId: string, size = 150): string {
  return `${PRAVATAR_BASE}/${size}?u=${encodeURIComponent(userId)}`;
}

/** Demo logged-in member id (matches server/lib/data.js default). */
export const DEMO_USER_ID = "user_5736";

export const DEMO_USER_PROFILE_PICTURE_URL =
  getProfilePictureUrl(DEMO_USER_ID);

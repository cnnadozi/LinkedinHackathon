/** Pravatar URLs — deterministic per user id (see https://pravatar.cc/). */
const PRAVATAR_BASE = "https://i.pravatar.cc";

export function getProfilePictureUrl(userId: string, size = 150): string {
  return `${PRAVATAR_BASE}/${size}?u=${encodeURIComponent(userId)}`;
}

import { MAIN_USER_ID } from "@/lib/mainUser";

export { MAIN_USER_ID };

export const DEMO_USER_PROFILE_PICTURE_URL =
  getProfilePictureUrl(MAIN_USER_ID);

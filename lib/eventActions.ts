import type { ConnectionSuggestions, RsvpEventSummary } from "./eventTypes";
import { apiFetch } from "./api";

export async function toggleEventRsvp(
  eventId: string,
): Promise<{ rsvpd: boolean } | null> {
  return apiFetch<{ rsvpd: boolean }>(`/api/events/${eventId}/rsvp`, {
    method: "POST",
  });
}

export async function recordEventNudge(
  eventId: string,
  targetUserId: string,
): Promise<{ nudged: boolean } | null> {
  return apiFetch<{ nudged: boolean }>(`/api/events/${eventId}/nudge`, {
    method: "POST",
    body: JSON.stringify({ targetUserId }),
  });
}

export async function fetchUserRsvpEvents(
  userId: string,
): Promise<RsvpEventSummary[] | null> {
  const result = await apiFetch<{ events: RsvpEventSummary[] }>(
    `/api/users/${userId}/rsvps`,
  );
  return result?.events ?? null;
}

export async function fetchConnectionSuggestions(
  userId: string,
): Promise<ConnectionSuggestions | null> {
  return apiFetch<ConnectionSuggestions>(`/api/users/${userId}/suggestions`);
}

import { apiFetch } from "./api";

export async function toggleEventRsvp(
  eventId: string,
): Promise<{ rsvpd: boolean } | null> {
  return apiFetch<{ rsvpd: boolean }>(`/api/events/${eventId}/rsvp`, {
    method: "POST",
  });
}

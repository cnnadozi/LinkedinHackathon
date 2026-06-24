import type { EventDetailPayload } from "./eventTypes";
import type { Event } from "@/types/event";

export function loadEventDetailFromDataset(
  eventId: string,
): EventDetailPayload | null {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getEventDetail } = require("../server/lib/events");
  return getEventDetail(eventId) as EventDetailPayload | null;
}

/** Sidebar recommendations — nearby events from the same dataset. */
export function loadRelatedEvents(
  currentEventId: string,
  limit = 5,
): Event[] {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { events } = require("../server/lib/data");
  return events
    .filter((event: Event) => event.id !== currentEventId)
    .slice(0, limit);
}

import { rankEventsForMainUser } from "@/lib/eventRanking.server";
import type { Event } from "@/types/event";
import EventsPageLayout from "@/components/EventsPageLayout";

export default async function EventsPage() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { events, getMainUserAttendingEventIds } = require("@/server/lib/data") as {
    events: Event[];
    getMainUserAttendingEventIds: () => string[];
  };
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getEventAttendeeCounts } = require("@/server/lib/events") as {
    getEventAttendeeCounts: (eventList: Event[]) => Record<string, number>;
  };

  // Order events for the main user (Alice Johnson) by location, industry,
  // skills, and courses — via Gemini, with a heuristic fallback.
  const rankedEvents = await rankEventsForMainUser(events);

  return (
    <main className="page events-feed-page">
      <EventsPageLayout
        events={rankedEvents}
        mainUserAttendingEventIds={getMainUserAttendingEventIds()}
        attendeeCounts={getEventAttendeeCounts(rankedEvents)}
      />
    </main>
  );
}

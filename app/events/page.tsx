import { EventsFeedSection } from "@/components/EventsFeedSection";
import { rankEventsForMainUser } from "@/lib/eventRanking.server";
import type { Event } from "@/types/event";

export default async function EventsPage() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { events, getMainUserAttendingEventIds } = require("@/server/lib/data") as {
    events: Event[];
    getMainUserAttendingEventIds: () => string[];
  };

  // Order events for the main user (Alice Johnson) by location, industry,
  // skills, and courses — via Gemini, with a heuristic fallback.
  const rankedEvents = await rankEventsForMainUser(events);

  return (
    <main className="page events-feed-page">
      <div className="events-feed-layout">
        <div className="events-feed-main">
          <EventsFeedSection
            events={rankedEvents}
            mainUserAttendingEventIds={getMainUserAttendingEventIds()}
          />
        </div>
      </div>
    </main>
  );
}

import { EventsFeedSection } from "@/components/EventsFeedSection";
import type { Event } from "@/types/event";

export default function EventsPage() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { events, getMainUserAttendingEventIds } = require("@/server/lib/data") as {
    events: Event[];
    getMainUserAttendingEventIds: () => string[];
  };
  const { getEventAttendeeCounts } = require("@/server/lib/events") as {
    getEventAttendeeCounts: (eventList: Event[]) => Record<string, number>;
  };

  return (
    <main className="page events-feed-page">
      <div className="events-feed-layout">
        <div className="events-feed-main">
          <EventsFeedSection
            events={events}
            mainUserAttendingEventIds={getMainUserAttendingEventIds()}
            attendeeCounts={getEventAttendeeCounts(events)}
          />
        </div>
      </div>
    </main>
  );
}

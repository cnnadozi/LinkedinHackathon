import { EventsFeedSection } from "@/components/EventsFeedSection";
import type { Event } from "@/types/event";

export default function EventsPage() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { events, getMainUserAttendingEventIds } = require("@/server/lib/data") as {
    events: Event[];
    getMainUserAttendingEventIds: () => string[];
  };

  return (
    <main className="page events-feed-page">
      <div className="events-feed-layout">
        <div className="events-feed-main">
          <EventsFeedSection
            events={events}
            mainUserAttendingEventIds={getMainUserAttendingEventIds()}
          />
        </div>
      </div>
    </main>
  );
}

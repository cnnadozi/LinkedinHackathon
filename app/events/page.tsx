import type { Event } from "@/types/event";
import EventsPageLayout from "@/components/EventsPageLayout";

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
      <EventsPageLayout
        events={events}
        mainUserAttendingEventIds={getMainUserAttendingEventIds()}
        attendeeCounts={getEventAttendeeCounts(events)}
      />
    </main>
  );
}

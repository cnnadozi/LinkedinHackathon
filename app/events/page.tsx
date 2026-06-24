import type { Event } from "@/types/event";
import EventsPageLayout from "@/components/EventsPageLayout";

export default function EventsPage() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { events, getMainUserAttendingEventIds } = require("@/server/lib/data") as {
    events: Event[];
    getMainUserAttendingEventIds: () => string[];
  };

  return (
    <main className="page events-feed-page">
      <EventsPageLayout
        events={events}
        mainUserAttendingEventIds={getMainUserAttendingEventIds()}
      />
    </main>
  );
}

import eventsData from "@/data/events_data.json";
import type { Event } from "@/types/event";
import EventsPageLayout from "@/components/EventsPageLayout";

export default function EventsPage() {
  const events = eventsData as Event[];

  return (
    <main className="page events-feed-page">
      <EventsPageLayout events={events}/>
    </main>
  );
}
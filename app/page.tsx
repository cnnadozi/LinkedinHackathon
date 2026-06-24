/** Home page — featured event detail view. */
import Link from "next/link";
import { EventDetail } from "@/components/EventDetail";
import {
  loadEventDetailFromDataset,
  loadRelatedEvents,
} from "@/lib/eventDetail.server";

const FEATURED_EVENT_ID = "event_0001";

export default async function Home() {
  const data = loadEventDetailFromDataset(FEATURED_EVENT_ID);
  const relatedEvents = loadRelatedEvents(FEATURED_EVENT_ID);

  if (!data) {
    return (
      <main className="page page--event-detail">
        <div className="event-detail__not-found">
          <h1>Event not found</h1>
          <p>
            We couldn&apos;t find an event with id{" "}
            <code>{FEATURED_EVENT_ID}</code>.
          </p>
          <Link href="/" className="event-detail__back">
            ← Back to events
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page page--event-detail">
      <EventDetail data={data} relatedEvents={relatedEvents} />
    </main>
  );
}

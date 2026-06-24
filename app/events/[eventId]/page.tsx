import Link from "next/link";
import { EventDetail } from "@/components/EventDetail";
import {
  loadEventDetailFromDataset,
  loadRelatedEvents,
} from "@/lib/eventDetail.server";

type EventPageProps = {
  params: Promise<{ eventId: string }>;
};

export default async function EventPage({ params }: EventPageProps) {
  const { eventId } = await params;
  const data = loadEventDetailFromDataset(eventId);
  const relatedEvents = loadRelatedEvents(eventId);

  if (!data) {
    return (
      <main className="page page--event-detail">
        <div className="event-detail__not-found">
          <h1>Event not found</h1>
          <p>
            We couldn&apos;t find an event with id <code>{eventId}</code>.
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

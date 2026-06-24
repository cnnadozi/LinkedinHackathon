import Image from "next/image";
import Link from "next/link";
import { RelativeEventTime } from "@/components/RelativeEventTime";
import { eventBannerClass } from "@/lib/formatEventDate";
import type { Event } from "@/types/event";

type EventCardProps = {
  event: Event;
  attendeeCount: number;
};

export function EventCard({ event, attendeeCount }: EventCardProps) {
  const bannerClass = eventBannerClass(event.industry);
  const isOnline = !event.location.match(/,\s*[A-Z]{2}$/);

  return (
    <article className="event-feed-card">
      <Link href={`/events/${event.id}`} className="event-feed-card__thumb-link" tabIndex={-1} aria-hidden>
        <div className={`event-feed-card__thumb ${bannerClass}`} role="presentation">
          <Image
            src={event.image}
            alt=""
            fill
            sizes="100px"
            className="event-feed-card__thumb-img"
          />
        </div>
      </Link>

      <div className="event-feed-card__body">
        <Link href={`/events/${event.id}`} className="event-feed-card__title-link">
          <h3 className="event-feed-card__title">{event.name}</h3>
        </Link>

        <p className="event-feed-card__time">
          <RelativeEventTime iso={event.time} mode="feed" />
        </p>

        <p className="event-feed-card__meta">
          {isOnline ? "Online" : event.location}
          {" · "}
          <span>By {event.company}</span>
        </p>

        <p className="event-feed-card__description">{event.description}</p>

        <p className="event-feed-card__attendees">
          <svg
            className="event-feed-card__attendees-icon"
            viewBox="0 0 16 16"
            width="16"
            height="16"
            aria-hidden
          >
            <path
              fill="currentColor"
              d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-5 6a5 5 0 0 1 10 0H3z"
            />
          </svg>
          {attendeeCount.toLocaleString()}{" "}
          {attendeeCount === 1 ? "attendee" : "attendees"}
        </p>
      </div>
    </article>
  );
}

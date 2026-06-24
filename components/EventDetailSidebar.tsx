import Link from "next/link";
import { Card } from "./linkedin/Card";
import { eventBannerClass } from "@/lib/formatEventDate";
import type { Event } from "@/types/event";

type EventDetailSidebarProps = {
  relatedEvents: Event[];
};

function formatSidebarTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  if (sameDay) return `Today, ${time}`;
  if (isTomorrow) return `Tomorrow, ${time}`;

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function EventDetailSidebar({ relatedEvents }: EventDetailSidebarProps) {
  return (
    <aside className="event-sidebar" aria-label="Event recommendations">
      <Card padding="md" className="event-sidebar__premium">
        <div className="event-sidebar__premium-header">
          <span className="event-sidebar__premium-badge" aria-hidden>
            ★
          </span>
          <h2 className="event-sidebar__premium-title">
            Exclusive events to grow your career
          </h2>
        </div>
        <p className="event-sidebar__premium-copy">
          Join live conversations with leaders and peers in your industry.
        </p>
        <button type="button" className="event-sidebar__premium-cta">
          See all Premium events
        </button>
      </Card>

      <Card padding="md" className="event-sidebar__related">
        <div className="event-sidebar__related-header">
          <h2 className="event-sidebar__related-title">Other events for you</h2>
          <Link href="/" className="event-sidebar__see-all">
            See all
          </Link>
        </div>

        <ul className="event-sidebar__list">
          {relatedEvents.map((event) => (
            <li key={event.id}>
              <Link href={`/events/${event.id}`} className="event-sidebar__item">
                <div
                  className={`event-sidebar__thumb ${eventBannerClass(event.industry)}`}
                  aria-hidden
                />
                <div className="event-sidebar__item-body">
                  <p className="event-sidebar__item-time">
                    {formatSidebarTime(event.time)}
                  </p>
                  <p className="event-sidebar__item-title">{event.name}</p>
                  <p className="event-sidebar__item-host">{event.company}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Card>

      <footer className="event-sidebar__footer">
        <span>About</span>
        <span>Accessibility</span>
        <span>Help Center</span>
        <span>Privacy &amp; Terms</span>
        <p>LinkedIn Corporation © 2026</p>
      </footer>
    </aside>
  );
}

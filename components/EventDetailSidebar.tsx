import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/linkedin";
import {
  eventBannerClass,
  formatSidebarEventStatus,
} from "@/lib/formatEventDate";
import type { Event } from "@/types/event";

type EventDetailSidebarProps = {
  relatedEvents: Event[];
};

export function EventDetailSidebar({ relatedEvents }: EventDetailSidebarProps) {
  return (
    <aside className="event-sidebar" aria-label="Event recommendations">
      <Card padding="md" className="event-sidebar__related">
        <div className="event-sidebar__related-header">
          <h2 className="event-sidebar__related-title">Other events for you</h2>
          <Link href="/" className="event-sidebar__see-all">
            See all
          </Link>
        </div>

        <ul className="event-sidebar__list">
          {relatedEvents.map((event) => {
            const status = formatSidebarEventStatus(event.time);
            const bannerClass = eventBannerClass(event.industry);

            return (
              <li key={event.id}>
                <Link href={`/events/${event.id}`} className="event-sidebar__item">
                  <div
                    className={`event-sidebar__thumb ${bannerClass}`}
                    role="presentation"
                    aria-hidden
                  >
                    <Image
                      src={event.image}
                      alt=""
                      fill
                      sizes="80px"
                      className="event-sidebar__thumb-img"
                    />
                  </div>
                  <div className="event-sidebar__item-body">
                    <p
                      className={
                        status.isLive
                          ? "event-sidebar__item-time event-sidebar__item-time--live"
                          : "event-sidebar__item-time"
                      }
                    >
                      {status.label}
                    </p>
                    <p className="event-sidebar__item-title">{event.name}</p>
                    <p className="event-sidebar__item-host">{event.company}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Card>
    </aside>
  );
}

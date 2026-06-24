import { EventsFeed } from "@/components/EventsFeed";
import type { Event } from "@/types/event";

export default function EventsPage() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { events } = require("@/server/lib/data") as { events: Event[] };

  return (
    <main className="page events-feed-page">
      <div className="events-feed-layout">
        <div className="events-feed-main">
          <div className="events-feed-filter-bar">
            <button type="button" className="events-feed-filter-pill events-feed-filter-pill--active">
              Events
              <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden className="events-feed-filter-pill__caret">
                <path fill="currentColor" d="M8 10.94L2.06 5l1.41-1.41L8 8.12l4.53-4.53L13.94 5z" />
              </svg>
            </button>
          </div>

          <EventsFeed events={events} />
        </div>

      </div>
    </main>
  );
}

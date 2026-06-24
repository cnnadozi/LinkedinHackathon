"use client";

import { useMemo, useState } from "react";
import { EventsFeed } from "./EventsFeed";
import type { Event } from "@/types/event";

type FeedFilter = "all" | "attending";

const FILTER_LABELS: Record<FeedFilter, string> = {
  all: "Events",
  attending: "Attending",
};

type EventsFeedSectionProps = {
  events: Event[];
  mainUserAttendingEventIds: string[];
};

export function EventsFeedSection({
  events,
  mainUserAttendingEventIds,
}: EventsFeedSectionProps) {
  const [filter, setFilter] = useState<FeedFilter>("all");

  const filteredEvents = useMemo(() => {
    if (filter !== "attending") return events;
    const attending = new Set(mainUserAttendingEventIds);
    return events.filter((event) => attending.has(event.id));
  }, [events, filter, mainUserAttendingEventIds]);

  return (
    <>
      <div className="events-feed-filter-bar">
        <div className="events-feed-filter-dropdown">
          <span className="events-feed-filter-pill events-feed-filter-pill--active">
            {FILTER_LABELS[filter]}
            <svg
              viewBox="0 0 16 16"
              width="12"
              height="12"
              aria-hidden
              className="events-feed-filter-pill__caret"
            >
              <path
                fill="currentColor"
                d="M8 10.94L2.06 5l1.41-1.41L8 8.12l4.53-4.53L13.94 5z"
              />
            </svg>
          </span>
          <select
            className="events-feed-filter-dropdown__select"
            value={filter}
            onChange={(event) => setFilter(event.target.value as FeedFilter)}
            aria-label="Filter events"
          >
            <option value="all">All events</option>
            <option value="attending">Attending</option>
          </select>
        </div>
      </div>

      <EventsFeed events={filteredEvents} />
    </>
  );
}

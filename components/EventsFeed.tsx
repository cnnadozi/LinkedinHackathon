"use client";

import { useEffect, useState } from "react";
import { Pagination, LIST_PAGE_SIZE } from "@/components/linkedin";
import { EventCard } from "./EventCard";
import type { Event } from "@/types/event";

type EventsFeedProps = {
  events: Event[];
  attendeeCounts: Record<string, number>;
};

export function EventsFeed({ events, attendeeCounts }: EventsFeedProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(events.length / LIST_PAGE_SIZE));
  const visible = events.slice((page - 1) * LIST_PAGE_SIZE, page * LIST_PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [events]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <>
      <p className="events-feed-count">{events.length} results</p>

      <div className="events-feed-card">
        <ul className="events-feed-list">
          {visible.map((event) => (
            <li key={event.id} className="events-feed-list__item">
              <EventCard
                event={event}
                attendeeCount={attendeeCounts[event.id] ?? 0}
              />
            </li>
          ))}
        </ul>

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          aria-label="Events pagination"
        />
      </div>
    </>
  );
}

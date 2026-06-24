"use client";

import { useState } from "react";
import { EventCard } from "./EventCard";
import type { Event } from "@/types/event";

const PER_PAGE = 10;

function simpleHash(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash * 31) + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function attendeeCount(eventId: string): number {
  return 180 + (simpleHash(eventId) % 120);
}

type EventsFeedProps = {
  events: Event[];
};

function pageRange(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, "…", total];
  }
  if (current >= total - 3) {
    return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, "…", current - 1, current, current + 1, "…", total];
}

export function EventsFeed({ events }: EventsFeedProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(events.length / PER_PAGE);
  const visible = events.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function goTo(p: number) {
    setPage(Math.max(1, Math.min(p, totalPages)));
  }

  const pages = pageRange(page, totalPages);

  return (
    <>
      <p className="events-feed-count">{events.length} results</p>

      <div className="events-feed-card">
        <ul className="events-feed-list">
          {visible.map((event) => (
            <li key={event.id} className="events-feed-list__item">
              <EventCard event={event} attendeeCount={attendeeCount(event.id)} />
            </li>
          ))}
        </ul>

        <nav className="events-pagination" aria-label="Pagination">
          <button
            type="button"
            className="events-pagination__btn events-pagination__prev"
            onClick={() => goTo(page - 1)}
            disabled={page === 1}
            aria-label="Previous page"
          >
            ← Previous
          </button>

          {pages.map((p, i) =>
            p === "…" ? (
              <span key={`ellipsis-${i}`} className="events-pagination__ellipsis">
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                className={`events-pagination__btn events-pagination__page${page === p ? " events-pagination__page--active" : ""}`}
                onClick={() => goTo(p as number)}
                aria-current={page === p ? "page" : undefined}
              >
                {p}
              </button>
            )
          )}

          <button
            type="button"
            className="events-pagination__btn events-pagination__next"
            onClick={() => goTo(page + 1)}
            disabled={page === totalPages}
            aria-label="Next page"
          >
            Next →
          </button>
        </nav>
      </div>
    </>
  );
}

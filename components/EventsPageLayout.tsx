"use client";

import { useState } from "react";
import { EventsFeedSection } from "./EventsFeedSection";
import CalendarOverlay from "./CalendarOverlay";
import type { Event } from "@/types/event";

function CalendarPanelIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20 3h-1V1h-2v2H7V1H5v2H4C2.9 3 2 3.9 2 5v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
    </svg>
  );
}

type Props = {
  events: Event[];
  mainUserAttendingEventIds?: string[];
};

export default function EventsPageLayout({ events, mainUserAttendingEventIds = [] }: Props) {
  const [calOpen, setCalOpen] = useState(true);

  const splitClass = [
    "events-split",
    calOpen ? "events-split--with-cal" : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={splitClass}>
      {/* ── Events column ── */}
      <div className="events-split__feed">
        <div className="events-feed-filter-bar">
          <button
            type="button"
            className={`events-split__cal-toggle${calOpen ? " events-split__cal-toggle--active" : ""}`}
            onClick={() => setCalOpen((o) => !o)}
            aria-pressed={calOpen}
            aria-label={calOpen ? "Hide calendar" : "Show calendar"}
          >
            <CalendarPanelIcon />
            {calOpen ? "Hide calendar" : "Show calendar"}
          </button>
        </div>

        <EventsFeedSection events={events} mainUserAttendingEventIds={mainUserAttendingEventIds} />
      </div>

      {/* ── Calendar panel ── */}
      {calOpen && (
        <aside className="events-split__cal" aria-label="Events calendar">
          <div className="events-split__cal-header">
            <span className="events-split__cal-title">Calendar</span>
            <button
              type="button"
              className="events-split__cal-close"
              onClick={() => setCalOpen(false)}
              aria-label="Close calendar"
            >
              ✕
            </button>
          </div>
          <CalendarOverlay events={events} />
          <div className="events-split__cal-footer">
            <button
              type="button"
              className="events-split__cal-footer-btn events-split__cal-footer-btn--hide"
              onClick={() => setCalOpen(false)}
            >
              ✕ Hide calendar
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}

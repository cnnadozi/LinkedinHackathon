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
  mainUserAttendingEventIds: string[];
  attendeeCounts: Record<string, number>;
};

export default function EventsPageLayout({
  events,
  mainUserAttendingEventIds,
  attendeeCounts,
}: Props) {
  const [calOpen, setCalOpen] = useState(true);

  return (
    <div className={`events-split${calOpen ? " events-split--with-cal" : ""}`}>
      {/* ── Events column ── */}
      <div className="events-split__feed">
        <EventsFeedSection
          events={events}
          mainUserAttendingEventIds={mainUserAttendingEventIds}
          attendeeCounts={attendeeCounts}
          calendarToggle={
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
          }
        />
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
          <CalendarOverlay
            events={events}
            rsvpEventIds={mainUserAttendingEventIds}
          />
        </aside>
      )}

    </div>
  );
}

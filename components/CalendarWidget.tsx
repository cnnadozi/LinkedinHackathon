"use client";

import { useState } from "react";
import CalendarOverlay from "./CalendarOverlay";
import type { Event } from "@/types/event";

function ExpandIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
    </svg>
  );
}

function CollapseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
    </svg>
  );
}

export default function CalendarWidget({ events }: { events: Event[] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {/* Compact half-screen card */}
      <div className="cal-widget">
        <div className="cal-widget__body">
          <CalendarOverlay events={events} />
        </div>

        {/* Bottom fade + expand prompt */}
        <div className="cal-widget__fade">
          <button
            className="cal-widget__expand-btn"
            onClick={() => setExpanded(true)}
            aria-label="Expand calendar to full screen"
          >
            <ExpandIcon />
            Expand calendar
          </button>
        </div>
      </div>

      {/* Full-screen overlay */}
      {expanded && (
        <div className="cal-widget__overlay" role="dialog" aria-label="Full screen calendar">
          <div className="cal-widget__overlay-header">
            <button
              className="cal-widget__close-btn"
              onClick={() => setExpanded(false)}
              aria-label="Close full screen calendar"
            >
              <CollapseIcon />
              Collapse
            </button>
          </div>
          <div className="cal-widget__overlay-body">
            <CalendarOverlay events={events} />
          </div>
        </div>
      )}
    </>
  );
}

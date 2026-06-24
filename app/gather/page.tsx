import type { Event } from "@/types/event";
import eventsData from "@/data/events_data.json";
import CalendarWidget from "@/components/CalendarWidget";
import Link from "next/link";

const INDUSTRY_COLOR: Record<string, string> = {
  Technology: "#0a66c2",
  Education:  "#057642",
  Healthcare: "#7b5ea7",
  Finance:    "#c47b0e",
  Retail:     "#0891b2",
};

const INDUSTRIES = Object.keys(INDUSTRY_COLOR);

function GatherCalendarIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20 3h-1V1h-2v2H7V1H5v2H4C2.9 3 2 3.9 2 5v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
    </svg>
  );
}

export default function GatherPage() {
  const events = eventsData as Event[];

  return (
    <div className="gather-page">
      {/* Page header */}
      <div className="gather-page__header">
        <div className="gather-page__title-block">
          <div className="gather-page__icon-badge">
            <GatherCalendarIcon />
          </div>
          <div>
            <h1 className="gather-page__h1">Gather</h1>
            <p className="gather-page__subtitle">
              Your RSVP&apos;d and upcoming professional events
            </p>
          </div>
        </div>

        <Link
          href="/events"
          className="li-btn li-btn--secondary li-btn--sm"
          style={{ textDecoration: "none" }}
        >
          Browse all events →
        </Link>
      </div>

      {/* Industry colour legend */}
      <div className="gather-legend">
        {INDUSTRIES.map((ind) => (
          <span key={ind} className="gather-legend__item">
            <span
              className="gather-legend__dot"
              style={{ background: INDUSTRY_COLOR[ind] }}
            />
            {ind}
          </span>
        ))}
      </div>

      {/* Calendar */}
      <CalendarWidget events={events} />
    </div>
  );
}

"use client";

import "@/components/AttendanceList.css";

type Attendee = {
  id: string;
  name: string;
  connectionDegree: "1st" | "2nd" | "3rd+";
  avatarUrl?: string;
  avatarColor?: string;
  events: string[];
};

const ACTIVE_FILTERS = [
  "Abingdon",
  "Computer Games",
  "Rice University",
  "SDE Intern",
];

const ATTENDEES: Attendee[] = [
  {
    id: "1",
    name: "Cedric Wilson, LPC, NCC",
    connectionDegree: "3rd+",
    avatarColor: "#6b4c9a",
    events: [
      "Software Engineering Internship Information Session",
      "Product Management Career Workshop",
      "Data Science Networking Night",
      "Resume & LinkedIn Review Clinic",
      "Tech Industry Alumni Panel Discussion",
    ],
  },
  {
    id: "2",
    name: "Ben Ashton",
    connectionDegree: "3rd+",
    avatarColor: "#5b7f95",
    events: ["Data Science Networking Night", "Resume & LinkedIn Review Clinic"],
  },
  {
    id: "3",
    name: "Garrett Louthen",
    connectionDegree: "3rd+",
    avatarColor: "#8b6914",
    events: ["Product Management Career Workshop"],
  },
  {
    id: "4",
    name: "Cody A. J.",
    connectionDegree: "3rd+",
    avatarColor: "#4a7c59",
    events: [
      "Resume & LinkedIn Review Clinic",
      "Tech Industry Alumni Panel Discussion",
    ],
  },
  {
    id: "5",
    name: "Kevin R. Stovall",
    connectionDegree: "3rd+",
    avatarColor: "#7a5c4f",
    events: ["Data Science Networking Night"],
  },
];

function MessageIcon() {
  return (
    <svg
      className="attendance-list-nudge-icon"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden
    >
      <path d="M14 2H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2v3l3-3h7a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Zm-1 8H3.41L4 9.59V11h1v-1.59L5.59 9H13V3H3v7h10Z" />
    </svg>
  );
}

function Avatar({ attendee }: { attendee: Attendee }) {
  if (attendee.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={attendee.avatarUrl}
        alt=""
        className="attendance-list-avatar"
      />
    );
  }

  const initials = attendee.name
    .split(/[\s,]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <div
      className="attendance-list-avatar"
      style={{
        background: attendee.avatarColor ?? "#ccc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: "0.875rem",
        fontWeight: 600,
      }}
      aria-hidden
    >
      {initials}
    </div>
  );
}

export default function AttendanceList() {
  return (
    <section className="attendance-list">
      <header className="attendance-list-header">
        <h2 className="attendance-list-title">Attendance List</h2>
      </header>

      <div className="attendance-list-filters">
        <span className="attendance-list-tab-active">People</span>

        <button type="button" className="attendance-list-filter-button">
          Actively hiring
          <span className="attendance-list-chevron">▾</span>
        </button>
        <button type="button" className="attendance-list-filter-button">
          Locations
          <span className="attendance-list-chevron">▾</span>
        </button>
        <button type="button" className="attendance-list-filter-button">
          Current companies
          <span className="attendance-list-chevron">▾</span>
        </button>

        <div className="attendance-list-connection-group">
          <button type="button" className="attendance-list-connection-button">
            1st
          </button>
          <button type="button" className="attendance-list-connection-button">
            2nd
          </button>
          <button
            type="button"
            className="attendance-list-connection-button attendance-list-connection-active"
          >
            3rd+
          </button>
        </div>

        {ACTIVE_FILTERS.map((filter) => (
          <span key={filter} className="attendance-list-tag">
            {filter}
            <button
              type="button"
              className="attendance-list-tag-remove"
              aria-label={`Remove ${filter} filter`}
            >
              ×
            </button>
          </span>
        ))}

        <button type="button" className="attendance-list-all-filters">
          All filters
        </button>
      </div>

      <ul className="attendance-list-items">
        {ATTENDEES.map((attendee) => (
          <li key={attendee.id} className="attendance-list-row">
            <Avatar attendee={attendee} />
            <div className="attendance-list-content">
              <div className="attendance-list-name-row">
                <span className="attendance-list-name">{attendee.name}</span>
                <span className="attendance-list-connection">
                  · {attendee.connectionDegree}
                </span>
              </div>
              <p className="attendance-list-events">
                {attendee.events.map((event, index) => (
                  <span key={event}>
                    {index > 0 && ", "}
                    <a href="#" className="attendance-list-event-link">
                      {event}
                    </a>
                  </span>
                ))}
              </p>
            </div>
            <button type="button" className="attendance-list-nudge">
              <MessageIcon />
              Nudge
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

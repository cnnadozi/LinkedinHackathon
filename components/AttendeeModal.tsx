"use client";

/**
 * Guest list overlay — layout copied from linkedin.com/mynetwork/invite-connect/connections/
 * Filters: connection degree pills (1st/2nd/3rd+) + Location / Company / Industry / School / Skills dropdowns
 */
import { useMemo, useState } from "react";
import "@/components/AttendanceList.css";
import { Avatar, Button, TextLink } from "@/components/linkedin";
import { Modal } from "@/components/linkedin/Modal";
import { NudgeChat } from "@/components/NudgeChat";
import type { AttendeeRow } from "@/lib/eventTypes";

type AttendeeModalProps = {
  open: boolean;
  onClose: () => void;
  attendees: AttendeeRow[];
  eventId: string;
  eventName: string;
};

type DegreeFilter = 1 | 2 | 3 | null;

type AttendeeFilters = {
  degree: DegreeFilter;
  location: string | null;
  company: string | null;
  industry: string | null;
  school: string | null;
  skill: string | null;
};

const EMPTY_FILTERS: AttendeeFilters = {
  degree: null,
  location: null,
  company: null,
  industry: null,
  school: null,
  skill: null,
};

const DEGREE_LABELS: Record<1 | 2 | 3, string> = { 1: "1st", 2: "2nd", 3: "3rd+" };

const AVATAR_COLORS = [
  "#0a66c2", "#b24592", "#c2410c", "#15803d",
  "#7c3aed", "#6b4c9a", "#5b7f95", "#8b6914",
  "#4a7c59", "#7a5c4f",
];

function avatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function uniqueSorted(values: (string | null | undefined)[]): string[] {
  return [...new Set(values.filter(Boolean) as string[])].sort((a, b) => a.localeCompare(b));
}

/** Chevron icon for dropdown pills */
function Chevron() {
  return (
    <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M8 10.94L2.06 5l1.41-1.41L8 8.12l4.53-4.53L13.94 5z" />
    </svg>
  );
}

function AlsoAttendingEvents({ events }: { events: Array<string | { id: string; name: string }> }) {
  const [expanded, setExpanded] = useState(false);
  const normalizedEvents = events.map((event) =>
    typeof event === "string"
      ? { id: event, name: event, href: "#" }
      : { id: event.id, name: event.name, href: `/events/${event.id}` },
  );

  if (normalizedEvents.length === 0) return null;
  if (normalizedEvents.length === 1) {
    const event = normalizedEvents[0];
    return (
      <p className="li-person-row__meta">
        <span className="li-person-row__meta-label li-person-row__meta-label--mutual">Also attending</span>
        <TextLink href={event.href}>{event.name}</TextLink>
      </p>
    );
  }
  return (
    <div className="li-person-row__also-attending">
      <button
        type="button"
        className="li-person-row__also-attending-trigger"
        aria-expanded={expanded}
        onClick={() => setExpanded((o) => !o)}
      >
        <span className="li-person-row__meta-label li-person-row__meta-label--mutual">Also attending</span>
        <span className="li-person-row__also-attending-count">{normalizedEvents.length} events</span>
        <span className="li-person-row__also-attending-chevron" aria-hidden>▾</span>
      </button>
      {expanded && (
        <ul className="li-person-row__also-attending-menu">
          {normalizedEvents.map((event) => (
            <li key={event.id}><TextLink href={event.href}>{event.name}</TextLink></li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** A dropdown filter pill — shows label + chevron, opens a native <select> overlay */
function FilterPill({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  const active = value !== null;
  return (
    <div className="attendee-filter-pill-wrap">
      <span className={`attendee-filter-pill${active ? " attendee-filter-pill--active" : ""}`}>
        {active ? value : label}
        <Chevron />
      </span>
      <select
        className="attendee-filter-pill__select"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        aria-label={`Filter by ${label}`}
      >
        <option value="">All {label}s</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

/** Active filter tag with ✕ remove button */
function ActiveTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="attendee-active-tag">
      {label}
      <button
        type="button"
        className="attendee-active-tag__remove"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
      >
        ✕
      </button>
    </span>
  );
}

export function AttendeeModal({
  open,
  onClose,
  attendees,
  eventId,
  eventName,
}: AttendeeModalProps) {
  const [filters, setFilters] = useState<AttendeeFilters>(EMPTY_FILTERS);
  const [chatAttendee, setChatAttendee] = useState<AttendeeRow | null>(null);

  const filterOptions = useMemo(() => ({
    locations: uniqueSorted(attendees.map((a) => a.location)),
    companies: uniqueSorted(attendees.map((a) => a.company)),
    industries: uniqueSorted(attendees.map((a) => a.industry)),
    schools: uniqueSorted(attendees.map((a) => a.school)),
    skills: uniqueSorted(attendees.flatMap((a) => a.skills ?? [])),
  }), [attendees]);

  const visibleAttendees = useMemo(() => {
    return attendees.filter((a) => {
      if (filters.degree && a.degree !== filters.degree) return false;
      if (filters.location && a.location !== filters.location) return false;
      if (filters.company && a.company !== filters.company) return false;
      if (filters.industry && a.industry !== filters.industry) return false;
      if (filters.school && a.school !== filters.school) return false;
      if (filters.skill && !(a.skills ?? []).includes(filters.skill)) return false;
      return true;
    }).slice(0, 50);
  }, [attendees, filters]);

  function setFilter<K extends keyof AttendeeFilters>(key: K, value: AttendeeFilters[K]) {
    setFilters((f) => ({ ...f, [key]: value }));
  }

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <Modal open={open} onClose={onClose} title="Attendance List" wide>
      <div className="attendance-list">

        {/* ── Filter bar ── */}
        <div className="attendee-filter-bar">

          {/* Row 1: degree pills + dropdowns */}
          <div className="attendee-filter-bar__row">

            {/* Connection degree quick-pills */}
            <div className="attendee-degree-pills">
              {([1, 2, 3] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  className={`attendee-degree-pill${filters.degree === d ? " attendee-degree-pill--active" : ""}`}
                  onClick={() => setFilter("degree", filters.degree === d ? null : d)}
                  aria-pressed={filters.degree === d}
                >
                  {DEGREE_LABELS[d]}
                </button>
              ))}
            </div>

            {/* Dropdown filters */}
            <FilterPill label="Location" options={filterOptions.locations} value={filters.location} onChange={(v) => setFilter("location", v)} />
            <FilterPill label="Current company" options={filterOptions.companies} value={filters.company} onChange={(v) => setFilter("company", v)} />
            <FilterPill label="Industry" options={filterOptions.industries} value={filters.industry} onChange={(v) => setFilter("industry", v)} />
            <FilterPill label="School" options={filterOptions.schools} value={filters.school} onChange={(v) => setFilter("school", v)} />
            <FilterPill label="Skills" options={filterOptions.skills} value={filters.skill} onChange={(v) => setFilter("skill", v)} />

            {hasActiveFilters && (
              <button type="button" className="attendee-filter-clear" onClick={() => setFilters(EMPTY_FILTERS)}>
                Clear all
              </button>
            )}
          </div>

          {/* Row 2: active filter tags */}
          {hasActiveFilters && (
            <div className="attendee-filter-bar__tags">
              {filters.degree && (
                <ActiveTag label={DEGREE_LABELS[filters.degree]} onRemove={() => setFilter("degree", null)} />
              )}
              {(["location", "company", "industry", "school", "skill"] as const).map((key) =>
                filters[key] ? (
                  <ActiveTag key={key} label={filters[key] as string} onRemove={() => setFilter(key, null)} />
                ) : null
              )}
            </div>
          )}
        </div>

        {/* ── Result count ── */}
        <p className="attendee-result-count">
          {visibleAttendees.length} of {attendees.length} attendees
        </p>

        {/* ── Attendee list ── */}
        <ul className="attendance-list__list">
          {visibleAttendees.map((attendee) => (
            <li key={attendee.id} className="li-person-row">
              <Avatar
                alt={attendee.name}
                src={attendee.profile_picture_url}
                color={avatarColor(attendee.id)}
              />
              <div className="li-person-row__content">
                <span className="li-person-row__name">{attendee.name}</span>
                <p className="li-person-row__headline">{attendee.headline}</p>
                {attendee.location && (
                  <p className="li-person-row__location">{attendee.location}</p>
                )}
                <AlsoAttendingEvents events={attendee.mutualEvents} />
              </div>
              <div className="li-person-row__actions">
                <span className={`attendee-degree-badge attendee-degree-badge--${attendee.degree}`}>
                  {DEGREE_LABELS[attendee.degree]}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  className="li-person-row__action"
                  onClick={() => setChatAttendee(attendee)}
                >
                  Nudge
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {chatAttendee && (
        <NudgeChat
          attendee={chatAttendee}
          eventId={eventId}
          eventName={eventName}
          onClose={() => setChatAttendee(null)}
        />
      )}
    </Modal>
  );
}

"use client";

/**
 * Guest list overlay — layout copied from linkedin.com/mynetwork/invite-connect/connections/
 * Filter bar mirrors linkedin.com/jobs search pills (segment group + dropdown pills + Clear filters).
 */
import { useEffect, useMemo, useState } from "react";
import "@/components/AttendanceList.css";
import {
  Avatar,
  Button,
  ClearFiltersLink,
  ConnectionBadge,
  FilterBar,
  FilterDropdown,
  LIST_PAGE_SIZE,
  Pagination,
  TextLink,
} from "@/components/linkedin";
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
};

const EMPTY_FILTERS: AttendeeFilters = {
  degree: null,
  location: null,
  company: null,
  industry: null,
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

function hasMutualEvents(attendee: AttendeeRow): boolean {
  return (attendee.mutualEvents?.length ?? 0) > 0;
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

export function AttendeeModal({
  open,
  onClose,
  attendees,
  eventId,
  eventName,
}: AttendeeModalProps) {
  const [filters, setFilters] = useState<AttendeeFilters>(EMPTY_FILTERS);
  const [chatAttendee, setChatAttendee] = useState<AttendeeRow | null>(null);
  const [page, setPage] = useState(1);

  const filterOptions = useMemo(() => ({
    locations: uniqueSorted(attendees.map((a) => a.location)),
    companies: uniqueSorted(attendees.map((a) => a.company)),
    industries: uniqueSorted(attendees.map((a) => a.industry)),
  }), [attendees]);

  const visibleAttendees = useMemo(() => {
    return attendees
      .filter((a) => {
        if (filters.degree && a.degree !== filters.degree) return false;
        if (filters.location && a.location !== filters.location) return false;
        if (filters.company && a.company !== filters.company) return false;
        if (filters.industry && a.industry !== filters.industry) return false;
        return true;
      })
      .sort((a, b) => {
        const aMutual = hasMutualEvents(a);
        const bMutual = hasMutualEvents(b);
        if (aMutual !== bMutual) return bMutual ? 1 : -1;
        return 0;
      });
  }, [attendees, filters]);

  const totalPages = Math.max(1, Math.ceil(visibleAttendees.length / LIST_PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageAttendees = useMemo(() => {
    const start = (page - 1) * LIST_PAGE_SIZE;
    return visibleAttendees.slice(start, start + LIST_PAGE_SIZE);
  }, [visibleAttendees, page]);

  function setFilter<K extends keyof AttendeeFilters>(key: K, value: AttendeeFilters[K]) {
    setFilters((f) => ({ ...f, [key]: value }));
  }

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <Modal open={open} onClose={onClose} title="Attendance List" wide>
      <div className="attendance-list">

        <FilterBar className="attendee-filter-bar">
          <div className="li-segment-group">
            {([1, 2, 3] as const).map((d) => (
              <Button
                key={d}
                variant="segment"
                active={filters.degree === d}
                onClick={() => setFilter("degree", filters.degree === d ? null : d)}
                aria-pressed={filters.degree === d}
              >
                {DEGREE_LABELS[d]}
              </Button>
            ))}
          </div>

          <span className="li-filter-bar__divider" aria-hidden />

          <FilterDropdown
            label="Location"
            options={filterOptions.locations}
            value={filters.location}
            onChange={(v) => setFilter("location", v)}
          />
          <FilterDropdown
            label="Current company"
            options={filterOptions.companies}
            value={filters.company}
            onChange={(v) => setFilter("company", v)}
          />
          <FilterDropdown
            label="Industry"
            options={filterOptions.industries}
            value={filters.industry}
            onChange={(v) => setFilter("industry", v)}
          />

          {hasActiveFilters && (
            <>
              <span className="li-filter-bar__divider" aria-hidden />
              <ClearFiltersLink onClick={() => setFilters(EMPTY_FILTERS)} />
            </>
          )}
        </FilterBar>

        <p className="attendee-result-count">
          {hasActiveFilters
            ? `${visibleAttendees.length} of ${attendees.length} attendees`
            : `${attendees.length} attendees`}
        </p>

        <div className="attendance-list__panel">
          <div className="attendance-list__scroll">
            <ul className="attendance-list__list">
              {pageAttendees.map((attendee) => (
                <li key={attendee.id} className="li-person-row">
                  <Avatar
                    alt={attendee.name}
                    src={attendee.profile_picture_url}
                    color={avatarColor(attendee.id)}
                  />
                  <div className="li-person-row__content">
                    <p className="li-person-row__name-row">
                      <span className="li-person-row__name">{attendee.name}</span>
                      <ConnectionBadge degree={attendee.degree} />
                    </p>
                    <p className="li-person-row__headline">{attendee.headline}</p>
                    {attendee.location && (
                      <p className="li-person-row__location">{attendee.location}</p>
                    )}
                    <AlsoAttendingEvents events={attendee.mutualEvents} />
                  </div>
                  <div className="li-person-row__actions">
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
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            aria-label="Attendee list pagination"
          />
        </div>
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

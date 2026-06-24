"use client";

/**
 * Guest list overlay — layout copied from linkedin.com/mynetwork/invite-connect/connections/
 */
import { useMemo, useState } from "react";
import "@/components/AttendanceList.css";
import {
  ActiveFilterTag,
  Avatar,
  Button,
  ClearFiltersLink,
  FilterBar,
  FilterDropdown,
  TextLink,
} from "@/components/linkedin";
import { Modal } from "@/components/linkedin/Modal";
import type { AttendeeRow } from "@/lib/eventTypes";

type AttendeeModalProps = {
  open: boolean;
  onClose: () => void;
  attendees: AttendeeRow[];
};

type AttendeeFilters = {
  location: string | null;
  company: string | null;
  industry: string | null;
};

const EMPTY_FILTERS: AttendeeFilters = {
  location: null,
  company: null,
  industry: null,
};

const AVATAR_COLORS = [
  "#0a66c2",
  "#b24592",
  "#c2410c",
  "#15803d",
  "#7c3aed",
  "#6b4c9a",
  "#5b7f95",
  "#8b6914",
  "#4a7c59",
  "#7a5c4f",
];

function avatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function uniqueSorted(values: (string | null | undefined)[]): string[] {
  return [...new Set(values.filter(Boolean) as string[])].sort((a, b) =>
    a.localeCompare(b),
  );
}

function AlsoAttendingEvents({
  events,
}: {
  events: Array<string | { id: string; name: string }>;
}) {
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
        <span className="li-person-row__meta-label li-person-row__meta-label--mutual">
          Also attending
        </span>
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
        aria-label={`Also attending ${normalizedEvents.length} events`}
        onClick={() => setExpanded((open) => !open)}
      >
        <span className="li-person-row__meta-label li-person-row__meta-label--mutual">
          Also attending
        </span>
        <span className="li-person-row__also-attending-count">
          {normalizedEvents.length} events
        </span>
        <span className="li-person-row__also-attending-chevron" aria-hidden>
          ▾
        </span>
      </button>
      {expanded && (
        <ul className="li-person-row__also-attending-menu">
          {normalizedEvents.map((event) => (
            <li key={event.id}>
              <TextLink href={event.href}>{event.name}</TextLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function AttendeeModal({ open, onClose, attendees }: AttendeeModalProps) {
  const [filters, setFilters] = useState<AttendeeFilters>(EMPTY_FILTERS);

  const filterOptions = useMemo(
    () => ({
      locations: uniqueSorted(attendees.map((attendee) => attendee.location)),
      companies: uniqueSorted(attendees.map((attendee) => attendee.company)),
      industries: uniqueSorted(attendees.map((attendee) => attendee.industry)),
    }),
    [attendees],
  );

  const activeFilters = useMemo(
    () =>
      (Object.entries(filters) as [keyof AttendeeFilters, string | null][])
        .filter(([, value]) => value)
        .map(([key, value]) => ({ key, label: value as string })),
    [filters],
  );

  const visibleAttendees = useMemo(() => {
    const list = attendees.filter((attendee) => {
      if (filters.location && attendee.location !== filters.location) return false;
      if (filters.company && attendee.company !== filters.company) return false;
      if (filters.industry && attendee.industry !== filters.industry) return false;
      return true;
    });
    return list.slice(0, 50);
  }, [attendees, filters]);

  function setFilter(key: keyof AttendeeFilters, value: string | null) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function clearFilter(key: keyof AttendeeFilters) {
    setFilter(key, null);
  }

  function clearAllFilters() {
    setFilters(EMPTY_FILTERS);
  }

  return (
    <Modal open={open} onClose={onClose} title="Attendance List" wide>
      <div className="attendance-list">
        <FilterBar className="attendance-list__filters">
          <FilterDropdown
            label="Location"
            options={filterOptions.locations}
            value={filters.location}
            onChange={(value) => setFilter("location", value)}
          />
          <FilterDropdown
            label="Company"
            options={filterOptions.companies}
            value={filters.company}
            onChange={(value) => setFilter("company", value)}
          />
          <FilterDropdown
            label="Industry"
            options={filterOptions.industries}
            value={filters.industry}
            onChange={(value) => setFilter("industry", value)}
          />

          {activeFilters.map(({ key, label }) => (
            <ActiveFilterTag
              key={`${key}-${label}`}
              label={label}
              onRemove={() => clearFilter(key)}
            />
          ))}

          {activeFilters.length > 0 && (
            <ClearFiltersLink onClick={clearAllFilters} />
          )}
        </FilterBar>

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
              <Button
                variant={attendee.nudged ? "success" : "secondary"}
                size="sm"
                className="li-person-row__action"
                disabled={attendee.nudged}
              >
                {attendee.nudged ? "Nudged ✓" : "Nudge"}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}

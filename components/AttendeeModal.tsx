"use client";

/**
 * Guest list overlay — mirrors the Attendance List page layout.
 * Wired to real event attendee data derived in server/lib/events.js, where each
 * attendee already carries a stable (hash-based "random") connection degree.
 */
import { useMemo, useState } from "react";
import "@/components/AttendanceList.css";
import {
  ActiveFilterTag,
  AllFiltersLink,
  Avatar,
  Button,
  ConnectionBadge,
  FilterBar,
  FilterDropdown,
  MessageIcon,
  SegmentGroup,
  TextLink,
} from "@/components/linkedin";
import { Modal } from "@/components/linkedin/Modal";
import { NudgeChat } from "@/components/NudgeChat";
import type { ConnectionDegree } from "@/components/linkedin";
import type { AttendeeRow } from "@/lib/eventTypes";

type AttendeeModalProps = {
  open: boolean;
  onClose: () => void;
  attendees: AttendeeRow[];
};

// Applied filter tags shown as removable chips below the connection-degree tabs.
const ACTIVE_FILTERS = [
  "Abingdon",
  "Computer Games",
  "Rice University",
  "SDE Intern",
];

type DegreeFilter = "1st" | "2nd" | "3rd+";

const CONNECTION_OPTIONS = [
  { value: "1st" as const, label: "1st" },
  { value: "2nd" as const, label: "2nd" },
  { value: "3rd+" as const, label: "3rd+" },
];

// Maps a segment value to the connection degree it shows.
const FILTER_TO_DEGREE: Record<DegreeFilter, ConnectionDegree> = {
  "1st": 1,
  "2nd": 2,
  "3rd+": 3,
};

// Stable avatar palette — picked deterministically from the attendee id so a
// given person always renders the same color.
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

export function AttendeeModal({ open, onClose, attendees }: AttendeeModalProps) {
  const [degreeFilter, setDegreeFilter] = useState<DegreeFilter | null>(null);
  // The attendee whose Nudge chat window is currently open, if any.
  const [chatAttendee, setChatAttendee] = useState<AttendeeRow | null>(null);

  // Clicking the active segment again clears the filter and shows everyone.
  function selectDegree(value: DegreeFilter) {
    setDegreeFilter((current) => (current === value ? null : value));
  }

  const visibleAttendees = useMemo(() => {
    const list = degreeFilter
      ? attendees.filter(
          (attendee) => attendee.degree === FILTER_TO_DEGREE[degreeFilter],
        )
      : attendees;
    // Cap the rendered rows so the dataset's hundreds of attendees stay snappy.
    return list.slice(0, 50);
  }, [attendees, degreeFilter]);

  return (
    <Modal open={open} onClose={onClose} title="Attendance List" wide>
      <div className="attendance-list">
        <FilterBar>
          <Button variant="pill-active">People</Button>

          <FilterDropdown label="Actively hiring" />
          <FilterDropdown label="Locations" />
          <FilterDropdown label="Current companies" />

          <SegmentGroup
            options={CONNECTION_OPTIONS}
            value={(degreeFilter ?? "") as DegreeFilter}
            onChange={selectDegree}
          />

          {ACTIVE_FILTERS.map((filter) => (
            <ActiveFilterTag key={filter} label={filter} />
          ))}

          <AllFiltersLink />
        </FilterBar>

        <ul>
          {visibleAttendees.map((attendee) => (
            <li key={attendee.id} className="attendance-list-row">
              <Avatar
                alt={attendee.name}
                src={attendee.profile_picture_url}
                color={avatarColor(attendee.id)}
              />
              <div className="attendance-list-content">
                <div className="attendance-list-name-row">
                  <span className="attendance-list-name">{attendee.name}</span>
                  <ConnectionBadge degree={attendee.degree} />
                </div>
                <p className="attendance-list-events">
                  {attendee.mutualEvents.length > 0 ? (
                    attendee.mutualEvents.map((event, index) => (
                      <span key={event.id}>
                        {index > 0 && ", "}
                        <TextLink href={`/events/${event.id}`}>
                          {event.name}
                        </TextLink>
                      </span>
                    ))
                  ) : (
                    <span>{attendee.headline}</span>
                  )}
                </p>
              </div>
              <Button
                variant="primary"
                className="attendance-list-nudge"
                icon={<MessageIcon className="li-btn-icon" />}
                onClick={() => setChatAttendee(attendee)}
              >
                Nudge
              </Button>
            </li>
          ))}
        </ul>
      </div>

      {chatAttendee && (
        <NudgeChat
          attendee={chatAttendee}
          onClose={() => setChatAttendee(null)}
        />
      )}
    </Modal>
  );
}

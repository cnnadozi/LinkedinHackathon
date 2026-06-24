"use client";

/**
 * Guest list overlay — mirrors the Attendance List page layout.
 */
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
import type { AttendeeRow } from "@/lib/eventTypes";

type AttendeeModalProps = {
  open: boolean;
  onClose: () => void;
  attendees: AttendeeRow[];
};

const ACTIVE_FILTERS = [
  "Abingdon",
  "Computer Games",
  "Rice University",
  "SDE Intern",
];

const CONNECTION_OPTIONS = [
  { value: "1st" as const, label: "1st" },
  { value: "2nd" as const, label: "2nd" },
  { value: "3rd+" as const, label: "3rd+" },
];

export function AttendeeModal({ open, onClose, attendees }: AttendeeModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Attendance List" wide>
      <div className="attendance-list">
        <FilterBar>
          <Button variant="pill-active">People</Button>

          <FilterDropdown label="Actively hiring" />
          <FilterDropdown label="Locations" />
          <FilterDropdown label="Current companies" />

          <SegmentGroup options={CONNECTION_OPTIONS} value="3rd+" />

          {ACTIVE_FILTERS.map((filter) => (
            <ActiveFilterTag key={filter} label={filter} />
          ))}

          <AllFiltersLink />
        </FilterBar>

        <ul>
          {attendees.map((attendee) => (
            <li key={attendee.id} className="attendance-list-row">
              <Avatar
                alt={attendee.name}
                src={attendee.profile_picture_url}
              />
              <div className="attendance-list-content">
                <div className="attendance-list-name-row">
                  <span className="attendance-list-name">{attendee.name}</span>
                  <ConnectionBadge degree={attendee.degree} />
                </div>
                <p className="attendance-list-events">
                  {attendee.mutualEvents.length > 0 ? (
                    attendee.mutualEvents.map((event, index) => (
                      <span key={event}>
                        {index > 0 && ", "}
                        <TextLink href="#">{event}</TextLink>
                      </span>
                    ))
                  ) : (
                    <span>{attendee.headline}</span>
                  )}
                </p>
              </div>
              <Button
                variant={attendee.nudged ? "success" : "primary"}
                className="attendance-list-nudge"
                icon={<MessageIcon className="li-btn-icon" />}
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

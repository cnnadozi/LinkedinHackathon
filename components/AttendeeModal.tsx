"use client";

/**
 * Guest list overlay — mirrors the Attendance List page layout.
 * Data is hardcoded for now; will be wired to event attendance later.
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
import type { ConnectionDegree } from "@/components/linkedin";

type AttendeeModalProps = {
  open: boolean;
  onClose: () => void;
};

type Attendee = {
  id: string;
  name: string;
  connectionDegree: ConnectionDegree;
  avatarColor?: string;
  events: string[];
};

// Applied filter tags shown as removable chips below the connection-degree tabs.
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

const ATTENDEES: Attendee[] = [
  {
    id: "1",
    name: "Cedric Wilson, LPC, NCC",
    connectionDegree: 3,
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
    connectionDegree: 3,
    avatarColor: "#5b7f95",
    events: ["Data Science Networking Night", "Resume & LinkedIn Review Clinic"],
  },
  {
    id: "3",
    name: "Garrett Louthen",
    connectionDegree: 3,
    avatarColor: "#8b6914",
    events: ["Product Management Career Workshop"],
  },
  {
    id: "4",
    name: "Cody A. J.",
    connectionDegree: 3,
    avatarColor: "#4a7c59",
    events: [
      "Resume & LinkedIn Review Clinic",
      "Tech Industry Alumni Panel Discussion",
    ],
  },
  {
    id: "5",
    name: "Kevin R. Stovall",
    connectionDegree: 3,
    avatarColor: "#7a5c4f",
    events: ["Data Science Networking Night"],
  },
];

export function AttendeeModal({ open, onClose }: AttendeeModalProps) {
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
          {ATTENDEES.map((attendee) => (
            <li key={attendee.id} className="attendance-list-row">
              <Avatar alt={attendee.name} color={attendee.avatarColor} />
              <div className="attendance-list-content">
                <div className="attendance-list-name-row">
                  <span className="attendance-list-name">{attendee.name}</span>
                  <ConnectionBadge degree={attendee.connectionDegree} />
                </div>
                <p className="attendance-list-events">
                  {attendee.events.map((event, index) => (
                    <span key={event}>
                      {index > 0 && ", "}
                      <TextLink href="#">{event}</TextLink>
                    </span>
                  ))}
                </p>
              </div>
              <Button
                variant="primary"
                className="attendance-list-nudge"
                icon={<MessageIcon className="li-btn-icon" />}
              >
                Nudge
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}

"use client";

import "@/components/AttendanceList.css";
import {
  ActiveFilterTag,
  AllFiltersLink,
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardSection,
  CardTitle,
  ConnectionBadge,
  FilterBar,
  FilterDropdown,
  MessageIcon,
  SegmentGroup,
  TextLink,
} from "@/components/linkedin";
import type { ConnectionDegree } from "@/components/linkedin";

type Attendee = {
  id: string;
  name: string;
  connectionDegree: ConnectionDegree;
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

const CONNECTION_OPTIONS = [
  { value: "1st" as const, label: "1st" },
  { value: "2nd" as const, label: "2nd" },
  { value: "3rd+" as const, label: "3rd+" },
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

export default function AttendanceList() {
  return (
    <Card className="attendance-list">
      <CardHeader>
        <CardTitle>Attendance List</CardTitle>
      </CardHeader>

      <CardSection>
        <FilterBar>
          <Button variant="pill-active">People</Button>

          <FilterDropdown label="Actively hiring" />
          <FilterDropdown label="Locations" />
          <FilterDropdown label="Current companies" />

          <SegmentGroup
            options={CONNECTION_OPTIONS}
            value="3rd+"
          />

          {ACTIVE_FILTERS.map((filter) => (
            <ActiveFilterTag key={filter} label={filter} />
          ))}

          <AllFiltersLink />
        </FilterBar>
      </CardSection>

      <CardBody>
        {ATTENDEES.map((attendee) => (
          <li key={attendee.id} className="attendance-list-row">
            <Avatar
              name={attendee.name}
              src={attendee.avatarUrl}
              color={attendee.avatarColor}
            />
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
      </CardBody>
    </Card>
  );
}

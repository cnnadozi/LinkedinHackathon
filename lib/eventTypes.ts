import type { Event } from "@/types/event";

export type EventHost = {
  id: string;
  name: string;
  headline: string;
  profile_picture_url: string;
};

export type AttendanceSummary = {
  total: number;
  connectionsCount: number;
  previewAvatars: { alt: string; src: string }[];
  connectionPreview: { id: string; alt: string; src: string }[];
};

export type AttendeeRow = {
  id: string;
  name: string;
  headline: string;
  profile_picture_url: string;
  degree: 1 | 2 | 3;
  isConnection: boolean;
  mutualEvents: string[];
  nudged: boolean;
};

export type EventDetailPayload = {
  event: Event;
  host: EventHost | null;
  attendance: AttendanceSummary;
  attendees: AttendeeRow[];
  rsvpd: boolean;
};

export type RsvpEventSummary = {
  id: string;
  name: string;
  time: string;
  location: string;
  industry: string;
};

export type ConnectionSuggestions = {
  targetUser: EventHost;
  sharedThemes: string[];
  sharedSkills: string[];
  sharedSchools: string[];
  mutualEvents: RsvpEventSummary[];
  talkingPoints: string[];
};

"use client";

/**
 * LinkedIn-style event detail — hero card, action row, tabs, and attendee modal.
 * Layout mirrors linkedin.com/events/* with hackathon attendee enhancements.
 */
import { useState } from "react";
import { AttendeeModal } from "./AttendeeModal";
import { EventDetailSidebar } from "./EventDetailSidebar";
import {
  Avatar,
  AvatarButton,
  Badge,
  Button,
  Card,
  IconButton,
  Tabs,
  TextButton,
} from "@/components/linkedin";
import { eventBannerClass, formatEventDate } from "@/lib/formatEventDate";
import { toggleEventRsvp } from "@/lib/eventActions";
import type { EventDetailPayload } from "@/lib/eventTypes";
import type { Event } from "@/types/event";

type EventDetailProps = {
  data: EventDetailPayload;
  relatedEvents: Event[];
};

const EVENT_TABS = [
  { value: "details" as const, label: "Details" },
  { value: "comments" as const, label: "Comments" },
];

export function EventDetail({ data, relatedEvents }: EventDetailProps) {
  const [rsvpd, setRsvpd] = useState(data.rsvpd);
  const [attendeeCount, setAttendeeCount] = useState(data.attendance.total);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<(typeof EVENT_TABS)[number]["value"]>(
    "details",
  );

  const { event, host, attendance } = data;
  const { scheduleLabel } = formatEventDate(event.time);
  const bannerClass = eventBannerClass(event.industry);
  const organizerName = host?.name ?? event.company;

  async function handleRsvp() {
    setRsvpLoading(true);
    const result = await toggleEventRsvp(event.id);
    if (result) {
      setAttendeeCount((c) => c + (result.rsvpd ? 1 : -1));
      setRsvpd(result.rsvpd);
    }
    setRsvpLoading(false);
  }

  function openAttendeeModal() {
    setModalOpen(true);
  }

  return (
    <div className="event-page">
      <div className="event-page__layout">
        <div className="event-page__main">
          <Card padding="sm" className="event-detail-card">
            <div className={`event-detail__banner ${bannerClass}`}>
              <div className="event-detail__banner-overlay">
                <Badge variant="live" className="event-detail__live-badge">
                  Upcoming event
                </Badge>
                <p className="event-detail__banner-title">{event.name}</p>
              </div>
            </div>

            <div className="event-detail__body">
              <h1 className="event-detail__title">{event.name}</h1>

              <p className="event-detail__byline">
                Event by{" "}
                <TextButton variant="primary">{organizerName}</TextButton>
              </p>

              <p className="event-detail__schedule">{scheduleLabel}</p>
              <p className="event-detail__location">{event.location}</p>

              <p className="event-detail__attendance-line">
                <TextButton variant="default" onClick={openAttendeeModal}>
                  {attendeeCount.toLocaleString()} attendees
                  {attendance.connectionsCount > 0 &&
                    ` · ${attendance.connectionsCount} connections`}
                </TextButton>
              </p>

              {attendance.connectionPreview.length > 0 && (
                <div className="event-detail__connections-strip">
                  {attendance.connectionPreview.map((connection) => (
                    <AvatarButton
                      key={connection.id}
                      aria-label={`View ${connection.alt} in attendee list`}
                      onClick={openAttendeeModal}
                    >
                      <Avatar
                        alt={connection.alt}
                        src={connection.src}
                        size="sm"
                      />
                    </AvatarButton>
                  ))}
                </div>
              )}

              <div className="event-detail__actions">
                <Button
                  variant={rsvpd ? "secondary" : "primary"}
                  size="md"
                  disabled={rsvpLoading}
                  onClick={handleRsvp}
                >
                  {rsvpd ? "Attending ✓" : "Attend"}
                </Button>
                <Button variant="secondary" size="md">
                  Share
                </Button>
                <IconButton aria-label="More actions">•••</IconButton>
              </div>

              <Tabs
                options={EVENT_TABS}
                value={activeTab}
                onChange={setActiveTab}
                aria-label="Event sections"
                className="event-detail__tabs"
              />

              {activeTab === "details" ? (
                <article className="event-detail__post">
                  <header className="event-detail__post-header">
                    {host && (
                      <Avatar
                        alt={host.name}
                        src={host.profile_picture_url}
                        size="md"
                      />
                    )}
                    <div className="event-detail__post-meta">
                      <p className="event-detail__post-author">{organizerName}</p>
                      <p className="event-detail__post-subtitle">
                        {event.company} · {event.industry}
                      </p>
                    </div>
                    <Button variant="secondary" size="sm">
                      + Follow
                    </Button>
                  </header>
                  <p className="event-detail__description">{event.description}</p>
                  <p className="event-detail__post-stats">
                    136 reactions · 35 comments · 39 reposts
                  </p>
                </article>
              ) : (
                <p className="event-detail__comments-empty">
                  Comments are not available in this demo.
                </p>
              )}
            </div>
          </Card>
        </div>

        <EventDetailSidebar relatedEvents={relatedEvents} />
      </div>

      <AttendeeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        attendees={data.attendees}
      />
    </div>
  );
}

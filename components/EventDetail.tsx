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

const ABOUT_PREVIEW_LENGTH = 280;

function truncateDescription(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const slice = text.slice(0, maxLength);
  const lastSpace = slice.lastIndexOf(" ");
  return lastSpace > 0 ? slice.slice(0, lastSpace) : slice;
}

function EventAbout({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);
  const shouldTruncate = description.length > ABOUT_PREVIEW_LENGTH;
  const preview = truncateDescription(description, ABOUT_PREVIEW_LENGTH);

  return (
    <section className="event-detail__about" aria-labelledby="event-about-heading">
      <h2 id="event-about-heading" className="event-detail__about-title">
        About
      </h2>
      <p className="event-detail__about-text">
        {expanded || !shouldTruncate ? description : preview}
        {shouldTruncate && !expanded && (
          <>
            {" … "}
            <TextButton
              variant="primary"
              className="event-detail__about-toggle"
              onClick={() => setExpanded(true)}
            >
              See more
            </TextButton>
          </>
        )}
      </p>
      {shouldTruncate && expanded && (
        <TextButton
          variant="primary"
          className="event-detail__about-toggle event-detail__about-toggle--less"
          onClick={() => setExpanded(false)}
        >
          See less
        </TextButton>
      )}
    </section>
  );
}

export function EventDetail({ data, relatedEvents }: EventDetailProps) {
  const [rsvpd, setRsvpd] = useState(data.rsvpd);
  const [attendeeCount, setAttendeeCount] = useState(data.attendance.total);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

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

              <EventAbout description={event.description} />
            </div>
          </Card>
        </div>

        <EventDetailSidebar relatedEvents={relatedEvents} />
      </div>

      <AttendeeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        attendees={data.attendees}
        eventId={event.id}
        eventName={event.name}
      />
    </div>
  );
}

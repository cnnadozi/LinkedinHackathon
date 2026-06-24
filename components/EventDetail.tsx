"use client";

/**
 * LinkedIn-style event detail — hero card, action row, tabs, and attendee modal.
 * Layout mirrors linkedin.com/events/* with hackathon attendee enhancements.
 */
import { useState } from "react";
import { AttendeeModal } from "./AttendeeModal";
import { EventDetailSidebar } from "./EventDetailSidebar";
import { Avatar } from "./linkedin/Avatar";
import { Button } from "./linkedin/Button";
import { Card } from "./linkedin/Card";
import { eventBannerClass, formatEventDate } from "@/lib/formatEventDate";
import { toggleEventRsvp } from "@/lib/eventActions";
import type { EventDetailPayload } from "@/lib/eventTypes";
import type { Event } from "@/types/event";

type EventDetailProps = {
  data: EventDetailPayload;
  relatedEvents: Event[];
};

type ModalFilter = "all" | "connections";
type EventTab = "details" | "comments";

export function EventDetail({ data, relatedEvents }: EventDetailProps) {
  const [rsvpd, setRsvpd] = useState(data.rsvpd);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFilter, setModalFilter] = useState<ModalFilter>("all");
  const [activeTab, setActiveTab] = useState<EventTab>("details");

  const { event, host, attendance } = data;
  const { scheduleLabel } = formatEventDate(event.time);
  const bannerClass = eventBannerClass(event.industry);
  const organizerName = host?.name ?? event.company;

  async function handleRsvp() {
    setRsvpLoading(true);
    const result = await toggleEventRsvp(event.id);
    if (result) setRsvpd(result.rsvpd);
    setRsvpLoading(false);
  }

  function openAttendeeModal(filter: ModalFilter) {
    setModalFilter(filter);
    setModalOpen(true);
  }

  return (
    <div className="event-page">
      <div className="event-page__layout">
        <div className="event-page__main">
          <Card padding="sm" className="event-detail-card">
            <div className={`event-detail__banner ${bannerClass}`}>
              <div className="event-detail__banner-overlay">
                <span className="event-detail__live-badge">Upcoming event</span>
                <p className="event-detail__banner-title">{event.name}</p>
              </div>
            </div>

            <div className="event-detail__body">
              <h1 className="event-detail__title">{event.name}</h1>

              <p className="event-detail__byline">
                Event by{" "}
                <button type="button" className="event-detail__byline-link">
                  {organizerName}
                </button>
              </p>

              <p className="event-detail__schedule">{scheduleLabel}</p>
              <p className="event-detail__location">{event.location}</p>

              <p className="event-detail__attendance-line">
                <button
                  type="button"
                  className="event-detail__attendance-link"
                  onClick={() => openAttendeeModal("all")}
                >
                  {attendance.total.toLocaleString()} attendees
                </button>
                {attendance.connectionsCount > 0 && (
                  <>
                    ,{" "}
                    <button
                      type="button"
                      className="event-detail__connections-link"
                      onClick={() => openAttendeeModal("connections")}
                    >
                      {attendance.connectionsCount} connections
                    </button>
                  </>
                )}
              </p>

              {attendance.connectionPreview.length > 0 && (
                <div className="event-detail__connections-strip">
                  {attendance.connectionPreview.map((connection) => (
                    <button
                      key={connection.id}
                      type="button"
                      className="event-detail__connection-avatar"
                      aria-label={`View ${connection.alt} in attendee list`}
                      onClick={() => openAttendeeModal("connections")}
                    >
                      <Avatar alt={connection.alt} size="sm" />
                    </button>
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
                  <span aria-hidden> ▾</span>
                </Button>
                <button
                  type="button"
                  className="event-detail__more"
                  aria-label="More actions"
                >
                  •••
                </button>
              </div>

              <div className="event-detail__tabs" role="tablist" aria-label="Event sections">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "details"}
                  className={`event-detail__tab${
                    activeTab === "details" ? " event-detail__tab--active" : ""
                  }`}
                  onClick={() => setActiveTab("details")}
                >
                  Details
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === "comments"}
                  className={`event-detail__tab${
                    activeTab === "comments" ? " event-detail__tab--active" : ""
                  }`}
                  onClick={() => setActiveTab("comments")}
                >
                  Comments
                </button>
              </div>

              {activeTab === "details" ? (
                <article className="event-detail__post">
                  <header className="event-detail__post-header">
                    {host && <Avatar alt={host.name} size="md" />}
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
        eventId={event.id}
        attendees={data.attendees}
        initialFilter={modalFilter}
      />
    </div>
  );
}

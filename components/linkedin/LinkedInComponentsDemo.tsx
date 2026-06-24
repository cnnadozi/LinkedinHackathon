"use client";

import { useState } from "react";
import {
  Avatar,
  AvatarStack,
  Button,
  Card,
  ConnectionBadge,
  FilterChips,
  Modal,
  SearchInput,
  TextArea,
  TextInput,
} from "@/components/linkedin";

const DEMO_AVATARS = [
  { alt: "Alex Chen" },
  { alt: "Jordan Lee" },
  { alt: "Sam Patel" },
  { alt: "Taylor Kim" },
  { alt: "Morgan Davis" },
];

const FILTER_CHIPS = [
  { id: "connections", label: "Connections" },
  { id: "1st", label: "1st degree" },
  { id: "2nd", label: "2nd degree" },
  { id: "same-school", label: "Same school" },
];

const ATTENDEES = [
  { name: "Alex Chen", title: "Software Engineer at Stripe", degree: 1 as const },
  { name: "Jordan Lee", title: "Product Manager at LinkedIn", degree: 2 as const },
  { name: "Sam Patel", title: "Designer at Figma", degree: 3 as const },
];

const SUGGESTED_MESSAGE =
  "I saw you're also attending the networking event — would love to connect beforehand!";

export function LinkedInComponentsDemo() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>(["connections"]);
  const [nudged, setNudged] = useState<Record<string, boolean>>({});
  const [attendeeSearch, setAttendeeSearch] = useState("");
  const [message, setMessage] = useState("");

  function toggleFilter(id: string) {
    setActiveFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  }

  const filteredAttendees = ATTENDEES.filter((attendee) => {
    if (!attendeeSearch.trim()) return true;
    const query = attendeeSearch.toLowerCase();
    return (
      attendee.name.toLowerCase().includes(query) ||
      attendee.title.toLowerCase().includes(query)
    );
  });

  return (
    <div className="dev-showcase">
      <h1 className="dev-showcase__title">LinkedIn Components</h1>
      <p className="dev-showcase__subtitle">
        Primitive UI building blocks for the Events Hub demo.
      </p>

      <section className="dev-showcase__section">
        <h2 className="dev-showcase__section-title">Avatar</h2>
        <div className="dev-showcase__row">
          <Avatar alt="Alex Chen" size="sm" />
          <Avatar alt="Jordan Lee" size="md" />
          <Avatar alt="Sam Patel" size="lg" />
        </div>
      </section>

      <section className="dev-showcase__section">
        <h2 className="dev-showcase__section-title">Avatar stack</h2>
        <AvatarStack avatars={DEMO_AVATARS} max={3} />
      </section>

      <section className="dev-showcase__section">
        <h2 className="dev-showcase__section-title">Buttons</h2>
        <div className="dev-showcase__row">
          <Button variant="primary">RSVP</Button>
          <Button variant="secondary">Share</Button>
          <Button variant="ghost">Cancel</Button>
          <Button variant="success">Nudged ✓</Button>
          <Button variant="primary" size="sm">
            Small
          </Button>
        </div>
      </section>

      <section className="dev-showcase__section">
        <h2 className="dev-showcase__section-title">Text input</h2>
        <TextInput placeholder="Event title" fullWidth />
      </section>

      <section className="dev-showcase__section">
        <h2 className="dev-showcase__section-title">Search input</h2>
        <SearchInput
          placeholder="Search attendees by name, title, or company"
          value={attendeeSearch}
          onChange={(event) => setAttendeeSearch(event.target.value)}
          onClear={() => setAttendeeSearch("")}
        />
      </section>

      <section className="dev-showcase__section">
        <h2 className="dev-showcase__section-title">Message compose</h2>
        <div className="li-compose">
          <TextArea
            placeholder="Write a message…"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={3}
          />
          <div className="li-compose__footer">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMessage(SUGGESTED_MESSAGE)}
            >
              Use suggested opener
            </Button>
            <Button variant="primary" size="sm" disabled={!message.trim()}>
              Send
            </Button>
          </div>
        </div>
      </section>

      <section className="dev-showcase__section">
        <h2 className="dev-showcase__section-title">Card</h2>
        <Card>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
            Possibilities in Tech 2026
          </h3>
          <p style={{ fontSize: 14, color: "var(--li-gray-medium)" }}>
            Thu, Jun 26 · San Francisco, CA · 248 attending
          </p>
        </Card>
      </section>

      <section className="dev-showcase__section">
        <h2 className="dev-showcase__section-title">Connection badge</h2>
        <div className="dev-showcase__row">
          <ConnectionBadge degree={1} />
          <ConnectionBadge degree={2} />
          <ConnectionBadge degree={3} />
        </div>
      </section>

      <section className="dev-showcase__section">
        <h2 className="dev-showcase__section-title">Filter chips</h2>
        <FilterChips
          chips={FILTER_CHIPS}
          activeIds={activeFilters}
          onToggle={toggleFilter}
          onClear={() => setActiveFilters([])}
        />
      </section>

      <section className="dev-showcase__section">
        <h2 className="dev-showcase__section-title">Modal</h2>
        <Button variant="secondary" onClick={() => setModalOpen(true)}>
          Open attendee modal
        </Button>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="248 attending"
        >
          <SearchInput
            placeholder="Search attendees by name, title, or company"
            value={attendeeSearch}
            onChange={(event) => setAttendeeSearch(event.target.value)}
            onClear={() => setAttendeeSearch("")}
          />
          <div style={{ marginTop: 12 }}>
            <FilterChips
              chips={FILTER_CHIPS}
              activeIds={activeFilters}
              onToggle={toggleFilter}
              onClear={() => setActiveFilters([])}
            />
          </div>
          <div style={{ marginTop: 16 }}>
            {filteredAttendees.map((attendee) => (
              <div key={attendee.name} className="dev-showcase__attendee-row">
                <Avatar alt={attendee.name} size="md" />
                <div className="dev-showcase__attendee-info">
                  <div className="dev-showcase__attendee-name">
                    {attendee.name}
                    <ConnectionBadge degree={attendee.degree} />
                  </div>
                  <div className="dev-showcase__attendee-meta">
                    {attendee.title}
                  </div>
                </div>
                {nudged[attendee.name] ? (
                  <Button variant="success" size="sm" disabled>
                    Nudged ✓
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() =>
                      setNudged((prev) => ({ ...prev, [attendee.name]: true }))
                    }
                  >
                    Nudge
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Modal>
      </section>
    </div>
  );
}

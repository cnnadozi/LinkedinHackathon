# UI / UX examples — LinkedIn Events Hub

## Thin component + globals.css styles

```tsx
// components/linkedin/Button.tsx — markup only
export function Button({ variant = "primary", size = "md", className = "", ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={["li-btn", `li-btn--${variant}`, `li-btn--${size}`, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
```

```css
/* app/globals.css — styles live here */
.li-btn--primary {
  background: var(--li-blue-interactive);
  color: var(--li-surface);
}
.li-btn--primary:hover:not(:disabled) {
  background: var(--li-blue-hover);
}
```

## Feature component composing primitives

```tsx
// components/EventCard.tsx
import Link from "next/link";
import { Card } from "./linkedin/Card";
import { AvatarStack } from "./linkedin/AvatarStack";

export function EventCard({ event }: { event: Event }) {
  return (
    <Link href={`/events/${event.id}`} className="event-card-link">
      <Card padding="md">
        <h3 className="event-card__title">{event.title}</h3>
        <p className="event-card__meta">{event.dateLabel} · {event.location}</p>
        <AvatarStack avatars={event.attendeePreview} max={3} />
      </Card>
    </Link>
  );
}
```

Add `.event-card-*` layout rules to `globals.css` — not inline styles.

## Overlay using Modal primitive

```tsx
// components/AttendeeModal.tsx
"use client";

import { Modal } from "./linkedin/Modal";
import { FilterChips } from "./linkedin/FilterChips";
import { Button } from "./linkedin/Button";

export function AttendeeModal({ open, onClose, attendees }: AttendeeModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Attendees" wide>
      <FilterChips filters={filters} active={activeFilter} onChange={setActiveFilter} />
      <ul className="attendee-list">
        {attendees.map((person) => (
          <li key={person.id} className="attendee-row">
            {/* Avatar, name, ConnectionBadge */}
            <Button
              variant={person.nudged ? "success" : "primary"}
              size="sm"
              onClick={() => handleNudge(person.id)}
              disabled={person.nudged}
            >
              {person.nudged ? "Nudged ✓" : "Nudge"}
            </Button>
          </li>
        ))}
      </ul>
    </Modal>
  );
}
```

## Page layout inside AppShell

```tsx
// app/events/[eventId]/page.tsx
import { EventDetail } from "@/components/EventDetail";

export default async function EventPage({ params }: { params: { eventId: string } }) {
  return (
    <main className="page page--event-detail">
      <EventDetail eventId={params.eventId} />
    </main>
  );
}
```

```css
/* globals.css */
.page {
  max-width: var(--li-max-width);
  margin: 0 auto;
  padding: 24px 24px 48px;
}
```

## Accessible focus styling

```css
.li-btn:focus-visible,
.li-filter-chips__chip:focus-visible {
  outline: 2px solid var(--li-blue-interactive);
  outline-offset: 2px;
}
```

## When to extend globals.css vs create a primitive

| Situation | Action |
|-----------|--------|
| Styling a `Button` variant used once | Add `.li-btn--*` in globals.css |
| Attendee row layout used only in modal | Add `.attendee-row` in globals.css |
| Reusable search input on 2+ screens | Add `components/linkedin/SearchInput.tsx` + `.li-search-input` |

## Bad vs good

```tsx
// Bad — hardcoded colors, reinventing a button
<button style={{ backgroundColor: "#0A66C2", borderRadius: 24, padding: "6px 16px" }}>
  RSVP
</button>

// Good
<Button variant="primary">RSVP</Button>
```

```tsx
// Bad — new route for overlay content
// app/calendar/page.tsx

// Good — overlay toggled from nav state in AppShell
<CalendarOverlay open={calendarOpen} onClose={() => setCalendarOpen(false)} />
```

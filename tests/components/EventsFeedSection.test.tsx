import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { EventsFeedSection } from "@/components/EventsFeedSection";
import type { Event } from "@/types/event";

const events: Event[] = [
  {
    id: "event_0001",
    name: "Event One",
    location: "Boston, MA",
    time: "2026-04-05T19:00:00.000Z",
    description: "First event",
    host_user_id: "user_1",
    industry: "Education",
    company: "Acme",
  },
  {
    id: "event_0002",
    name: "Event Two",
    location: "Seattle, WA",
    time: "2026-04-25T19:00:00.000Z",
    description: "Second event",
    host_user_id: "user_2",
    industry: "Technology",
    company: "Beta Co",
  },
  {
    id: "event_0003",
    name: "Event Three",
    location: "Austin, TX",
    time: "2026-06-29T20:30:00.000Z",
    description: "Third event",
    host_user_id: "user_3",
    industry: "Healthcare",
    company: "Gamma LLC",
  },
];

describe("EventsFeedSection", () => {
  it("shows all events by default", () => {
    render(
      <EventsFeedSection
        events={events}
        mainUserAttendingEventIds={["event_0002", "event_0003"]}
      />,
    );

    expect(screen.getByText("3 results")).toBeInTheDocument();
    expect(screen.getByText("Event One")).toBeInTheDocument();
    expect(screen.getByText("Event Two")).toBeInTheDocument();
    expect(screen.getByText("Event Three")).toBeInTheDocument();
  });

  it("filters to events the main user is attending", async () => {
    const user = userEvent.setup();
    render(
      <EventsFeedSection
        events={events}
        mainUserAttendingEventIds={["event_0002", "event_0003"]}
      />,
    );

    await user.selectOptions(screen.getByLabelText("Filter events"), "attending");

    expect(screen.getByText("2 results")).toBeInTheDocument();
    expect(screen.queryByText("Event One")).not.toBeInTheDocument();
    expect(screen.getByText("Event Two")).toBeInTheDocument();
    expect(screen.getByText("Event Three")).toBeInTheDocument();
    expect(
      document.querySelector(".events-feed-filter-pill")?.textContent,
    ).toContain("Attending");
  });
});

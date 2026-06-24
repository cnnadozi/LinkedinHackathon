import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EventDetailSidebar } from "@/components/EventDetailSidebar";
import type { Event } from "@/types/event";

const mockRelatedEvents: Event[] = [
  {
    id: "event_0002",
    name: "Breaking Into HR Coordinator Roles",
    location: "Seattle, WA",
    time: "2026-04-25T19:00:00.000Z",
    description: "An evening for Education talent in Seattle, WA.",
    host_user_id: "user_5736",
    industry: "Education",
    company: "AI Dynamics",
  },
  {
    id: "event_0003",
    name: "Breaking Into Sales Representative Roles",
    location: "Austin, TX",
    time: "2026-06-29T20:30:00.000Z",
    description: "Join a local Technology community meetup in Austin, TX.",
    host_user_id: "user_8816",
    industry: "Technology",
    company: "Tech Innovators Inc.",
  },
];

describe("EventDetailSidebar", () => {
  it("renders related events with thumbnails and organizer names", () => {
    render(<EventDetailSidebar relatedEvents={mockRelatedEvents} />);

    expect(
      screen.getByRole("heading", { name: "Other events for you" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "See all" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(
      screen.getByRole("link", {
        name: /Breaking Into HR Coordinator Roles/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("AI Dynamics")).toBeInTheDocument();
    expect(document.querySelectorAll(".event-sidebar__thumb")).toHaveLength(2);
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EventDetail } from "@/components/EventDetail";
import type { EventDetailPayload } from "@/lib/eventTypes";

vi.mock("@/lib/eventActions", () => ({
  toggleEventRsvp: vi.fn().mockResolvedValue({ rsvpd: true }),
  recordEventNudge: vi.fn().mockResolvedValue({ nudged: true }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const mockData: EventDetailPayload = {
  event: {
    id: "event_0001",
    name: "Breaking Into DevOps Engineer Roles",
    location: "Boston, MA",
    time: "2026-04-05T19:00:00.000Z",
    description: "Join a local Education community meetup in Boston, MA.",
    host_user_id: "user_4579",
    industry: "Education",
    company: "Global Solutions LLC",
  },
  host: {
    id: "user_4579",
    name: "Bob Smith",
    headline: "DevOps Engineer at Global Solutions LLC",
    profile_picture_url: "https://i.pravatar.cc/150?u=user_4579",
  },
  attendance: {
    total: 248,
    connectionsCount: 12,
    previewAvatars: [
      { alt: "Alice", src: "https://i.pravatar.cc/150?u=user_1" },
      { alt: "Ben", src: "https://i.pravatar.cc/150?u=user_2" },
      { alt: "Carol", src: "https://i.pravatar.cc/150?u=user_3" },
    ],
    connectionPreview: [
      {
        id: "user_1",
        alt: "Alice",
        src: "https://i.pravatar.cc/150?u=user_1",
      },
    ],
  },
  attendees: [
    {
      id: "user_1",
      name: "Alice Example",
      headline: "Engineer at Example Co",
      profile_picture_url: "https://i.pravatar.cc/150?u=user_1",
      location: "Boston, MA",
      company: "Example Co",
      industry: "Education",
      school: "Example University",
      skills: ["Teaching"],
      degree: 1,
      isConnection: true,
      mutualEvents: [{ id: "event_0009", name: "Tech Mixer" }],
      nudged: false,
    },
  ],
  rsvpd: false,
};

const mockRelatedEvents = [
  {
    id: "event_0002",
    name: "Another Event",
    location: "Seattle, WA",
    time: "2026-04-25T19:00:00.000Z",
    description: "Another event description.",
    host_user_id: "user_5736",
    industry: "Education",
    company: "AI Dynamics",
  },
];

describe("EventDetail", () => {
  it("renders event title, About section, and attendance links", () => {
    render(<EventDetail data={mockData} relatedEvents={mockRelatedEvents} />);

    expect(
      screen.getByRole("heading", {
        name: "Breaking Into DevOps Engineer Roles",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "About" })).toBeInTheDocument();
    expect(
      screen.getByText(/Join a local Education community meetup/),
    ).toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "Comments" })).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "248 attendees · 12 connections" }),
    ).toBeInTheDocument();
  });

  it("expands long descriptions with See more", async () => {
    const user = userEvent.setup();
    const longDescription = `${"Word ".repeat(80)}end.`;
    const longData: EventDetailPayload = {
      ...mockData,
      event: { ...mockData.event, description: longDescription },
    };

    render(<EventDetail data={longData} relatedEvents={mockRelatedEvents} />);

    expect(screen.queryByText(longDescription)).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "See more" }));
    expect(screen.getByText(longDescription)).toBeInTheDocument();
  });

  it("opens the attendee modal when attendance count is clicked", async () => {
    const user = userEvent.setup();
    render(<EventDetail data={mockData} relatedEvents={mockRelatedEvents} />);

    await user.click(
      screen.getByRole("button", { name: "248 attendees · 12 connections" }),
    );

    expect(
      screen.getByRole("dialog", { name: "Attendance List" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Alice Example")).toBeInTheDocument();
  });
});

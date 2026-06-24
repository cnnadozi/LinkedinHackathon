import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NudgeChat } from "@/components/NudgeChat";
import type { AttendeeRow } from "@/lib/eventTypes";

const attendee: AttendeeRow = {
  id: "user_1",
  name: "Bob Smith",
  headline: "Marketing Specialist at Innovatech",
  profile_picture_url: "https://i.pravatar.cc/150?u=user_1",
  location: "San Francisco, CA",
  company: "Innovatech",
  industry: "Technology",
  school: "University of California, Berkeley",
  skills: ["Marketing"],
  degree: 3,
  isConnection: false,
  mutualEvents: [],
  nudged: false,
};

describe("NudgeChat", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          sharedThemes: [],
          mutualEvents: [],
          talkingPoints: ["Ask about Innovatech."],
        }),
      }),
    );
  });

  it("renders the compact docked chat with recipient info in the header", () => {
    render(
      <NudgeChat
        attendee={attendee}
        eventId="event_0060"
        eventName="Technology Professionals Mixer"
        onClose={() => {}}
      />,
    );

    expect(
      screen.getByRole("dialog", { name: "Message Bob Smith" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Bob Smith")).toBeInTheDocument();
    expect(
      screen.getByText("Marketing Specialist at Innovatech"),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "New message" }),
    ).not.toBeInTheDocument();
  });

  it("expands into the LinkedIn-style compose layout", async () => {
    const user = userEvent.setup();
    render(
      <NudgeChat
        attendee={attendee}
        eventId="event_0060"
        eventName="Technology Professionals Mixer"
        onClose={() => {}}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Expand message window" }),
    );

    expect(
      screen.getByRole("heading", { name: "New message" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Collapse message window" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("closes when the close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <NudgeChat
        attendee={attendee}
        eventId="event_0060"
        eventName="Technology Professionals Mixer"
        onClose={onClose}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Close conversation" }),
    );

    expect(onClose).toHaveBeenCalledOnce();
  });
});

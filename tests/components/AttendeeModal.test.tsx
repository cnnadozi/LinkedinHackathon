import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { AttendeeModal } from "@/components/AttendeeModal";
import type { AttendeeRow } from "@/lib/eventTypes";

const attendees: AttendeeRow[] = [
  {
    id: "user_1",
    name: "Alice Example",
    headline: "Engineer at Example Co",
    profile_picture_url: "https://i.pravatar.cc/150?u=user_1",
    location: "Boston, MA",
    company: "Example Co",
    industry: "Education",
    degree: 1,
    isConnection: true,
    mutualEvents: [
      { id: "event_0009", name: "Tech Mixer" },
      { id: "event_0010", name: "Product Leaders Summit" },
    ],
    nudged: false,
  },
  {
    id: "user_2",
    name: "Ben Builder",
    headline: "Designer at DesignHub",
    profile_picture_url: "https://i.pravatar.cc/150?u=user_2",
    location: "Seattle, WA",
    company: "DesignHub",
    industry: "Healthcare",
    degree: 2,
    isConnection: false,
    mutualEvents: [],
    nudged: false,
  },
];

describe("AttendeeModal", () => {
  it("shows location, company, and industry filters instead of connection tabs", () => {
    render(<AttendeeModal open attendees={attendees} onClose={() => {}} eventId="event_0002" eventName="Test Event" />);

    expect(screen.getByLabelText("Filter by Location")).toBeInTheDocument();
    expect(screen.getByLabelText("Filter by Company")).toBeInTheDocument();
    expect(screen.getByLabelText("Filter by Industry")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "1st" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "2nd" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "3rd+" })).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/degree connection/i)).not.toBeInTheDocument();
  });

  it("shows headline and location without connection badges", () => {
    render(<AttendeeModal open attendees={attendees} onClose={() => {}} eventId="event_0002" eventName="Test Event" />);

    expect(screen.getByText("Engineer at Example Co")).toBeInTheDocument();

    const aliceRow = screen.getByText("Alice Example").closest(".li-person-row");
    const benRow = screen.getByText("Ben Builder").closest(".li-person-row");
    expect(aliceRow).not.toBeNull();
    expect(benRow).not.toBeNull();
    expect(within(aliceRow as HTMLElement).getByText("Boston, MA")).toBeInTheDocument();
    expect(within(benRow as HTMLElement).getByText("Seattle, WA")).toBeInTheDocument();
  });

  it("shows a single also-attending event inline", () => {
    const singleEventAttendees: AttendeeRow[] = [
      {
        ...attendees[0],
        mutualEvents: [{ id: "event_0009", name: "Tech Mixer" }],
      },
    ];

    render(
      <AttendeeModal open attendees={singleEventAttendees} onClose={() => {}} eventId="event_0002" eventName="Test Event" />,
    );

    const label = screen.getByText("Also attending");
    expect(label).toHaveClass("li-person-row__meta-label--mutual");
    expect(screen.getByRole("link", { name: "Tech Mixer" })).toBeInTheDocument();
  });

  it("hides also-attending when there is no overlap", () => {
    render(<AttendeeModal open attendees={attendees} onClose={() => {}} eventId="event_0002" eventName="Test Event" />);

    const benRow = screen.getByText("Ben Builder").closest(".li-person-row");
    expect(benRow).not.toBeNull();
    expect(within(benRow as HTMLElement).queryByText("Also attending")).not.toBeInTheDocument();
  });

  it("shows multiple also-attending events in an expandable dropdown", async () => {
    const user = userEvent.setup();
    render(<AttendeeModal open attendees={attendees} onClose={() => {}} eventId="event_0002" eventName="Test Event" />);

    expect(
      screen.getByRole("button", { name: "Also attending 2 events" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Tech Mixer" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Product Leaders Summit" }),
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Also attending 2 events" }),
    );

    expect(screen.getByRole("link", { name: "Tech Mixer" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Product Leaders Summit" }),
    ).toBeInTheDocument();
  });

  it("filters attendees by the selected location", async () => {
    const user = userEvent.setup();
    render(<AttendeeModal open attendees={attendees} onClose={() => {}} eventId="event_0002" eventName="Test Event" />);

    await user.selectOptions(
      screen.getByLabelText("Filter by Location"),
      "Seattle, WA",
    );

    expect(screen.queryByText("Alice Example")).not.toBeInTheDocument();
    expect(screen.getByText("Ben Builder")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Remove Seattle, WA filter" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Clear filters" }),
    ).toBeInTheDocument();
  });

  it("hides Clear filters when no filters are applied", () => {
    render(<AttendeeModal open attendees={attendees} onClose={() => {}} eventId="event_0002" eventName="Test Event" />);

    expect(
      screen.queryByRole("button", { name: "Clear filters" }),
    ).not.toBeInTheDocument();
  });
});

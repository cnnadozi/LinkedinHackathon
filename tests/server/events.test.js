const fs = require("fs");
const os = require("os");
const path = require("path");

describe("events API helpers", () => {
  let stateFile;

  beforeEach(() => {
    stateFile = path.join(
      os.tmpdir(),
      `demo-state-events-${Date.now()}-${Math.random()}.json`,
    );
    process.env.DEMO_STATE_FILE = stateFile;
    vi.resetModules();
  });

  afterEach(() => {
    delete process.env.DEMO_STATE_FILE;
    if (fs.existsSync(stateFile)) fs.unlinkSync(stateFile);
  });

  it("returns event detail with host and attendance summary", () => {
    const { getEventDetail } = require("../../server/lib/events");
    const detail = getEventDetail("event_0001");

    expect(detail).not.toBeNull();
    expect(detail.event.id).toBe("event_0001");
    expect(detail.host?.id).toBe("user_4579");
    expect(detail.host?.profile_picture_url).toMatch(
      /^https:\/\/i\.pravatar\.cc\/150\?u=user_4579$/,
    );
    expect(detail.attendance.total).toBeGreaterThan(0);
    expect(detail.attendees.length).toBe(detail.attendance.total);
    expect(detail.attendees[0].profile_picture_url).toMatch(
      /^https:\/\/i\.pravatar\.cc\/150\?u=/,
    );
    expect(detail.attendees[0].location).toBeTruthy();
    expect(detail.attendees[0]).toHaveProperty("company");
    expect(detail.attendees[0]).toHaveProperty("industry");
  });

  it("derives attendee count from user attending_event_ids in the dataset", () => {
    const { getEventDetail, deriveAttendeeIds, getEventAttendeeCounts } = require("../../server/lib/events");
    const { users } = require("../../server/lib/data");
    const eventId = "event_0001";

    const fromData = users.filter((user) =>
      user.attending_event_ids?.includes(eventId),
    ).length;

    expect(fromData).toBeGreaterThan(0);
    expect(deriveAttendeeIds({ id: eventId, host_user_id: "user_4579" }).totalAttending).toBe(
      fromData,
    );

    const detail = getEventDetail(eventId);
    expect(detail?.attendance.total).toBe(fromData);
    expect(detail?.attendees.length).toBe(fromData);
    expect(getEventAttendeeCounts([{ id: eventId, host_user_id: "user_4579" }])[eventId]).toBe(
      fromData,
    );
  });

  it("returns only events the main user also attends for each attendee row", () => {
    const { getEventDetail } = require("../../server/lib/events");
    const { users, events, MAIN_USER_ID } = require("../../server/lib/data");
    const eventId = "event_0001";
    const detail = getEventDetail(eventId);
    const mainUser = users.find((member) => member.id === MAIN_USER_ID);
    const mainUserEventIds = new Set(mainUser?.attending_event_ids ?? []);

    const attendeeWithOverlap = detail?.attendees.find((row) => {
      const user = users.find((member) => member.id === row.id);
      const overlap = events.filter(
        (candidate) =>
          candidate.id !== eventId &&
          user?.attending_event_ids?.includes(candidate.id) &&
          mainUserEventIds.has(candidate.id),
      );
      return overlap.length > 0;
    });
    expect(attendeeWithOverlap).toBeTruthy();

    const user = users.find((member) => member.id === attendeeWithOverlap.id);
    const expected = events
      .filter(
        (candidate) =>
          candidate.id !== eventId &&
          user.attending_event_ids?.includes(candidate.id) &&
          mainUserEventIds.has(candidate.id),
      )
      .map((candidate) => ({ id: candidate.id, name: candidate.name }))
      .sort((a, b) => a.name.localeCompare(b.name));

    expect(attendeeWithOverlap.mutualEvents).toEqual(expected);
  });

  it("returns null for unknown events", () => {
    const { getEventDetail } = require("../../server/lib/events");
    expect(getEventDetail("event_missing")).toBeNull();
  });

  it("toggles RSVP state for the demo user", () => {
    const { toggleRsvp } = require("../../server/lib/events");
    const eventId = "event_0002";
    const first = toggleRsvp(eventId);
    expect(first?.rsvpd).toBe(true);

    const second = toggleRsvp(eventId);
    expect(second?.rsvpd).toBe(false);
  });

  it("returns RSVP'd events for the calendar overlay", () => {
    const { toggleRsvp, getRsvpEventsForUser } = require("../../server/lib/events");
    const { DEMO_USER_ID } = require("../../server/lib/data");

    expect(getRsvpEventsForUser(DEMO_USER_ID)).toEqual([]);

    toggleRsvp("event_0003");
    toggleRsvp("event_0001");

    const events = getRsvpEventsForUser(DEMO_USER_ID);
    expect(events.map((event) => event.id)).toEqual(["event_0001", "event_0003"]);
  });
});

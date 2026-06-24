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

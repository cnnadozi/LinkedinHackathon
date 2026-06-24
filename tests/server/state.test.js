const fs = require("fs");
const os = require("os");
const path = require("path");

describe("demo state persistence", () => {
  let stateFile;

  beforeEach(() => {
    stateFile = path.join(
      os.tmpdir(),
      `demo-state-${Date.now()}-${Math.random()}.json`,
    );
    process.env.DEMO_STATE_FILE = stateFile;
    vi.resetModules();
  });

  afterEach(() => {
    delete process.env.DEMO_STATE_FILE;
    if (fs.existsSync(stateFile)) fs.unlinkSync(stateFile);
  });

  it("persists RSVP toggles to disk", () => {
    const state = require("../../server/lib/state");
    expect(state.toggleUserRsvp("user_5736", "event_0001")).toBe(true);
    expect(state.userHasRsvp("user_5736", "event_0001")).toBe(true);

    vi.resetModules();
    const reloaded = require("../../server/lib/state");
    expect(reloaded.userHasRsvp("user_5736", "event_0001")).toBe(true);

    expect(reloaded.toggleUserRsvp("user_5736", "event_0001")).toBe(false);
    expect(reloaded.userHasRsvp("user_5736", "event_0001")).toBe(false);
  });

  it("persists nudges to disk", () => {
    const state = require("../../server/lib/state");
    state.addNudge("event_0001:user_1000");
    expect(state.hasNudge("event_0001:user_1000")).toBe(true);

    vi.resetModules();
    const reloaded = require("../../server/lib/state");
    expect(reloaded.hasNudge("event_0001:user_1000")).toBe(true);
  });
});

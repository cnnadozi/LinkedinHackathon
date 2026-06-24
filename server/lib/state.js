/**
 * Shared RSVP and nudge state persisted to disk between dev server restarts.
 */
const fs = require("fs");
const path = require("path");

const STATE_FILE =
  process.env.DEMO_STATE_FILE ||
  path.join(__dirname, "..", ".demo-state.json");

function emptyState() {
  return { rsvps: {}, nudges: [] };
}

function loadState() {
  try {
    const raw = fs.readFileSync(STATE_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      rsvps: parsed.rsvps ?? {},
      nudges: Array.isArray(parsed.nudges) ? parsed.nudges : [],
    };
  } catch {
    return emptyState();
  }
}

function saveState(state) {
  fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function getUserRsvpIds(userId) {
  const state = loadState();
  return state.rsvps[userId] ?? [];
}

function setUserRsvpIds(userId, eventIds) {
  const state = loadState();
  if (eventIds.length === 0) {
    delete state.rsvps[userId];
  } else {
    state.rsvps[userId] = eventIds;
  }
  saveState(state);
}

function toggleUserRsvp(userId, eventId) {
  const ids = new Set(getUserRsvpIds(userId));
  if (ids.has(eventId)) {
    ids.delete(eventId);
  } else {
    ids.add(eventId);
  }
  setUserRsvpIds(userId, [...ids]);
  return ids.has(eventId);
}

function userHasRsvp(userId, eventId) {
  return getUserRsvpIds(userId).includes(eventId);
}

function hasNudge(nudgeKey) {
  return loadState().nudges.includes(nudgeKey);
}

function addNudge(nudgeKey) {
  const state = loadState();
  if (state.nudges.includes(nudgeKey)) return;
  state.nudges.push(nudgeKey);
  saveState(state);
}

module.exports = {
  getUserRsvpIds,
  toggleUserRsvp,
  userHasRsvp,
  hasNudge,
  addNudge,
};

/**
 * Shared dataset loaders and lookup helpers for the demo backend.
 */
const path = require("path");
const fs = require("fs");

const DATA_DIR = path.join(process.cwd(), "data");

function loadDataset(filename) {
  const filePath = path.join(DATA_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

const users = loadDataset("user_data.json");
const jobs = loadDataset("jobs_data.json");
const courses = loadDataset("course_data.json");
const events = loadDataset("events_data.json");

const userById = Object.fromEntries(users.map((user) => [user.id, user]));
const jobById = Object.fromEntries(jobs.map((job) => [job.id, job]));
const eventById = Object.fromEntries(events.map((event) => [event.id, event]));

/** Main logged-in member — Alice Johnson (user_5736). Override via MAIN_USER_ID env. */
const MAIN_USER_ID = process.env.MAIN_USER_ID || "user_5736";
const DEMO_USER_ID = MAIN_USER_ID;

function getMainUser() {
  return userById[MAIN_USER_ID] ?? null;
}

function getMainUserAttendingEventIds() {
  return getMainUser()?.attending_event_ids ?? [];
}

function resolveMemberJobs(member) {
  return member.job_history.map((id) => jobById[id]).filter(Boolean);
}

function latestJob(member) {
  const resolved = resolveMemberJobs(member);
  return resolved[resolved.length - 1] ?? null;
}

function memberHeadline(member) {
  const job = latestJob(member);
  if (!job) return member.current_location;
  return `${job.position} at ${job.company}`;
}

function getUserConnections(userId) {
  return userById[userId]?.connections ?? [];
}

function isDirectConnection(viewerId, targetId) {
  if (!viewerId || !targetId || viewerId === targetId) return false;
  return getUserConnections(viewerId).includes(targetId);
}

/** LinkedIn-style degree: 1st = direct, 2nd = one mutual, 3rd+ = everyone else. */
function getConnectionDegree(viewerId, targetId) {
  if (!viewerId || !targetId || viewerId === targetId) return 3;
  if (isDirectConnection(viewerId, targetId)) return 1;

  const viewerConnections = new Set(getUserConnections(viewerId));
  for (const connectionId of getUserConnections(targetId)) {
    if (viewerConnections.has(connectionId)) return 2;
  }

  return 3;
}

module.exports = {
  users,
  jobs,
  courses,
  events,
  userById,
  jobById,
  eventById,
  MAIN_USER_ID,
  DEMO_USER_ID,
  getMainUser,
  getMainUserAttendingEventIds,
  resolveMemberJobs,
  latestJob,
  memberHeadline,
  getUserConnections,
  isDirectConnection,
  getConnectionDegree,
};

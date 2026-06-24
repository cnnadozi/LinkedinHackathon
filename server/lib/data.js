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

/** Demo logged-in member for connections, RSVPs, and nudges. */
const DEMO_USER_ID = process.env.DEMO_USER_ID || "user_5736";

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

module.exports = {
  users,
  jobs,
  courses,
  events,
  userById,
  jobById,
  eventById,
  DEMO_USER_ID,
  resolveMemberJobs,
  latestJob,
  memberHeadline,
};

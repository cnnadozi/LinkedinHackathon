const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const PORT = process.env.PORT || 3001;
const DATA_DIR = path.join(__dirname, "..", "data");

/** Load a JSON dataset from the data/ folder. */
function loadDataset(filename) {
  const filePath = path.join(DATA_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

const users = loadDataset("user_data.json");
const jobs = loadDataset("jobs_data.json");
const courses = loadDataset("course_data.json");

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    datasets: {
      users: users.length,
      jobs: jobs.length,
      courses: courses.length,
    },
  });
});

app.get("/api/users", (_req, res) => {
  res.json(users);
});

app.get("/api/users/:id", (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json(user);
});

app.get("/api/jobs", (_req, res) => {
  res.json(jobs);
});

app.get("/api/jobs/:id", (req, res) => {
  const job = jobs.find((j) => j.id === req.params.id);
  if (!job) {
    res.status(404).json({ error: "Job not found" });
    return;
  }
  res.json(job);
});

app.get("/api/courses", (_req, res) => {
  res.json(courses);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === req.params.id);
  if (!course) {
    res.status(404).json({ error: "Course not found" });
    return;
  }
  res.json(course);
});

app.listen(PORT, () => {
  console.log(`Express API listening on http://localhost:${PORT}`);
});

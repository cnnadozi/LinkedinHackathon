# Dataset Usage Guide

This project includes the **Possibilities in Tech · Hackathon 2026** starter datasets from [pit.najera.cc](https://pit.najera.cc/). The data is synthetic and designed for building job matchers, skills-gap recommenders, talent search, and similar career-graph features.

## Files

All datasets live in the `data/` directory:

| File | Records | Description |
|------|---------|-------------|
| `data/user_data.json` | 2,000 | Member profiles |
| `data/jobs_data.json` | 1,000 | Job postings |
| `data/course_data.json` | 600 | Learning courses |
| `data/events_data.json` | 100 | Professional networking events |

Each file is a **flat JSON array**. Members reference jobs and courses by ID — there are no nested job or course objects inside member records.

## Schemas

### Members (`user_data.json`)

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | e.g. `"user_4579"` |
| `name` | string | |
| `school_history` | object[] | `school_name`, `degree`, `graduation_year` |
| `job_history` | string[] | Job IDs → resolve against `jobs_data.json` |
| `current_location` | string | e.g. `"Boston, MA"` |
| `posts_activity` | string[] | Recent activity snippets |
| `skills` | string[] | Member skill tags |
| `courses` | string[] | Course IDs → resolve against `course_data.json` |

### Jobs (`jobs_data.json`)

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | e.g. `"job_550126"` |
| `company` | string | |
| `location` | string | |
| `position` | string | Role title |
| `salary_range` | object | `{ "from": string, "to": string }` (USD, as strings) |
| `industry` | string | e.g. Healthcare, Technology |
| `level` | string | Seniority (e.g. Entry, Mid, Senior) |
| `easy_apply` | boolean | |
| `description` | string | Posting text |

### Events (`events_data.json`)

Derived from member locations, job history, and job metadata (company, industry).

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | e.g. `"event_0001"` |
| `name` | string | Event title themed on industry/role |
| `location` | string | From host member's `current_location` |
| `time` | string | ISO 8601 datetime (Apr–Sep 2026) |
| `description` | string | Event summary |
| `host_user_id` | string | Member ID → resolve against `user_data.json` for host name |
| `industry` | string | From host member's most recent job |
| `company` | string | From host member's most recent job |

### Courses (`course_data.json`)

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | e.g. `"course_1555"` |
| `name` | string | |
| `category` | string | e.g. Communication, AI |
| `skills` | string[] | Skills taught by the course |
| `length` | object | `{ "value": number, "unit": string }` |
| `level` | string | Easy, Medium, or Hard |

## Linking the datasets

Members connect to jobs and courses through ID arrays. Events link back to members:

```
user.job_history   →  jobs_data.json (by id)
user.courses       →  course_data.json (by id)
event.host_user_id →  user_data.json (by id)
```

Build lookup maps once, then resolve references when you need full objects:

```javascript
const users = require("./data/user_data.json");
const jobs = require("./data/jobs_data.json");
const courses = require("./data/course_data.json");

const jobById = Object.fromEntries(jobs.map((j) => [j.id, j]));
const courseById = Object.fromEntries(courses.map((c) => [c.id, c]));

const member = users[0];
const pastJobs = member.job_history.map((id) => jobById[id]);
const completedCourses = member.courses.map((id) => courseById[id]);
```

```python
import json
from pathlib import Path

DATA = Path("data")

with open(DATA / "user_data.json") as f:
    users = json.load(f)
with open(DATA / "jobs_data.json") as f:
    jobs = json.load(f)
with open(DATA / "course_data.json") as f:
    courses = json.load(f)

job_by_id = {j["id"]: j for j in jobs}
course_by_id = {c["id"]: c for c in courses}

member = users[0]
past_jobs = [job_by_id[jid] for jid in member["job_history"]]
completed = [course_by_id[cid] for cid in member["courses"]]
```

## Loading the data

### Local files (recommended for this repo)

Read directly from `data/` as shown above. No API keys or network access required.

### Remote fetch (optional)

The same files are hosted over HTTPS with open CORS:

```bash
curl https://pit.najera.cc/user_data.json   -o data/user_data.json
curl https://pit.najera.cc/jobs_data.json   -o data/jobs_data.json
curl https://pit.najera.cc/course_data.json -o data/course_data.json
```

```javascript
const [users, jobs, courses] = await Promise.all([
  fetch("https://pit.najera.cc/user_data.json").then((r) => r.json()),
  fetch("https://pit.najera.cc/jobs_data.json").then((r) => r.json()),
  fetch("https://pit.najera.cc/course_data.json").then((r) => r.json()),
]);
```

## Common patterns

### Job matcher

Score open jobs against a member's skills, location, and seniority. Use `job_history` to infer career trajectory or preferred industries.

### Skills-gap recommender

1. Define target skills from a job's `description` or a desired role.
2. Compare against the member's `skills` and skills from their `courses`.
3. Recommend courses from `course_data.json` whose `skills` fill the gap.

### Talent search

Filter members by `skills`, `current_location`, or resolved job titles from `job_history`.

### Salary insights

Parse `salary_range.from` and `salary_range.to` as numbers for aggregation. Values are stored as strings in the JSON.

## Data snapshot (at download)

- **Members by location:** New York, Boston, San Francisco, Seattle, Austin (~385–416 each)
- **Job industries:** Education, Technology, Retail, Healthcare, Finance
- **Course categories:** Business, Cybersecurity, Marketing, HR, Communication, and more
- **Avg jobs per member:** ~1.89
- **Members with courses:** 606 / 2,000

## Source

- Dataset homepage: [https://pit.najera.cc/](https://pit.najera.cc/)
- Synthetic starter data for hackathon use — 3,600 records across members, jobs, and courses

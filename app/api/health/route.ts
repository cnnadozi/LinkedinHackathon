import { NextResponse } from "next/server";

export async function GET() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { users, jobs, courses, events } = require("@/server/lib/data");

  return NextResponse.json({
    status: "ok",
    datasets: {
      users: users.length,
      jobs: jobs.length,
      courses: courses.length,
      events: events.length,
    },
  });
}

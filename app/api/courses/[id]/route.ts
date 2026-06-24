import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { courses } = require("@/server/lib/data");
  const course = courses.find((entry: { id: string }) => entry.id === id);

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  return NextResponse.json(course);
}

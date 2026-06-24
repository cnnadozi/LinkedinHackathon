import { NextResponse } from "next/server";

export async function GET() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { courses } = require("@/server/lib/data");
  return NextResponse.json(courses);
}

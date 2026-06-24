import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location");
  const industry = searchParams.get("industry");

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { events } = require("@/server/lib/data");
  let result = events;

  if (location) {
    result = result.filter(
      (event: { location: string }) => event.location === location,
    );
  }
  if (industry) {
    result = result.filter(
      (event: { industry: string }) => event.industry === industry,
    );
  }

  return NextResponse.json(result);
}

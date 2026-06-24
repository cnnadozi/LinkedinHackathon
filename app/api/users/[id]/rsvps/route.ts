import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { userById } = require("@/server/lib/data");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getRsvpEventsForUser } = require("@/server/lib/events");

  if (!userById[id]) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ events: getRsvpEventsForUser(id) });
}

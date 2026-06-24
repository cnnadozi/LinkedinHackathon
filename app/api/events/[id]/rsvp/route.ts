import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { toggleRsvp } = require("@/server/lib/events");
  const result = toggleRsvp(id);

  if (!result) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}

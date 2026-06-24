import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getEventDetail } = require("@/server/lib/events");
  const detail = getEventDetail(id);

  if (!detail) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  let attendees = detail.attendees;
  if (searchParams.get("filter") === "connections") {
    attendees = attendees.filter(
      (row: { isConnection: boolean }) => row.isConnection,
    );
  }

  const degree = searchParams.get("degree");
  if (degree === "1" || degree === "2" || degree === "3") {
    attendees = attendees.filter(
      (row: { degree: number }) => row.degree === Number.parseInt(degree, 10),
    );
  }

  return NextResponse.json({ attendees });
}

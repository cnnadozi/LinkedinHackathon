import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body = (await request.json()) as { targetUserId?: string };
  const { targetUserId } = body;

  if (!targetUserId) {
    return NextResponse.json(
      { error: "targetUserId is required" },
      { status: 400 },
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { recordNudge } = require("@/server/lib/events");
  const result = recordNudge(id, targetUserId);

  if (!result) {
    return NextResponse.json({ error: "Event or user not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}

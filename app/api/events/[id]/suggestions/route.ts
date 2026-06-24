import { NextResponse } from "next/server";
import { getNudgePanel } from "@/lib/nudgeSuggestions.server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * POST /api/events/:id/suggestions — AI connection panel for a recipient:
 * shared themes, mutual events (last 6 months), and AI talking points.
 */
export async function POST(request: Request, context: RouteContext) {
  await context.params; // event id is part of the route; context comes via body
  const body = (await request.json()) as {
    targetUserId?: string;
    eventName?: string;
  };
  const { targetUserId, eventName } = body;

  if (!targetUserId || !eventName) {
    return NextResponse.json(
      { error: "targetUserId and eventName are required" },
      { status: 400 },
    );
  }

  const panel = await getNudgePanel(targetUserId, eventName);

  if (!panel) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(panel);
}

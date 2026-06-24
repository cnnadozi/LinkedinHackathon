import { NextResponse } from "next/server";
import { loadEventDetailFromDataset } from "@/lib/eventDetail.server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const detail = loadEventDetailFromDataset(id);

  if (!detail) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  return NextResponse.json(detail);
}

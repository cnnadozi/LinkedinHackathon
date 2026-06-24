import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getConnectionSuggestions } = require("@/server/lib/suggestions");
  const suggestions = getConnectionSuggestions(id);

  if (!suggestions) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(suggestions);
}

import { NextResponse } from "next/server";
import { categorizeExpenseWithGateway } from "@/lib/expense-ai";

const MAX_QUERY_LENGTH = 250;

export async function POST(request: Request) {
  let body: { q?: unknown };
  try {
    body = (await request.json()) as { q?: unknown };
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  if (typeof body.q !== "string" || body.q.trim().length === 0) {
    return NextResponse.json(
      { error: "Field 'q' must be a non-empty string." },
      { status: 400 },
    );
  }

  const normalizedQuery = body.q.trim();
  if (normalizedQuery.length > MAX_QUERY_LENGTH) {
    return NextResponse.json(
      { error: `Field 'q' must be at most ${MAX_QUERY_LENGTH} characters.` },
      { status: 400 },
    );
  }

  try {
    const res = await categorizeExpenseWithGateway(normalizedQuery);
    return NextResponse.json(res);
  } catch (error) {
    console.error("Failed to categorize expense", error);
    return NextResponse.json(
      { error: "Unable to categorize expense at this time." },
      { status: 502 },
    );
  }
}

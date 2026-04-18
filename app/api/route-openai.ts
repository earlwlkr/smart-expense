import { NextResponse } from "next/server";
import { categorizeExpenseWithGateway } from "@/lib/expense-ai";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const res = await categorizeExpenseWithGateway(body.q);
    return NextResponse.json(JSON.stringify(res));
  } catch (error) {
    console.error("Failed to categorize expense", error);
    return NextResponse.json(
      { error: "Unable to categorize expense at this time." },
      { status: 502 },
    );
  }
}

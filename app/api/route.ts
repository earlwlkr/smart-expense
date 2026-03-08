import { NextResponse } from "next/server";
import fetch from "node-fetch";

type ExpenseCategorization = {
  name: string;
  amount: string;
  category: string;
};

type UpstreamResponse = {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
};

function parseCategorization(raw: string): ExpenseCategorization | null {
  const trimmed = raw.trim();

  // Prefer JSON output when the model returns valid structured content.
  try {
    const parsed = JSON.parse(trimmed) as Partial<ExpenseCategorization>;
    if (
      typeof parsed.name === "string" &&
      typeof parsed.amount === "string" &&
      typeof parsed.category === "string"
    ) {
      return {
        name: parsed.name.trim(),
        amount: parsed.amount.trim(),
        category: parsed.category.trim(),
      };
    }
  } catch {
    // Ignore and try fallback format parsing.
  }

  const bracketMatches = [...trimmed.matchAll(/\[(.*?)\]/g)].map((m) =>
    m[1].trim(),
  );
  if (bracketMatches.length >= 3) {
    const [name, amount, category] = bracketMatches;
    return { name, amount, category };
  }

  return null;
}

async function query(text: string): Promise<ExpenseCategorization | null> {
  const prompt = `I want you to act as an expense categorizer. I will provide you with the input "${text}".\
You will only reply with the name, cost, category in JSON format, and nothing else. Do not write explanations.`;

  if (!process.env.HF_API_KEY) {
    console.error("HF_API_KEY is missing");
    return null;
  }

  try {
    const response = await fetch(
      "https://router.huggingface.co/fireworks-ai/v1/chat/completions",
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 512,
          model: "accounts/fireworks/models/deepseek-v3-0324",
          stream: false,
        }),
      },
    );

    if (!response.ok) {
      console.error("Upstream request failed", {
        status: response.status,
        statusText: response.statusText,
      });
      return null;
    }

    const result = (await response.json()) as UpstreamResponse;
    const raw = result.choices?.[0]?.message?.content;

    if (typeof raw !== "string") {
      console.error("Upstream response missing content");
      return null;
    }

    return parseCategorization(raw);
  } catch (error) {
    console.error("Failed to categorize expense", error);
    return null;
  }
}

export async function POST(request: Request) {
  const body = (await request.json()) as { q?: unknown };

  if (typeof body.q !== "string" || body.q.trim().length === 0) {
    return NextResponse.json(
      { error: "Field 'q' must be a non-empty string." },
      { status: 400 },
    );
  }

  const res = await query(body.q);

  if (!res) {
    return NextResponse.json(
      { error: "Unable to categorize expense at this time." },
      { status: 502 },
    );
  }

  return NextResponse.json(res);
}

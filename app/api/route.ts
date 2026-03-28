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

const MAX_QUERY_LENGTH = 250;
const UPSTREAM_TIMEOUT_MS = 12000;

function stripCodeFence(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("```")) {
    return trimmed;
  }

  const match = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return match?.[1]?.trim() ?? trimmed;
}

function tryParseJsonObject(
  raw: string,
): Partial<ExpenseCategorization> | null {
  const normalized = stripCodeFence(raw);

  try {
    return JSON.parse(normalized) as Partial<ExpenseCategorization>;
  } catch {
    const objectMatch = normalized.match(/\{[\s\S]*\}/);
    if (!objectMatch) {
      return null;
    }

    try {
      return JSON.parse(objectMatch[0]) as Partial<ExpenseCategorization>;
    } catch {
      return null;
    }
  }
}

function parseCategorization(raw: string): ExpenseCategorization | null {
  const trimmed = raw.trim();
  const amountPattern = /^(\d+(?:[.,]\d+)?)\s*(k)?$/i;

  // Prefer JSON output when the model returns valid structured content.
  const parsed = tryParseJsonObject(trimmed);
  if (
    parsed &&
    typeof parsed.name === "string" &&
    typeof parsed.amount === "string" &&
    typeof parsed.category === "string"
  ) {
    const name = parsed.name.trim();
    const amount = parsed.amount.trim();
    const category = parsed.category.trim();

    if (!name || !category || !amountPattern.test(amount)) {
      return null;
    }

    return {
      name,
      amount,
      category,
    };
  }

  const bracketMatches = Array.from(
    trimmed.matchAll(/\[(.*?)\]/g),
    (match) => match[1].trim(),
  );
  if (bracketMatches.length >= 3) {
    const [name, amount, category] = bracketMatches;
    if (!name || !category || !amountPattern.test(amount)) {
      return null;
    }
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
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

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
        signal: controller.signal,
      },
    ).finally(() => {
      clearTimeout(timeout);
    });

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
    if (error instanceof Error && error.name === "AbortError") {
      console.error("Upstream request timed out");
      return null;
    }
    console.error("Failed to categorize expense", error);
    return null;
  }
}

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

  const res = await query(normalizedQuery);

  if (!res) {
    return NextResponse.json(
      { error: "Unable to categorize expense at this time." },
      { status: 502 },
    );
  }

  return NextResponse.json(res);
}

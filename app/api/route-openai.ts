import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function runCompletion(text: string) {
  const prompt = `I want you to act as an expense categorizer. I will provide you with the input ${text}". You will only reply with the cost and category in JSON format, and nothing else. Do not write explanations.`;
  try {
    const completion = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });
    console.log(completion.output_text);
    return completion.output_text;
  } catch (error) {
    // if (error.response) {
    //   console.log(error.response.status);
    //   console.log(error.response.data);
    // } else {
    //   console.log(error.message);
    // }
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const res = await runCompletion(body.q);
  return NextResponse.json(res);
}

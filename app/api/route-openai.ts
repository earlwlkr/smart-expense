import { NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function runCompletion(text: string) {
  const prompt = `I want you to act as an expense categorizer. I will provide you with the input ${text}". You will only reply with the cost and category in JSON format, and nothing else. Do not write explanations.`;
  try {
    const completion = await openai.createCompletion({
      model: 'gpt-3.5-turbo',
      prompt,
    });
    console.log(completion.data.choices[0].text);
    return completion.data.choices[0].text;
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const res = await runCompletion(body.q);
  return NextResponse.json(res);
}

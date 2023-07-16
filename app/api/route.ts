import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

async function query(text: string) {
  const prompt = `I want you to act as an expense categorizer. I will provide you with the input "${text}".\
You will only reply with the name, cost, category in JSON format, and nothing else. Do not write explanations.`;

  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/google/flan-t5-xxl',
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ inputs: prompt }),
      }
    );
    const result = (await response.json()) as { generated_text: string }[];
    const raw = (result[0] as any).generated_text;
    const [name, amount, category] = raw
      .split(',')
      .map((item: string) => item.split('[')[1].replace(/]/g, '').trim());
    return { name, amount, category };
  } catch (error) {
    console.log('received error');

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
  const res = await query(body.q);
  return NextResponse.json(res);
}

import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

async function query(text: string) {
  const prompt = `I want you to act as an expense categorizer. I will provide you with the input "${text}".\
You will only reply with the name, cost, category in JSON format, and nothing else. Do not write explanations.`;

  try {
    const response = await fetch(
      'https://router.huggingface.co/fireworks-ai/v1/chat/completions',
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 512,
          model: 'accounts/fireworks/models/deepseek-v3-0324',
          stream: false,
        }),
      }
    );
    const result = (await response.json()) as {
      choices: {
        message: {
          role: string;
          content: string;
        };
      }[];
    };
    console.log('🚀 ~ query ~ result:', result);
    const raw = result.choices[0].message.content;
    console.log('🚀 ~ query ~ raw:', raw);
    const [name, amount, category] = raw
      .split('\n')
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
  console.log('🚀 ~ POST ~ res:', res);
  return NextResponse.json(res);
}

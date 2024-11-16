import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { prompt } = await request.json();
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API error');
    }

    const data = await response.json();
    return NextResponse.json({ content: data.choices[0].message.content });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch response from OpenAI API' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { content } = await request.json();
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Generate a very short, concise title (max 4-5 words) for this chat based on the user\'s first message.'
          },
          {
            role: 'user',
            content
          }
        ],
        max_tokens: 30,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API error');
    }

    const data = await response.json();
    return NextResponse.json({ title: data.choices[0].message.content.trim() });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate title' },
      { status: 500 }
    );
  }
}
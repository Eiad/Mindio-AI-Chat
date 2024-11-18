import { NextResponse } from 'next/server';

export async function POST(request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key is not configured' },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const inputText = formData.get('text') || 'Analyze this image';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString('base64');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: inputText },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                }
              }
            ]
          }
        ],
        max_tokens: 500
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to process image');
    }

    return NextResponse.json({ analysis: data.choices[0].message.content });
  } catch (error) {
    console.error('Image processing error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process image' },
      { status: 500 }
    );
  }
}
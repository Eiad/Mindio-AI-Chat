import { NextResponse } from 'next/server';

export async function POST(request) {
  const apiKey = request.headers.get('x-api-key');
  const imageSize = request.headers.get('x-image-size');
  const imageQuality = request.headers.get('x-image-quality');
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'OpenAI API key is required' },
      { status: 401 }
    );
  }

  try {
    const { prompt } = await request.json();
    const enhancedPrompt = `${prompt}`;
    
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: enhancedPrompt,
        n: 1,
        size: imageSize,
        quality: imageQuality,
        response_format: "url"
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenAI API error:', data);
      return NextResponse.json(
        { error: data.error?.message || 'DALL-E API error' },
        { status: response.status }
      );
    }

    return NextResponse.json({ 
      imageUrl: data.data[0].url,
      revisedPrompt: data.data[0].revised_prompt
    });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate image. Please try again.' },
      { status: 500 }
    );
  }
}
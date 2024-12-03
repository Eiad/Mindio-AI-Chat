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
    const { prompt, conversationHistory } = await request.json();
    
    let enhancedPrompt = prompt;
    if (conversationHistory && conversationHistory.length > 0) {
      const lastMessages = conversationHistory.slice(-10);
      const imageMessages = lastMessages.filter(msg => msg.type === 'image');
      
      if (imageMessages.length > 0) {
        const contextResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4-turbo-preview',
            messages: [
              {
                role: 'system',
                content: `You are an AI image generation assistant. Analyze the conversation context and help create an appropriate image prompt.

Previous image generations (from oldest to newest):
${imageMessages.map(msg => `- Prompt: ${msg.revisedPrompt}`).join('\n')}

Current user request: "${prompt}"

Your task:
1. Analyze how the current request relates to previous images
2. If it's a modification request (like "another one", "make it night", etc.), use the most relevant previous prompt as base
3. If it's a new request, use the original prompt
4. Return ONLY the final prompt, no explanations`
              }
            ],
            temperature: 0.7,
            max_tokens: 300,
          }),
        });

        const contextData = await contextResponse.json();
        if (contextResponse.ok) {
          enhancedPrompt = contextData.choices[0].message.content.trim();
        }
      }
    }
    
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
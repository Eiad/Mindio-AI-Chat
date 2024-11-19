import { NextResponse } from 'next/server';

export async function POST(request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key is not configured' },
      { status: 500 }
    );
  }

  try {
    const { prompt, settings, conversationHistory } = await request.json();
    
    const formatInstructions = {
      'step-by-step': 'Break down your response into clear, numbered steps.',
      'eli5': 'Explain this as if explaining to a 5-year-old.',
      'technical-documentation': 'Provide detailed technical documentation with sections for Overview, Requirements, Implementation, and Examples.',
      'concise': 'Provide a brief, direct response focusing only on key points.',
      'extreme-detail': 'Provide an extremely detailed response covering all aspects thoroughly.'
    };

    const formatInstruction = formatInstructions[settings?.outputFormat] || '';
    const systemMessage = `You are an AI assistant with the following characteristics:
      Tone: ${settings?.tone || 'default'}
      Writing Style: ${settings?.writingStyle || 'default'}
      Language: ${settings?.language || 'default'}
      Output Format: ${settings?.outputFormat || 'default'}
      ${formatInstruction}
      Please respond accordingly while maintaining these characteristics.
      
      Important: Use the conversation history to maintain context and provide more relevant responses.`;

    const formattedHistory = conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const messages = [
      { role: 'system', content: systemMessage },
      ...formattedHistory,
      { role: 'user', content: prompt }
    ];

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: settings?.tone === 'default' ? 0.7 : 0.9,
        max_tokens: 2000,
      }),
    });

    if (!openaiResponse.ok) {
      const error = await openaiResponse.json();
      return NextResponse.json(
        { error: error.error?.message || 'OpenAI API error' },
        { status: openaiResponse.status }
      );
    }

    const data = await openaiResponse.json();
    return NextResponse.json({ content: data.choices[0].message.content });
    
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch response from OpenAI API' },
      { status: 500 }
    );
  }
}
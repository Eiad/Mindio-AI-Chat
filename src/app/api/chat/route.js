import { NextResponse } from 'next/server';

export async function POST(request) {
  const apiKey = request.headers.get('x-api-key');
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'OpenAI API key is required' },
      { status: 401 }
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
      content: msg.type === 'file-content' ? 
        `Previous file content:\n${msg.content}\n\nPlease refer to this content when needed.` : 
        msg.content,
      timestamp: msg.timestamp,
      messageId: msg.messageId || msg.id
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
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: request.headers.get('x-model') || 'gpt-3.5-turbo',
        messages,
        temperature: settings?.tone === 'default' ? 0.7 : 0.9,
        max_tokens: 2000,
      }),
    });

    if (!openaiResponse.ok) {
      const error = await openaiResponse.json();
      if (openaiResponse.status === 401) {
        return NextResponse.json(
          { error: 'Invalid API key' },
          { status: 401 }
        );
      }
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
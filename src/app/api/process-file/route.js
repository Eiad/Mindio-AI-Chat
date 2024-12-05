import { NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: false,
    responseLimit: '10mb',
  },
};

export async function POST(request) {
  const apiKey = request.headers.get('x-api-key');
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'OpenAI API key is required' },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const userQuery = formData.get('text');
    const smartPrompt = formData.get('smartPrompt');

    console.log('User Query:', userQuery);
    console.log('Smart Prompt:', smartPrompt);

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Read file content based on type
    const bytes = await file.arrayBuffer();
    let textContent;

    try {
      textContent = new TextDecoder().decode(bytes);
      
      if (!textContent || textContent.trim().length === 0) {
        throw new Error('No readable content found in file');
      }
    } catch (error) {
      console.error('File parsing error:', error);
      return NextResponse.json(
        { error: 'Unable to read file content. The file may be corrupted or in an unsupported format.' },
        { status: 422 }
      );
    }

    const systemPrompt = `You are an AI assistant specialized in analyzing files.

    ${userQuery && userQuery !== 'Please analyze this file and provide a detailed summary.' ? 
    `Current user request: "${userQuery}"
    Please focus on answering this specific request about the file in professional Readable sentences format.` :
    `ONLY if the user has not provided a specific request. Please provide a brief summary of what this file is about and its main purpose (2-3 sentences) in professional Readable sentences with spacing and line breaks format.`}

    Format your response in a clear, easy-to-read manner.`;

    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: textContent
      }
    ];

    if (userQuery && userQuery !== 'Please analyze this file and provide a detailed summary.') {
      messages.push({
        role: 'user',
        content: `Specific request about this document: ${userQuery}`
      });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: messages,
        max_tokens: 4000,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    return NextResponse.json({
      analysis: data.choices[0].message.content
    });

  } catch (error) {
    console.error('File processing error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process file' },
      { status: 500 }
    );
  }
}
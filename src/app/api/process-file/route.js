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

    ${userQuery && !/analyze|analyse|explain|summarize|review|interpret|evaluate|break down/i.test(userQuery) ? 
      `Current user request: "${userQuery}"
      Please focus on addressing this specific query.

      If you cannot process the request:
      1. Explain why it couldn't be processed.
      2. Suggest alternative approaches.
      3. Recommend better ways to get the needed information.` : 
      `Please process the document and provide:
      1. A brief overview of what this document is about (2-3 sentences).
      2. Key points or the main purpose.
      3. Any notable patterns, structures, or trends.
      4. Potential issues or recommendations (if any).

      If the content is not readable:
      1. Explain why it couldn't be processed.
      2. Suggest alternative approaches.
      3. Recommend better file formats or methods for better readability.`}`;

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
      analysis: data.choices[0].message.content,
      fileContent: textContent
    });

  } catch (error) {
    console.error('File processing error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process file' },
      { status: 500 }
    );
  }
}
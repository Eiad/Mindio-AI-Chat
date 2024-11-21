import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';

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

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'File must be a PDF' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let textContent;
    try {
      const pdfData = await pdfParse(buffer);
      textContent = pdfData.text;

      if (!textContent || textContent.trim().length === 0) {
        throw new Error('No readable text content found in PDF');
      }
    } catch (pdfError) {
      console.error('PDF parsing error:', pdfError);
      return NextResponse.json(
        { error: 'Unable to read PDF content. The file may be corrupted or password protected.' },
        { status: 422 }
      );
    }

    const systemPrompt = `You are an AI assistant specialized in analyzing and processing PDF documents.
    Your task is to understand and fulfill the user's specific request about the document.
    Current request: "${userQuery}"
    
    Instructions for processing:
    ${smartPrompt}
    
    Please ensure your response is:
    1. Directly relevant to the user's request
    2. Well-structured and easy to understand
    3. Accurate to the document's content
    4. Properly formatted for readability`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: systemPrompt
          },
          {
            role: 'user',
            content: textContent
          }
        ],
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
      summary: data.choices[0].message.content
    });

  } catch (error) {
    console.error('PDF processing error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process PDF' },
      { status: 500 }
    );
  }
}
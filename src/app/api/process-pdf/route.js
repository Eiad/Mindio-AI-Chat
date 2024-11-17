import { NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';

export const config = {
  api: {
    bodyParser: false,
    responseLimit: '10mb',
  },
};

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
      const pdfData = await pdfParse(buffer, {
        max: 50, // Maximum pages to parse
        version: 'v2.0.550'
      });
      textContent = pdfData.text;
    } catch (pdfError) {
      console.error('PDF parsing error:', pdfError);
      return NextResponse.json(
        { error: 'Unable to read PDF content. The file might be corrupted or password protected.' },
        { status: 422 }
      );
    }

    if (!textContent || textContent.trim().length === 0) {
      return NextResponse.json(
        { error: 'No readable text content found in the PDF' },
        { status: 422 }
      );
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that analyzes PDF documents. Provide a detailed summary of the content.'
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
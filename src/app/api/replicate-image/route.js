import { NextResponse } from 'next/server';

export async function POST(request) {
  const replicateApiKey = request.headers.get('x-replicate-key');
  const imageSize = request.headers.get('x-image-size');
  const dalleSettings = JSON.parse(request.headers.get('x-replicate-settings') || '{}');
  
  if (!replicateApiKey) {
    return NextResponse.json(
      { error: 'Replicate API key is required' },
      { status: 401 }
    );
  }

  try {
    const { prompt } = await request.json();

    const size = dalleSettings.imageSize || '1024x1024';
    const [width, height] = size.split('x').map(Number);

    // Create prediction
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${replicateApiKey}`,
      },
      body: JSON.stringify({
        version: "7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
        input: {
          prompt: prompt,
          width: width,
          height: height,
          num_outputs: 1,
          scheduler: dalleSettings.scheduler || "DDIM",
          num_inference_steps: dalleSettings.steps || 30,
          guidance_scale: dalleSettings.guidanceScale || 7.5,
          disable_safety_checker: true
        },
      }),
    });

    const prediction = await response.json();
    if (response.status !== 201) {
      throw new Error(prediction.detail || 'Failed to generate image');
    }

    // Poll for completion
    let imageResult;
    while (!imageResult) {
      const statusResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        {
          headers: {
            Authorization: `Token ${replicateApiKey}`,
          },
        }
      );
      
      const status = await statusResponse.json();
      
      if (status.status === 'succeeded') {
        imageResult = status.output[0];
        break;
      } else if (status.status === 'failed') {
        throw new Error('Image generation failed');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return NextResponse.json({ 
      imageUrl: imageResult,
      revisedPrompt: prompt
    });
  } catch (error) {
    console.error('Replicate image generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate image' },
      { status: 500 }
    );
  }
} 
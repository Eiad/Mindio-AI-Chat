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

    const size = imageSize || '1024x1024';
    const [width, height] = size.split('x').map(Number);

    // Create prediction with optimized settings
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${replicateApiKey}`,
      },
      body: JSON.stringify({
        version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
        input: {
          prompt: prompt,
          width: width,
          height: height,
          scheduler: dalleSettings.scheduler || "K_EULER_ANCESTRAL",
          num_inference_steps: dalleSettings.steps || 50,
          guidance_scale: dalleSettings.guidanceScale || 7.5,
          negative_prompt: dalleSettings.negativePrompt || "ugly, blurry, poor quality, distorted, disfigured",
          refiner_strength: 0.9,
          high_noise_frac: 0.8,
          refiner: "expert_ensemble_refiner",
          lora_scale: 0.6,
          apply_watermark: false,
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
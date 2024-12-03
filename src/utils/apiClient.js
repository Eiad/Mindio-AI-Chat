import { storage } from './storage';

export async function fetchChatResponse(prompt, settings, messages = []) {
  const apiKey = storage.getApiKey();
  if (!apiKey) {
    throw new Error('Please enter your OpenAI API key to continue');
  }

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
        'X-MODEL': localStorage.getItem('SELECTED_MODEL') || 'gpt-3.5-turbo'
      },
      body: JSON.stringify({ 
        prompt, 
        settings,
        conversationHistory: messages 
      }),
    });

    const data = await response.json();

    if (response.status === 401) {
      storage.removeApiKey();
      throw new Error('Invalid API key');
    }

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch response');
    }

    return data.content;
  } catch (error) {
    console.error('Chat API Error:', error);
    if (error.message.includes('API key')) {
      storage.removeApiKey();
    }
    throw error;
  }
}

export async function fetchImageGeneration(prompt) {
  const apiKey = storage.getApiKey();
  const dalleSettings = storage.getDalleSettings();

  if (!apiKey) {
    throw new Error('Please enter your OpenAI API key to continue');
  }

  const response = await fetch('/api/generate-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': apiKey,
      'X-IMAGE-SIZE': dalleSettings.imageSize,
      'X-IMAGE-QUALITY': dalleSettings.imageQuality
    },
    body: JSON.stringify({ prompt }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to generate image');
  }

  return {
    imageUrl: data.imageUrl,
    revisedPrompt: data.revisedPrompt
  };
}
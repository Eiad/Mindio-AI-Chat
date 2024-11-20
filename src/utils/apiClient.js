export async function fetchChatResponse(prompt, settings, messages = []) {
  const apiKey = sessionStorage.getItem('OPENAI_API_KEY');
  if (!apiKey) {
    throw new Error('Please enter your OpenAI API key to continue');
  }

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey
      },
      body: JSON.stringify({ 
        prompt, 
        settings,
        conversationHistory: messages 
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch response');
    }

    return data.content;
  } catch (error) {
    console.error('Chat API Error:', error);
    if (error.message.includes('API key')) {
      sessionStorage.removeItem('OPENAI_API_KEY'); // Clear invalid API key
    }
    throw new Error(error.message || 'Failed to fetch response');
  }
}

export async function fetchImageGeneration(prompt) {
  const response = await fetch('/api/generate-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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
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
        'X-API-KEY': apiKey,
        'X-MODEL': sessionStorage.getItem('SELECTED_MODEL') || 'gpt-3.5-turbo'
      },
      body: JSON.stringify({ 
        prompt, 
        settings,
        conversationHistory: messages 
      }),
    });

    const data = await response.json();

    if (response.status === 401) {
      sessionStorage.removeItem('OPENAI_API_KEY');
      throw new Error('Invalid API key');
    }

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch response');
    }

    return data.content;
  } catch (error) {
    console.error('Chat API Error:', error);
    if (error.message.includes('API key')) {
      sessionStorage.removeItem('OPENAI_API_KEY');
    }
    throw error;
  }
}

export async function fetchImageGeneration(prompt) {
  const apiKey = sessionStorage.getItem('OPENAI_API_KEY');
  if (!apiKey) {
    throw new Error('Please enter your OpenAI API key to continue');
  }

  const response = await fetch('/api/generate-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': apiKey
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
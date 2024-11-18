export async function fetchChatResponse(prompt, settings, messages = []) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        prompt, 
        settings,
        conversationHistory: messages 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch response');
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('Chat API Error:', error);
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
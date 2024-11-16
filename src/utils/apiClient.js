export async function fetchChatResponse(prompt) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch response from OpenAI API');
  }

  const data = await response.json();
  return data.content;
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
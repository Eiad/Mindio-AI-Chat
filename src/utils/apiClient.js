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
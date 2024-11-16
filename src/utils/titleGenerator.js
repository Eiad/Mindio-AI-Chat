export async function fetchTitleFromAPI(content) {
    const response = await fetch('/api/generate-title', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to generate title');
    }
  
    const data = await response.json();
    return data.title;
  }
  
  export async function generateSessionTitle(content, sessionId, dispatch) {
    try {
      const title = await fetchTitleFromAPI(content);
      dispatch({
        type: 'UPDATE_SESSION_TITLE',
        payload: { sessionId, title }
      });
    } catch (error) {
      console.error('Failed to generate title:', error);
    }
  }
import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';

export function useApiKey() {
  const [apiKey, setApiKeyState] = useState(() => storage.getApiKey());

  const setApiKey = (newKey) => {
    if (newKey) {
      storage.saveApiKey(newKey);
    } else {
      storage.removeApiKey();
    }
    setApiKeyState(newKey);
  };

  useEffect(() => {
    // Check for existing session storage key and migrate it
    const sessionKey = sessionStorage.getItem('OPENAI_API_KEY');
    if (sessionKey && !apiKey) {
      setApiKey(sessionKey);
    }
  }, []);

  return [apiKey, setApiKey];
}
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

  return [apiKey, setApiKey];
}
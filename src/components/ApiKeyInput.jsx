'use client';

import { useState } from 'react';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function ApiKeyInput() {
  const [apiKey, setApiKey] = useSessionStorage('OPENAI_API_KEY', '');
  const [inputValue, setInputValue] = useState(apiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateApiKey = (key) => {
    return key.startsWith('sk-') && key.length > 20;
  };

  const handleSave = () => {
    if (!inputValue) {
      setError('Please enter an API key');
      return;
    }

    if (!validateApiKey(inputValue)) {
      setError('Invalid API key format. It should start with "sk-" and be longer than 20 characters');
      return;
    }

    setApiKey(inputValue);
    setInputValue('');
    setError('');
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2000);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-sm border">
      <h2 className="text-xl font-semibold mb-4">OpenAI API Key Setup</h2>
      <p className="mb-4 text-gray-600">
        Please enter your OpenAI API key below. Your key is stored securely in your session and not sent to any external servers.
      </p>
      <div className="flex items-center">
        <input
          type={showKey ? 'text' : 'password'}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter your API key"
          className="flex-1 px-4 py-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          onClick={() => setShowKey(!showKey)}
          className="px-2 py-2 border-t border-b border-r rounded-r-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {showKey ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
      {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
      <button
        onClick={handleSave}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Save API Key
      </button>
    </div>
  );
}
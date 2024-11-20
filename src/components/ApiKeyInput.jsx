'use client';

import { useState } from 'react';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function ApiKeyInput() {
  const [apiKey, setApiKey] = useSessionStorage('OPENAI_API_KEY', '');
  const [inputValue, setInputValue] = useState(apiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');

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
    alert('API Key saved successfully!');
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
}'use client';

import { useState } from 'react';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function ApiKeyInput() {
  const [apiKey, setApiKey] = useSessionStorage('OPENAI_API_KEY', '');
  const [inputValue, setInputValue] = useState(apiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const validateApiKey = async (key) => {
    if (!key.startsWith('sk-') || key.length < 20) {
      return false;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${key}`
        }
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const handleSave = async () => {
    if (!inputValue) {
      setError('Please enter an API key');
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      const isValid = await validateApiKey(inputValue);
      if (!isValid) {
        setError('Invalid API key. Please check your key and try again.');
        return;
      }

      setApiKey(inputValue);
      setInputValue('');
      alert('API Key saved successfully!');
    } catch (error) {
      setError('Failed to validate API key. Please try again.');
    } finally {
      setIsValidating(false);
    }
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
          placeholder="sk-..."
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
        disabled={isValidating}
        className={`mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed w-full`}
      >
        {isValidating ? 'Validating...' : 'Save API Key'}
      </button>
      <div className="mt-4 text-sm text-gray-500">
        <p>• Your API key should start with "sk-"</p>
        <p>• The key is stored only in your browser's session storage</p>
        <p>• Get your API key from the <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenAI dashboard</a></p>
      </div>
    </div>
  );
}
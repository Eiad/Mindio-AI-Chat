import { useState } from 'react';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { FiEye, FiEyeOff, FiX } from 'react-icons/fi';

export default function ApiKeyModal({ isOpen, onClose }) {
  const [apiKey, setApiKey] = useSessionStorage('OPENAI_API_KEY', '');
  const [inputValue, setInputValue] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const validateApiKey = (key) => {
    return key.startsWith('sk-') && key.length > 20;
  };

  const handleSave = async () => {
    if (!inputValue) {
      setError('Please enter an API key');
      return;
    }

    if (!validateApiKey(inputValue)) {
      setError('Invalid API key format. It should start with "sk-" and be longer than 20 characters');
      return;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${inputValue}`
        }
      });

      if (!response.ok) {
        throw new Error('Invalid API key');
      }

      setApiKey(inputValue);
      setInputValue('');
      setError('');
      onClose();
    } catch (error) {
      setError('Invalid API key. Please check and try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Enter Your OpenAI API Key</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <p className="mb-4 text-gray-600">
          Your API key is stored securely in your browser's session storage and is never sent to our servers.
        </p>

        <div className="flex items-center mb-2">
          <input
            type={showKey ? 'text' : 'password'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="sk-..."
            className="flex-1 px-4 py-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={() => setShowKey(!showKey)}
            className="px-3 py-2 border-t border-b border-r rounded-r-md focus:outline-none"
          >
            {showKey ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="space-y-4">
          <button
            onClick={handleSave}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save API Key
          </button>

          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-blue-600 hover:underline"
          >
            Get your API key from OpenAI
          </a>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">FAQs</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Your API key is stored securely in your browser's session storage</p>
              <p>• The key is required to make requests to OpenAI's API</p>
              <p>• Your key is never sent to our servers or stored permanently</p>
              <p>• The session storage is cleared when you close your browser</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
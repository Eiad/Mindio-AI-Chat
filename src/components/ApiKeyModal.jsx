import { useState, useEffect } from 'react';
import { useApiKey } from '../hooks/useApiKey';
import { FiEye, FiEyeOff, FiX, FiCheckCircle, FiLoader } from 'react-icons/fi';

export default function ApiKeyModal({ isOpen, onClose }) {
  const [apiKey, setApiKey] = useApiKey();
  const [inputValue, setInputValue] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && apiKey) {
      setInputValue(apiKey);
    }
  }, [isOpen, apiKey]);

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

    setIsValidating(true);
    setError('');

    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${inputValue}`
        }
      });

      if (!response.ok) {
        throw new Error('Invalid API key');
      }

      setIsValidating(false);
      setIsSuccess(true);
      setApiKey(inputValue);

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        window.location.reload();
      }, 1500);
    } catch (error) {
      setIsValidating(false);
      setError('Invalid API key. Please check and try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 relative">
        {isSuccess && (
          <div className="absolute inset-0 bg-white bg-opacity-90 rounded-lg flex items-center justify-center z-10 animate-fade-in">
            <div className="flex flex-col items-center space-y-2">
              <FiCheckCircle className="w-16 h-16 text-green-500 animate-scale-in" />
              <p className="text-lg font-medium text-gray-800">API Key Saved!</p>
            </div>
          </div>
        )}
        
        <h2 className="text-xl font-semibold mb-4">Enter Your OpenAI API Key</h2>
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
            disabled={isValidating}
          />
          <button
            onClick={() => setShowKey(!showKey)}
            className="px-3 py-2 border-t border-b border-r rounded-r-md focus:outline-none"
          >
            {showKey ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          onClick={handleSave}
          disabled={isValidating}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {isValidating ? (
            <>
              <FiLoader className="animate-spin" />
              <span>Validating...</span>
            </>
          ) : (
            <span>{isSuccess ? 'API Key Saved!' : 'Save API Key'}</span>
          )}
        </button>
      </div>
    </div>
  );
}
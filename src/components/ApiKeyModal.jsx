import { useState } from 'react';
import { useSessionStorage } from '../hooks/useSessionStorage';
import { FiEye, FiEyeOff, FiX, FiCheckCircle, FiLoader } from 'react-icons/fi';

export default function ApiKeyModal({ isOpen, onClose }) {
  const [apiKey, setApiKey] = useSessionStorage('OPENAI_API_KEY', '');
  const [inputValue, setInputValue] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
      setInputValue('');

      // Close the modal after a delay
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      setIsValidating(false);
      setError('Invalid API key. Please check and try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 relative">
        {isValidating && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex flex-col items-center justify-center">
            <FiLoader className="animate-spin text-4xl text-blue-600 mb-2" />
            <p className="text-gray-700">Validating API key...</p>
          </div>
        )}
        {isSuccess ? (
          <div className="flex flex-col items-center space-y-4">
            <FiCheckCircle className="text-green-500 w-16 h-16" />
            <p className="text-lg font-semibold">API Key Saved Successfully!</p>
            <p className="text-gray-600">You can now start using the app.</p>
          </div>
        ) : (
          <>
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

            <div className="space-y-4">
              <button
                onClick={handleSave}
                disabled={isValidating}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
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
            </div>
          </>
        )}
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { useSessionStorage } from '../hooks/useSessionStorage';

export default function SettingsModal({ isOpen, onClose }) {
  const [apiKey, setApiKey] = useSessionStorage('OPENAI_API_KEY', '');
  const [selectedModel, setSelectedModel] = useSessionStorage('SELECTED_MODEL', 'gpt-3.5-turbo');
  const [showApiKey, setShowApiKey] = useState(false);

  const models = [
    'gpt-4o',
    'chatgpt-4o-latest',
    'gpt-4-turbo-preview',
    'gpt-4o-mini',
    // 'o1-preview',
    // 'o1-mini',
    'gpt-4-turbo',
    // 'gpt-4',
    'gpt-3.5-turbo'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Model Selection
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {models.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              OpenAI API Key
            </label>
            <div className="flex">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="sk-..."
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="px-4 py-2 border-t border-r border-b rounded-r-lg bg-gray-50"
              >
                {showApiKey ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
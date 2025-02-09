export default function OpenAISettings({
  apiKey,
  setApiKey,
  showApiKey,
  setShowApiKey,
  selectedModel,
  setSelectedModel
}) {
  const models = [
    'gpt-4o',
    'chatgpt-4o-latest',
    'gpt-4-turbo-preview',
    'gpt-4o-mini',
    'gpt-4-turbo',
    'gpt-3.5-turbo'
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">OpenAI Settings</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Model
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
  );
} 
import { FiAlertTriangle } from 'react-icons/fi';

export default function GeneralSettings({
  selectedAIProvider,
  setSelectedAIProvider,
  dalleSettings,
  handleDalleSettingChange,
  showDeleteConfirmation,
  setShowDeleteConfirmation,
  handleDeleteAllChats,
  isDeleting,
  deleteSuccess
}) {
  const aiProviders = [
    { id: 'openai', name: 'OpenAI' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Chat Settings</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            AI Provider
          </label>
          <select
            value={selectedAIProvider}
            onChange={(e) => setSelectedAIProvider(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {aiProviders.map(provider => (
              <option key={provider.id} value={provider.id}>{provider.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Image Generation</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Default Image Model
          </label>
          <select
            value={dalleSettings.model}
            onChange={(e) => handleDalleSettingChange('model', e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="stable-diffusion-3.5-large">Stable Diffusion 3.5 Large</option>
            <option value="dall-e-3">DALL-E 3</option>
          </select>
        </div>
      </div>

      <div className="pt-4 border-t">
        <button
          onClick={() => setShowDeleteConfirmation(true)}
          className="w-full px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 flex items-center justify-center gap-2"
          disabled={isDeleting}
        >
          <FiAlertTriangle className="w-5 h-5" />
          Delete All Chats
        </button>
        <p className="mt-2 text-xs text-gray-500 text-center">
          This action cannot be undone
        </p>
      </div>
    </div>
  );
} 
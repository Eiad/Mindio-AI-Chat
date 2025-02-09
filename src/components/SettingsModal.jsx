import { useState, useEffect } from 'react';
import { FiX, FiAlertTriangle, FiCheck, FiLoader } from 'react-icons/fi';
import { storage } from '../utils/storage';
import { useChat } from '../context/ChatContext';
import { useRouter } from 'next/navigation';

export default function SettingsModal({ isOpen, onClose }) {
  const [apiKey, setApiKey] = useState(() => storage.getApiKey() || '');
  const [replicateApiKey, setReplicateApiKey] = useState(() => storage.getReplicateApiKey() || '');
  const [selectedModel, setSelectedModel] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('SELECTED_MODEL') || 'gpt-3.5-turbo';
    }
    return 'gpt-3.5-turbo';
  });
  const [dalleSettings, setDalleSettings] = useState(() => storage.getDalleSettings());
  const [showApiKey, setShowApiKey] = useState(false);
  const [showReplicateKey, setShowReplicateKey] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const { dispatch } = useChat();
  const router = useRouter();

  const models = [
    'gpt-4o',
    'chatgpt-4o-latest',
    'gpt-4-turbo-preview',
    'gpt-4o-mini',
    'gpt-4-turbo',
    'gpt-3.5-turbo'
  ];

  const imageSizes = [
    '1024x1024',
    '1024x1792',
    '1792x1024'
  ];

  const imageQualities = [
    'standard',
    'hd'
  ];

  const replicateSettings = {
    schedulers: [
      'DDIM',
      'DPMSolverMultistep',
      'HeunDiscrete',
      'KarrasDPM',
      'K_EULER_ANCESTRAL',
      'K_EULER',
      'PNDM'
    ],
    steps: [20, 25, 30, 35, 40, 45, 50],
    guidanceScales: [1, 3, 5, 7, 7.5, 8, 10]
  };

  const handleDeleteAllChats = async () => {
    setIsDeleting(true);
    
    // Simulate loading state for 1.5 seconds
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    dispatch({ type: 'DELETE_ALL_SESSIONS' });
    setIsDeleting(false);
    setDeleteSuccess(true);
    
    // Show success state for 1 second before closing
    setTimeout(() => {
      setShowDeleteConfirmation(false);
      setDeleteSuccess(false);
      onClose();
      router.push('/chat');
    }, 1000);
  };

  const handleDalleSettingChange = (setting, value) => {
    const newSettings = { ...dalleSettings, [setting]: value };
    setDalleSettings(newSettings);
    storage.saveDalleSettings(newSettings);
  };

  const handleReplicateSettingChange = (setting, value) => {
    const newSettings = { 
      ...dalleSettings,
      replicate: {
        ...dalleSettings.replicate,
        [setting]: value
      }
    };
    setDalleSettings(newSettings);
    storage.saveDalleSettings(newSettings);
  };

  const handleSaveSettings = () => {
    storage.saveApiKey(apiKey);
    storage.saveReplicateApiKey(replicateApiKey);
    localStorage.setItem('SELECTED_MODEL', selectedModel);
    storage.saveDalleSettings(dalleSettings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Chat Settings</h3>
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
          </div>

          <div className="space-y-4 pt-6 border-t">
            <h3 className="text-lg font-medium text-gray-900">Image Generation</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model
              </label>
              <select
                value={dalleSettings.model}
                onChange={(e) => handleDalleSettingChange('model', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="dall-e-3">DALL-E 3</option>
                <option value="stability-diffusion-3">Stability Diffusion 3</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image Size
              </label>
              <select
                value={dalleSettings.imageSize}
                onChange={(e) => handleDalleSettingChange('imageSize', e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {imageSizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            {dalleSettings.model === 'dall-e-3' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quality
                </label>
                <select
                  value={dalleSettings.imageQuality}
                  onChange={(e) => handleDalleSettingChange('imageQuality', e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {imageQualities.map(quality => (
                    <option key={quality} value={quality}>
                      {quality.charAt(0).toUpperCase() + quality.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {dalleSettings.model === 'stability-diffusion-3' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scheduler
                  </label>
                  <select
                    value={dalleSettings.replicate?.scheduler || 'DPMSolverMultistep'}
                    onChange={(e) => handleReplicateSettingChange('scheduler', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {replicateSettings.schedulers.map(scheduler => (
                      <option key={scheduler} value={scheduler}>{scheduler}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Inference Steps
                  </label>
                  <select
                    value={dalleSettings.replicate?.steps || 30}
                    onChange={(e) => handleReplicateSettingChange('steps', Number(e.target.value))}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {replicateSettings.steps.map(step => (
                      <option key={step} value={step}>{step}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Guidance Scale
                  </label>
                  <select
                    value={dalleSettings.replicate?.guidanceScale || 7.5}
                    onChange={(e) => handleReplicateSettingChange('guidanceScale', Number(e.target.value))}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {replicateSettings.guidanceScales.map(scale => (
                      <option key={scale} value={scale}>{scale}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 pt-6 border-t">
            <h3 className="text-lg font-medium text-gray-900">API Settings</h3>
            
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Replicate API Key
              </label>
              <div className="flex">
                <input
                  type={showReplicateKey ? 'text' : 'password'}
                  value={replicateApiKey}
                  onChange={(e) => setReplicateApiKey(e.target.value)}
                  className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="r8_..."
                />
                <button
                  onClick={() => setShowReplicateKey(!showReplicateKey)}
                  className="px-4 py-2 border-t border-r border-b rounded-r-lg bg-gray-50"
                >
                  {showReplicateKey ? 'Hide' : 'Show'}
                </button>
              </div>
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

        <button
          onClick={handleSaveSettings}
          className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save Settings
        </button>
      </div>

      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 relative">
            {deleteSuccess ? (
              <div className="flex flex-col items-center py-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <FiCheck className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Successfully Deleted</h3>
                <p className="text-gray-500 text-center mt-2">All chats have been removed</p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Delete All Chats</h3>
                <p className="text-gray-500 mb-6">
                  Are you sure you want to delete all your chat sessions? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDeleteConfirmation(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    disabled={isDeleting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAllChats}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 flex items-center gap-2"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <FiLoader className="w-4 h-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      'Delete All'
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
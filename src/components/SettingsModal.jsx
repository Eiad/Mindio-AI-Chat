import { useState, useEffect } from 'react';
import { FiX, FiAlertTriangle, FiCheck, FiLoader } from 'react-icons/fi';
import { storage } from '../utils/storage';
import { useChat } from '../context/ChatContext';
import { useRouter } from 'next/navigation';
import TabButton from './settings/TabButton';
import GeneralSettings from './settings/GeneralSettings';
import OpenAISettings from './settings/OpenAISettings';
import ReplicateSettings from './settings/ReplicateSettings';

export default function SettingsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('general');
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
  const [selectedAIProvider, setSelectedAIProvider] = useState('openai');

  const handleDeleteAllChats = async () => {
    setIsDeleting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    dispatch({ type: 'DELETE_ALL_SESSIONS' });
    setIsDeleting(false);
    setDeleteSuccess(true);
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
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="border-b mb-6">
          <div className="flex space-x-4">
            <TabButton 
              active={activeTab === 'general'} 
              onClick={() => setActiveTab('general')}
            >
              General
            </TabButton>
            <TabButton 
              active={activeTab === 'openai'} 
              onClick={() => setActiveTab('openai')}
            >
              OpenAI
            </TabButton>
            <TabButton 
              active={activeTab === 'replicate'} 
              onClick={() => setActiveTab('replicate')}
            >
              Replicate
            </TabButton>
          </div>
        </div>

        <div className="space-y-6">
          {activeTab === 'general' && (
            <GeneralSettings
              selectedAIProvider={selectedAIProvider}
              setSelectedAIProvider={setSelectedAIProvider}
              dalleSettings={dalleSettings}
              handleDalleSettingChange={handleDalleSettingChange}
              showDeleteConfirmation={showDeleteConfirmation}
              setShowDeleteConfirmation={setShowDeleteConfirmation}
              handleDeleteAllChats={handleDeleteAllChats}
              isDeleting={isDeleting}
              deleteSuccess={deleteSuccess}
            />
          )}

          {activeTab === 'openai' && (
            <OpenAISettings
              apiKey={apiKey}
              setApiKey={setApiKey}
              showApiKey={showApiKey}
              setShowApiKey={setShowApiKey}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
            />
          )}

          {activeTab === 'replicate' && (
            <ReplicateSettings
              replicateApiKey={replicateApiKey}
              setReplicateApiKey={setReplicateApiKey}
              showReplicateKey={showReplicateKey}
              setShowReplicateKey={setShowReplicateKey}
              dalleSettings={dalleSettings}
              handleReplicateSettingChange={handleReplicateSettingChange}
            />
          )}
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
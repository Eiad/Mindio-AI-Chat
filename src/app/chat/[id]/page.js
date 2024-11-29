'use client';

import { useState } from 'react';
import ChatWindow from '../../../components/ChatWindow';
import SessionList from '../../../components/SessionList';
import { FiMenu } from 'react-icons/fi';
import ConfirmationModal from '../../../components/ConfirmationModal';
import SettingsModal from '../../../components/SettingsModal';
import { useChat } from '../../../context/ChatContext';

export default function ChatPage() {
  const { dispatch } = useChat();
  const [isSessionListOpen, setIsSessionListOpen] = useState(false);
  const [deleteSessionId, setDeleteSessionId] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const toggleSessionList = () => {
    setIsSessionListOpen(!isSessionListOpen);
  };

  const handleDeleteSession = (sessionId) => {
    setDeleteSessionId(sessionId);
  };

  const closeDeleteModal = () => {
    setDeleteSessionId(null);
  };

  const confirmDeleteSession = () => {
    if (deleteSessionId) {
      dispatch({ type: 'DELETE_SESSION', payload: deleteSessionId });
      closeDeleteModal();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div
        className={`
          fixed inset-y-0 left-0 bg-white shadow-md z-40
          transform transition-transform duration-300 ease-in-out
          ${isSessionListOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0
          ${isSessionListOpen ? 'block' : 'hidden md:block'}
        `}
      >
        <SessionList 
          onDeleteSession={handleDeleteSession}
          onOpenSettings={() => setShowSettings(true)}
        />
      </div>

      {!isSessionListOpen && (
        <button
          onClick={toggleSessionList}
          className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center text-2xl text-gray-700 focus:outline-none bg-white rounded-full shadow-lg"
          aria-label="Toggle Session List"
        >
          <FiMenu />
        </button>
      )}

      <div className="flex-1 relative overflow-hidden w-full">
        <ChatWindow />
      </div>

      {deleteSessionId && (
        <ConfirmationModal
          title="Delete Chat"
          message="Are you sure you want to delete this chat? This action cannot be undone."
          onConfirm={confirmDeleteSession}
          onCancel={closeDeleteModal}
        />
      )}

      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}
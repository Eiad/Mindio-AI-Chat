'use client';

import { useState, useEffect } from 'react';
import ChatWindow from '../../../components/ChatWindow';
import SessionList from '../../../components/SessionList';
import SettingsModal from '../../../components/SettingsModal';
import LeftMenuToggleButton from '../../../components/LeftMenuToggleButton';
import { useChat } from '../../../context/ChatContext';
import ConfirmationModal from '../../../components/ConfirmationModal';

export default function ChatPage() {
  const { dispatch } = useChat();
  const [isSessionListOpen, setIsSessionListOpen] = useState(false);
  const [deleteSessionId, setDeleteSessionId] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const toggleSessionList = () => {
    setIsSessionListOpen(!isSessionListOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSessionListOpen(true); // Open on larger screens
      } else {
        setIsSessionListOpen(false); // Close on mobile
      }
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
          fixed inset-y-0 left-0 w-80 bg-white shadow-md z-40
          transform transition-all duration-300 ease-in-out
          ${isSessionListOpen ? 'translate-x-0' : '-translate-x-full'}          
        `}
      >
        <SessionList 
          onDeleteSession={handleDeleteSession}
          onOpenSettings={() => setShowSettings(true)}
        />
      </div>

      <LeftMenuToggleButton 
        isSessionListOpen={isSessionListOpen} 
        toggleSessionList={toggleSessionList} 
      />

      <div className={`
        flex-1 relative overflow-hidden w-full bg-gray-50
        transition-all duration-300 ease-in-out
        ${isSessionListOpen ? 'md:ml-80' : 'ml-0'}
      `}>
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
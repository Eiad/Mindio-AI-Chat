'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { ChatProvider, useChat } from '../../../context/ChatContext';
import ChatWindow from '../../../components/ChatWindow';
import SessionList from '../../../components/SessionList';
import { FiMenu } from 'react-icons/fi';
import ConfirmationModal from '../../../components/ConfirmationModal';

export default function ChatPage() {
  const params = useParams();
  const { dispatch } = useChat();
  const [isSessionListOpen, setIsSessionListOpen] = useState(false);
  const [deleteSessionId, setDeleteSessionId] = useState(null);

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
    <div className="flex h-screen">
      {!isSessionListOpen && (
        <button
          onClick={toggleSessionList}
          className="md:hidden absolute top-4 left-4 z-40 w-10 h-10 flex items-center justify-center text-2xl text-gray-700 focus:outline-none bg-white rounded-full shadow-lg"
          aria-label="Toggle Session List"
        >
          <FiMenu />
        </button>
      )}

      <div
        className={`
          fixed inset-y-0 left-0 w-80 bg-white shadow-md z-50
          transform transition-transform duration-300 ease-in-out
          ${isSessionListOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:relative
        `}
      >
        <SessionList onDeleteSession={handleDeleteSession} />
      </div>

      {isSessionListOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={toggleSessionList}
        ></div>
      )}

      <div className="flex-1">
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
    </div>
  );
}
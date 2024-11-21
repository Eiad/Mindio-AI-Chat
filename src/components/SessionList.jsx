import { useState } from 'react';
import Link from 'next/link';
import { useChat } from '../context/ChatContext';
import { FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import Avatar from './Avatar';
import ConfirmationModal from './ConfirmationModal';

export default function SessionList() {
  const { state, createSession, dispatch } = useChat();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteSessionId, setDeleteSessionId] = useState(null);

  const handleCreateSession = () => {
    const newSessionId = createSession();
    router.push(`/chat/${newSessionId}`);
  };

  const filteredSessions = state.sessions.filter(session =>
    (session.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (session.messages[0]?.content && session.messages[0].content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const openDeleteModal = (sessionId) => {
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
    <div className="w-80 bg-primary text-white shadow-md flex flex-col h-full relative z-[52]">
      <div className="flex flex-col items-stretch p-4 border-b border-gray-700 space-y-4">
        <button
          onClick={handleCreateSession}
          className="flex items-center justify-center space-x-2 px-6 py-2.5 bg-[#4B4B4B] hover:bg-[#3D3D3D] text-white rounded-xl shadow-sm transition-all duration-200 w-full"
          aria-label="Create New Chat"
        >
          <span className="text-xl">💭</span>
          <span className="font-medium">New Chat</span>
        </button>
        <div className="relative w-full">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-primary-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder-gray-400"
            aria-label="Search Chats"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <Link
              key={session.id}
              href={`/chat/${session.id}`}
              className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                session.id === state.activeSessionId
                  ? 'bg-blue-700'
                  : 'hover:bg-primary-light'
              }`}
              aria-label={`Chat session: ${session.title}`}
            >
              <Avatar name={session.title} />
              <div className="flex-1 ml-3">
                <h3 className="text-sm font-medium">{session.title}</h3>
                <p className="text-xs text-gray-300 truncate">
                  {session.messages[0]?.content.substring(0, 40) || 'No messages yet.'}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-400">
                  {new Date(session.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    openDeleteModal(session.id);
                  }}
                  className="mt-1 text-red-400 hover:text-red-600 focus:outline-none"
                  aria-label={`Delete chat session: ${session.title}`}
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-400">No chats found.</p>
        )}
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
import { useChat } from '../context/ChatContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';
import { useState } from 'react';
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
    <div className="w-80 bg-white shadow-md flex flex-col h-full">
      <div className="flex flex-col items-stretch p-4 border-b bg-gray-50 space-y-4">
        <button
          onClick={handleCreateSession}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          aria-label="Create New Chat"
        >
          <FiPlus className="w-5 h-5" />
          <span className="font-semibold">New Chat</span>
        </button>
        <div className="relative w-full">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            aria-label="Search Chats"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-100">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <Link
              key={session.id}
              href={`/chat/${session.id}`}
              className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                session.id === state.activeSessionId
                  ? 'bg-blue-100'
                  : 'hover:bg-white'
              }`}
              aria-label={`Chat session: ${session.title}`}
            >
              <Avatar name={session.title} />
              <div className="flex-1 ml-3">
                <h3 className="text-sm font-medium text-gray-800">{session.title}</h3>
                <p className="text-xs text-gray-500 truncate">
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
                  className="mt-1 text-red-500 hover:text-red-700 focus:outline-none"
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
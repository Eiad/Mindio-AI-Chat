import Link from 'next/link';
import { FiTrash2, FiMessageSquare, FiClock } from 'react-icons/fi';
import Avatar from '../Avatar';

export default function SessionListItem({ session, isActive, onDelete }) {
  const handleDeleteClick = (e) => {
    e.preventDefault();
    onDelete(session.id, e);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <Link
      href={`/chat/${session.id}`}
      className={`group relative flex flex-col p-4 rounded-lg transition-all duration-200 ${
        isActive 
          ? 'bg-blue-700 text-white' 
          : 'hover:bg-gray-100'
      }`}
      aria-label={`Chat session: ${session.title}`}
    >
      <button
        onClick={handleDeleteClick}
        className={`absolute -top-2 -right-2 p-2 rounded-full shadow-md z-10
          ${isActive 
            ? 'bg-blue-800 text-white hover:bg-blue-900' 
            : 'bg-gray-200 text-gray-600 hover:bg-red-500 hover:text-white'
          } 
          opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-90 group-hover:scale-100`}
        aria-label={`Delete chat session: ${session.title}`}
      >
        <FiTrash2 className="w-4 h-4" />
      </button>

      <div className="flex items-start space-x-3">
        <Avatar name={session.title} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium truncate pr-2">
              {session.title}
            </h3>
            <div className="flex items-center space-x-1 text-xs">
              <FiClock className={`w-3 h-3 ${isActive ? 'text-blue-200' : 'text-gray-400'}`} />
              <span className={isActive ? 'text-blue-200' : 'text-gray-400'}>
                {formatTime(session.createdAt)}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <FiMessageSquare className={`w-3 h-3 ${
              isActive ? 'text-blue-200' : 'text-gray-400'
            }`} />
            <p className={`text-xs truncate ${
              isActive ? 'text-blue-200' : 'text-gray-400'
            }`}>
              {session.messages[0]?.content.substring(0, 50) || 'No messages yet.'}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
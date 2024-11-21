import { FiSearch } from 'react-icons/fi';

export default function SessionHeader({ onCreateSession, searchTerm, onSearchChange }) {
  return (
    <div className="flex flex-col items-stretch p-4 border-b border-gray-700 space-y-4">
      <button
        onClick={onCreateSession}
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
          onChange={onSearchChange}
          className="w-full pl-10 pr-4 py-2 bg-primary-light border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder-gray-400"
          aria-label="Search Chats"
        />
      </div>
    </div>
  );
}
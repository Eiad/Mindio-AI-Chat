import { useChat } from '../context/ChatContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiTrash } from 'react-icons/fi';

export default function SessionList() {
  const { state, createSession, dispatch } = useChat();
  const router = useRouter();

  const handleCreateSession = () => {
    const newSessionId = createSession();
    router.push(`/chat/${newSessionId}`);
  };

  const handleDeleteSession = (e, sessionId) => {
    e.stopPropagation();
    e.preventDefault();
    if (confirm('Are you sure you want to delete this chat?')) {
      dispatch({ type: 'DELETE_SESSION', payload: sessionId });
    }
  };

  return (
    <div className="w-72 bg-[#1e2837] text-white flex flex-col h-full">
      <div className="p-3">
        <button
          onClick={handleCreateSession}
          className="w-full flex items-center space-x-2 px-4 py-2 bg-[#2c3a4a] hover:bg-[#374557] rounded-lg"
        >
          <span>💬</span>
          <span>New Chat</span>
        </button>
        
        <div className="mt-4 flex items-center space-x-2 px-3">
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full bg-[#2c3a4a] text-white placeholder-gray-400 px-3 py-1.5 rounded-lg focus:outline-none"
          />
          <button className="p-1.5 hover:bg-[#374557] rounded-lg">📎</button>
          <button className="p-1.5 hover:bg-[#374557] rounded-lg">🔄</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 p-2">
        {state.sessions.map((session) => (
          <div key={session.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#2c3a4a]">
            <Link
              href={`/chat/${session.id}`}
              className={`flex items-center flex-grow space-x-3 ${
                session.id === state.activeSessionId ? 'bg-[#374557] rounded-lg' : ''
              }`}
            >
              <span className="mr-3">💭</span>
              <div className="flex-1 min-w-0">
                <div className="truncate text-sm">
                  {session.messages[0]?.content.substring(0, 30) || 'New Chat'}
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(session.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </Link>
            <button
              onClick={(e) => handleDeleteSession(e, session.id)}
              className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
              title="Delete Chat"
            >
              <FiTrash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useChat } from '../context/ChatContext';
import SessionHeader from './session/SessionHeader';
import SessionListItem from './session/SessionListItem';
import { FiSettings } from 'react-icons/fi';
import SettingsModal from './SettingsModal';

export default function SessionList({ onDeleteSession }) {
  const { state, createSession } = useChat();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const handleCreateSession = (e) => {
    e?.preventDefault?.();
    const newSessionId = createSession();
    return false; // Prevent any default actions
  };

  const filteredSessions = state.sessions.filter(session =>
    (session.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (session.messages[0]?.content && session.messages[0].content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="w-80 bg-primary text-white shadow-md flex flex-col h-full relative z-[52]">
      <SessionHeader 
        onCreateSession={handleCreateSession}
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
      />
      <button
        onClick={() => setShowSettings(true)}
        className="w-full px-4 py-2 mt-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
      >
        <FiSettings className="w-4 h-4" />
        <span>Settings</span>
      </button>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <SessionListItem
              key={session.id}
              session={session}
              isActive={session.id === state.activeSessionId}
              onDelete={onDeleteSession}
            />
          ))
        ) : (
          <p className="text-center text-gray-400">No chats found.</p>
        )}
      </div>
      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}
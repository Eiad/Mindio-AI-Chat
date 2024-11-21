import { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { useRouter } from 'next/navigation';
import SessionHeader from './session/SessionHeader';
import SessionListItem from './session/SessionListItem';

export default function SessionList({ onDeleteSession }) {
  const { state, createSession } = useChat();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateSession = () => {
    const newSessionId = createSession();
    router.push(`/chat/${newSessionId}`);
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
    </div>
  );
}
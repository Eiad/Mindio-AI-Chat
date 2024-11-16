import { useChat } from '../context/ChatContext';

export default function SessionList() {
  const { state, dispatch } = useChat();

  return (
    <div className="w-64 border-r p-4 space-y-4">
      <button
        onClick={() => dispatch({ type: 'CREATE_SESSION' })}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        New Chat
      </button>
      
      <div className="space-y-2">
        {state.sessions.map((session) => (
          <div
            key={session.id}
            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
              session.id === state.activeSessionId
                ? 'bg-blue-100'
                : 'hover:bg-gray-100'
            }`}
            onClick={() => dispatch({ type: 'SET_ACTIVE_SESSION', payload: session.id })}
          >
            <span className="truncate">
              {session.messages[0]?.content.substring(0, 30) || 'New Chat'}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                dispatch({ type: 'DELETE_SESSION', payload: session.id });
              }}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
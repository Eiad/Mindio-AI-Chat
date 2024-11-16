import { createContext, useContext, useReducer, useEffect } from 'react';
import { storage } from '../utils/storage';

const ChatContext = createContext();

const initialState = {
  sessions: [],
  activeSessionId: null,
  settings: {
    apiKey: '',
    temperature: 0.7,
    maxTokens: 1000,
    darkMode: false,
    outputFormat: 'default',
    tone: 'default',
    writingStyle: 'default',
    language: 'default'
  }
};

function chatReducer(state, action) {
  switch (action.type) {
    case 'INIT_SESSIONS':
      return {
        ...state,
        sessions: action.payload,
        activeSessionId: action.payload[0]?.id || null
      };
    case 'CREATE_SESSION':
      const newSession = {
        id: Date.now().toString(),
        messages: [],
        createdAt: new Date().toISOString()
      };
      storage.saveSession(newSession);
      return {
        ...state,
        sessions: [...state.sessions, newSession],
        activeSessionId: newSession.id
      };
    case 'DELETE_SESSION':
      storage.deleteSession(action.payload);
      return {
        ...state,
        sessions: state.sessions.filter(s => s.id !== action.payload),
        activeSessionId: state.activeSessionId === action.payload
          ? state.sessions[0]?.id
          : state.activeSessionId
      };
    case 'SET_ACTIVE_SESSION':
      return {
        ...state,
        activeSessionId: action.payload
      };
    case 'ADD_MESSAGE':
      const messageSession = state.sessions.find(s => s.id === state.activeSessionId);
      const updatedMessages = [...messageSession.messages, {
        ...action.payload,
        type: action.payload.type || 'text'
      }];
      const updatedSessionWithMessage = {
        ...messageSession,
        messages: updatedMessages
      };
      storage.saveSession(updatedSessionWithMessage);
      return {
        ...state,
        sessions: state.sessions.map(s =>
          s.id === state.activeSessionId ? updatedSessionWithMessage : s
        )
      };
    default:
      return state;
  }
}

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  useEffect(() => {
    const sessions = storage.getSessions();
    dispatch({ type: 'INIT_SESSIONS', payload: sessions });
  }, []);

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
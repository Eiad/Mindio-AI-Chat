'use client';

import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';
import { useRouter, usePathname } from 'next/navigation';

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
    language: 'default',
    contextWindow: 10, // Number of messages chat history for AI to consider
  },
  apiKey: null,
  showApiKeyModal: false,
  pendingAction: null,
};

function chatReducer(state, action) {
  switch (action.type) {
    case 'INIT_SESSIONS':
      return {
        ...state,
        sessions: action.payload,
        activeSessionId: action.payload[0]?.id || null,
      };
    case 'CREATE_SESSION':
      const newSession = action.payload;
      storage.saveSession(newSession);
      return {
        ...state,
        sessions: [...state.sessions, newSession],
        activeSessionId: newSession.id, // Set the new session as active
      };
    case 'DELETE_SESSION':
      storage.deleteSession(action.payload);
      const remainingSessions = state.sessions.filter(s => s.id !== action.payload);
      return {
        ...state,
        sessions: remainingSessions,
        activeSessionId:
          state.activeSessionId === action.payload
            ? remainingSessions[0]?.id || null
            : state.activeSessionId,
      };
    case 'SET_ACTIVE_SESSION':
      return {
        ...state,
        activeSessionId: action.payload,
      };
    case 'ADD_MESSAGE':
      const messageSession = state.sessions.find(s => s.id === state.activeSessionId);
      if (!messageSession) return state;

      const newMessage = {
        ...action.payload,
        id: action.payload.messageId || Date.now().toString(),
        parentMessageId: action.payload.parentMessageId || null,
        contextType: action.payload.contextType || 'chat',
      };

      const updatedMessages = [...messageSession.messages, newMessage];
      const updatedSessionWithMessage = {
        ...messageSession,
        messages: updatedMessages,
        lastContext: newMessage.contextType,
      };

      storage.saveSession(updatedSessionWithMessage);
      return {
        ...state,
        sessions: state.sessions.map(s =>
          s.id === state.activeSessionId ? updatedSessionWithMessage : s
        ),
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload,
        },
      };
    case 'UPDATE_SESSION_TITLE':
      const { sessionId, title } = action.payload;
      const updatedSessions = state.sessions.map(s =>
        s.id === sessionId ? { ...s, title } : s
      );
      storage.saveSession(updatedSessions.find(s => s.id === sessionId));
      return {
        ...state,
        sessions: updatedSessions,
      };
    case 'SET_API_KEY':
      return {
        ...state,
        apiKey: action.payload,
      };
    case 'TOGGLE_API_KEY_MODAL':
      return {
        ...state,
        showApiKeyModal: action.payload,
      };
    case 'DELETE_ALL_SESSIONS':
      storage.deleteAllSessions();
      return {
        ...state,
        sessions: [],
        activeSessionId: null,
      };
    case 'EDIT_MESSAGE':
      const { messageId, message } = action.payload;
      const sessionToUpdate = state.sessions.find(s => s.id === state.activeSessionId);
      if (!sessionToUpdate) return state;

      const messageIndex = sessionToUpdate.messages.findIndex(m => m.messageId === messageId);
      if (messageIndex === -1) return state;

      const editedMessages = sessionToUpdate.messages.slice(0, messageIndex);
      editedMessages.push(message);

      const updatedSession = {
        ...sessionToUpdate,
        messages: editedMessages,
      };

      storage.saveSession(updatedSession);
      return {
        ...state,
        sessions: state.sessions.map(s =>
          s.id === state.activeSessionId ? updatedSession : s
        ),
      };
    case 'SET_PENDING_ACTION':
      return {
        ...state,
        pendingAction: action.payload
      };
    default:
      return state;
  }
}

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const router = useRouter();
  const pathname = usePathname();

  const createSession = useCallback(() => {
    const apiKey = storage.getApiKey();
    
    if (!apiKey) {
      dispatch({ type: 'TOGGLE_API_KEY_MODAL', payload: true });
      dispatch({ type: 'SET_PENDING_ACTION', payload: 'createSession' });
      return null;
    }

    const newSession = {
      id: Date.now().toString(),
      messages: [],
      createdAt: new Date().toISOString(),
      title: 'New Chat',
    };

    dispatch({ type: 'CREATE_SESSION', payload: newSession });
    
    // Force a synchronous state update before navigation
    Promise.resolve().then(() => {
      router.push(`/chat/${newSession.id}`);
    });
    
    return newSession.id;
  }, [router, dispatch]);

  useEffect(() => {
    const sessions = storage.getSessions();
    if (sessions.length > 0) {
      dispatch({ type: 'INIT_SESSIONS', payload: sessions });
    }
  }, []);

  // Remove the pathname effect that was causing the navigation loop
  useEffect(() => {
    if (!pathname || pathname === '/chat') return;
    
    const sessionId = pathname.split('/').pop();
    const sessionExists = state.sessions.some(s => s.id === sessionId);
    
    if (sessionExists) {
      dispatch({ type: 'SET_ACTIVE_SESSION', payload: sessionId });
    }
  }, [pathname, state.sessions]);

  return (
    <ChatContext.Provider value={{ state, dispatch, createSession }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
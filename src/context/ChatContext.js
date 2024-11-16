import { createContext, useContext, useReducer } from 'react';

const ChatContext = createContext();

const initialState = {
  messages: [],
  settings: {
    apiKey: '',
    temperature: 0.7,
    maxTokens: 1000,
    darkMode: false
  }
};

function chatReducer(state, action) {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    case 'CLEAR_CHAT':
      return {
        ...state,
        messages: []
      };
    default:
      return state;
  }
}

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
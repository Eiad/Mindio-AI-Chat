import { useState } from 'react';
import { useChat } from '../context/ChatContext';
import MessageBubble from './MessageBubble';
import { fetchChatResponse } from '../utils/apiClient';

export default function ChatWindow() {
  const [input, setInput] = useState('');
  const { state, dispatch } = useChat();
  
  const activeSession = state.sessions.find(s => s.id === state.activeSessionId);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim() || !activeSession) return;
    
    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };
    
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    setInput('');
    
    try {
      const response = await fetchChatResponse(input);
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          role: 'assistant',
          content: response,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Failed to get response:', error);
    }
  };

  if (!activeSession) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">Select or create a chat to get started</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeSession.messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
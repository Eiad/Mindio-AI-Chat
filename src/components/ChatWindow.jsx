import { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import MessageBubble from './MessageBubble';
import { fetchChatResponse, fetchImageGeneration } from '../utils/apiClient';
import Header from './Header';
import AgentCard from './AgentCard';
import ChatControls from './ChatControls';

export default function ChatWindow() {
  const [input, setInput] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const { state, dispatch } = useChat();
  const messagesEndRef = useRef(null);
  const activeSession = state.sessions.find(s => s.id === state.activeSessionId);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  // Scroll on messages change or active session change
  useEffect(() => {
    if (activeSession?.messages?.length > 0) {
      scrollToBottom();
    }
  }, [activeSession?.messages]);

  // Scroll when switching sessions
  useEffect(() => {
    if (state.activeSessionId) {
      scrollToBottom();
    }
  }, [state.activeSessionId]);
  
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
      const response = await fetchChatResponse(input, state.settings);
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
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date().toISOString()
        }
      });
    }
  };

  const handleImageGeneration = async () => {
    if (!input.trim() || !activeSession) return;
    
    setIsGeneratingImage(true);
    const userMessage = {
      role: 'user',
      content: input,
      type: 'text',
      timestamp: new Date().toISOString()
    };
    
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    
    try {
      const { imageUrl, revisedPrompt } = await fetchImageGeneration(input);
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          role: 'assistant',
          content: imageUrl,
          type: 'image',
          revisedPrompt,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Failed to generate image:', error);
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          role: 'assistant',
          content: error.message || 'Failed to generate image. Please try again.',
          type: 'text',
          timestamp: new Date().toISOString()
        }
      });
    } finally {
      setInput('');
      setIsGeneratingImage(false);
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
    <div className="flex-1 flex flex-col h-screen bg-white">
      <Header />
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto py-4 px-6">
          {!state.activeSessionId ? (
            <div className="flex flex-col items-center justify-center h-full space-y-6">
              <h2 className="text-2xl font-semibold">Welcome to TypingMind</h2>
              <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
                {/* Agent cards */}
                <AgentCard
                  icon="🎥"
                  title="YouTube Content Writer"
                  description="A YouTube content writer specialized in creating engaging content"
                />
                {/* Add more agent cards */}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {activeSession?.messages.map((message, index) => (
                <MessageBubble key={index} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>
      
      <div className="border-t p-4">
        <div className="max-w-3xl mx-auto">
          <ChatControls 
            settings={state.settings}
            onSettingsChange={(key, value) => 
              dispatch({ 
                type: 'UPDATE_SETTINGS', 
                payload: { [key]: value } 
              })
            }
          />
          <div className="flex items-end space-x-2">
            <div className="flex-1 border rounded-lg bg-white">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="w-full p-3 focus:outline-none resize-none"
                rows={1}
              />
            </div>
            <button
              onClick={handleImageGeneration}
              disabled={isGeneratingImage || !input.trim()}
              className={`px-4 py-3 rounded-lg ${
                isGeneratingImage || !input.trim()
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
              }`}
            >
              {isGeneratingImage ? '🔄' : '🎨'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className={`px-4 py-3 rounded-lg ${
                !input.trim()
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
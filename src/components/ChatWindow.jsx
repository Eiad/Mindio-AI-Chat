import { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import MessageBubble from './MessageBubble';
import { fetchChatResponse, fetchImageGeneration } from '../utils/apiClient';
import Header from './Header';
import AgentCard from './AgentCard';
import ChatControls from './ChatControls';
import ChatInput from './ChatInput';
import { FiSettings } from 'react-icons/fi';
import styles from './ChatWindow.module.scss';

export default function ChatWindow() {
  const [input, setInput] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { state, dispatch } = useChat();
  const messagesEndRef = useRef(null);
  const activeSession = state.sessions.find(s => s.id === state.activeSessionId);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [showControls, setShowControls] = useState(false);
  
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
  
  const handleSubmit = async (message) => {
    if (!message.trim() || !activeSession) return;
    
    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
      messageId: Date.now().toString()
    };
    
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    setIsLoading(true);
    
    try {
      const recentMessages = activeSession.messages.slice(-10);
      
      const response = await fetchChatResponse(
        message, 
        state.settings,
        recentMessages
      );
      
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          role: 'assistant',
          content: response,
          timestamp: new Date().toISOString(),
          parentMessageId: userMessage.messageId,
          contextType: 'chat'
        }
      });
    } catch (error) {
      console.error('Failed to get response:', error);
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date().toISOString(),
          parentMessageId: userMessage.messageId,
          contextType: 'error'
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageGeneration = async (prompt) => {
    if (!prompt.trim() || !activeSession) return;
    
    setIsGeneratingImage(true);
    const userMessage = {
      role: 'user',
      content: prompt,
      type: 'text',
      timestamp: new Date().toISOString(),
      messageId: Date.now().toString()
    };
    
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    
    try {
      const { imageUrl, revisedPrompt } = await fetchImageGeneration(prompt);
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          role: 'assistant',
          content: imageUrl,
          type: 'image',
          revisedPrompt,
          timestamp: new Date().toISOString(),
          parentMessageId: userMessage.messageId
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
          timestamp: new Date().toISOString(),
          parentMessageId: userMessage.messageId
        }
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(input);
    }
  };

  const handleImageUpload = async (file, text) => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('text', text || 'Analyze this image');

    try {
      const userMessage = {
        role: 'user',
        content: text || 'Analyzing image...',
        type: 'text',
        timestamp: new Date().toISOString(),
        messageId: Date.now().toString()
      };
      
      dispatch({ type: 'ADD_MESSAGE', payload: userMessage });

      const response = await fetch('/api/process-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Processing failed');
      }

      const data = await response.json();
      
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          role: 'assistant',
          content: data.analysis,
          type: 'text',
          timestamp: new Date().toISOString(),
          parentMessageId: userMessage.messageId,
          contextType: 'image-analysis'
        }
      });
    } catch (error) {
      console.error('Image handling error:', error);
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          role: 'assistant',
          content: 'Failed to process image. Please try again.',
          type: 'error',
          timestamp: new Date().toISOString()
        }
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (file, question) => {
    setIsProcessing(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('question', question);

    try {
      const response = await fetch('/api/process-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Processing failed');
      }

      const data = await response.json();
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          role: 'assistant',
          content: data.summary,
          type: 'text',
          timestamp: new Date().toISOString(),
        }
      });
    } catch (error) {
      console.error('PDF handling error:', error);
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          role: 'assistant',
          content: error.message || 'Failed to process PDF. Please try again.',
          type: 'error',
          timestamp: new Date().toISOString(),
        }
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSettingsChange = (key, value) => {
    if (key === 'showControls') {
      setShowControls(value);
    } else {
      dispatch({ 
        type: 'UPDATE_SETTINGS', 
        payload: { [key]: value } 
      });
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
    <div className="flex-1 flex flex-col h-full relative">
      <div className={`flex-1 overflow-y-auto p-4 ${styles.mainChatContainer}`}>
        {activeSession.messages.map((message) => (
          <MessageBubble key={message.timestamp} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      {isProcessing && (
        <div
          className="absolute bottom-150 left-1/2 transform -translate-x-1/2"
          style={{
            fontSize: '12px',
            bottom: '150px',
            background: '#00000090',
            color: '#fff',
            width: '200px',
            textAlign: 'center',
            padding: '8px',
            borderRadius: '4px',
            zIndex: 10,
          }}
        >
          Processing...
        </div>
      )}

      <div className="border-t p-4">
        {showControls && (
          <ChatControls 
            settings={state.settings}
            onSettingsChange={handleSettingsChange}
          />
        )}
        <ChatInput 
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onImageUpload={handleImageUpload}
          onFileUpload={handleFileUpload}
          onImageGenerate={handleImageGeneration}
          isProcessingFile={isProcessing}
          isGeneratingImage={isGeneratingImage}
          onToggleControls={() => setShowControls(!showControls)}
        />
      </div>
    </div>
  );
}
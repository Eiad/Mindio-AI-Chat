import { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import MessageBubble from './MessageBubble';
import { fetchChatResponse, fetchImageGeneration } from '../utils/apiClient';
import ChatControls from './ChatControls';
import ChatInput from './ChatInput';
import ImageGenerationLoader from './ImageGenerationLoader';
import ApiKeyModal from './ApiKeyModal';
import { useSessionStorage } from '../hooks/useSessionStorage';
import WelcomeScreen from './WelcomeScreen';
import styles from './ChatWindow.module.scss';
import { FiLoader } from 'react-icons/fi';

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
  const [apiKey] = useSessionStorage('OPENAI_API_KEY', '');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  useEffect(() => {
    if (activeSession?.messages?.length > 0) {
      scrollToBottom();
    }
  }, [activeSession?.messages]);

  useEffect(() => {
    if (state.activeSessionId) {
      scrollToBottom();
    }
  }, [state.activeSessionId]);

  const handleSubmit = async (message, type = 'text') => {
    if (!apiKey) {
      dispatch({ type: 'TOGGLE_API_KEY_MODAL', payload: true });
      return;
    }
    
    if (!message.trim() || !activeSession || isLoading) return;
    
    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
      messageId: Date.now().toString()
    };
    
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    setIsLoading(true);
    
    try {
      // Get recent messages for context
      const contextMessages = activeSession.messages
        .slice(-state.settings.contextWindow)
        .map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp,
          messageId: msg.messageId || msg.id
        }));
      
      const response = await fetchChatResponse(
        message, 
        state.settings,
        contextMessages
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
          content: error.message || 'Sorry, I encountered an error. Please try again.',
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
    if (!apiKey) {
      dispatch({ type: 'TOGGLE_API_KEY_MODAL', payload: true });
      return;
    }

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
      return true;
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
    const apiKey = sessionStorage.getItem('OPENAI_API_KEY');
    if (!apiKey) {
      dispatch({ type: 'TOGGLE_API_KEY_MODAL', payload: true });
      return;
    }

    setIsProcessing(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('text', text || 'Analyze this image');

    // Create a file reader to get image preview
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    const userMessage = {
      role: 'user',
      content: text || 'Analyze this image',
      type: 'image',
      imageUrl: await new Promise(resolve => {
        reader.onloadend = () => resolve(reader.result);
      }),
      timestamp: new Date().toISOString(),
      messageId: Date.now().toString()
    };

    dispatch({
      type: 'ADD_MESSAGE',
      payload: userMessage
    });

    try {
      const response = await fetch('/api/process-image', {
        method: 'POST',
        headers: {
          'X-API-KEY': apiKey
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process image');
      }

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
          content: error.message || 'Failed to process image. Please try again.',
          type: 'error',
          timestamp: new Date().toISOString()
        }
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (file, question) => {
    const apiKey = sessionStorage.getItem('OPENAI_API_KEY');
    if (!apiKey) {
      dispatch({ type: 'TOGGLE_API_KEY_MODAL', payload: true });
      return;
    }

    setIsProcessing(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('question', question);

    try {
      const response = await fetch('/api/process-pdf', {
        method: 'POST',
        headers: {
          'X-API-KEY': apiKey
        },
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

  useEffect(() => {
    const storedApiKey = sessionStorage.getItem('OPENAI_API_KEY');
    if (!storedApiKey || storedApiKey === 'undefined' || storedApiKey === 'null') {
      dispatch({ type: 'TOGGLE_API_KEY_MODAL', payload: true });
    }
  }, [dispatch]);

  if (!activeSession) {
    return <WelcomeScreen />;
  }

  return (
    <>
      <ApiKeyModal 
        isOpen={state.showApiKeyModal} 
        onClose={() => dispatch({ type: 'TOGGLE_API_KEY_MODAL', payload: false })}
      />
      <div className="flex-1 flex flex-col h-full relative bg-gray-50">
        <div className={`flex-1 overflow-y-auto p-6 ${styles.mainChatContainer}`}>
          <div className="space-y-6">
            {activeSession.messages.map((message, index) => (
              <MessageBubble 
                key={message.timestamp} 
                message={message}
                previousMessage={index > 0 ? activeSession.messages[index - 1] : null}
              />
            ))}
          </div>
          <div ref={messagesEndRef} />
        </div>

        {isProcessing && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 flex items-center space-x-4">
              <FiLoader className="animate-spin text-xl text-blue-500" />
              <span className="text-gray-700 font-medium">Processing your request...</span>
            </div>
          </div>
        )}

        {isGeneratingImage && <ImageGenerationLoader />}

        <div className="border-t bg-white p-4 shadow-lg">
          {showControls && (
            <div className="mb-4">
              <ChatControls 
                settings={state.settings}
                onSettingsChange={handleSettingsChange}
              />
            </div>
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
    </>
  );
}
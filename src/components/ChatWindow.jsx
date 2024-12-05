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
import ActiveSessionWelcome from './ActiveSessionWelcome';
import styles from './ChatWindow.module.scss';
import { FiLoader } from 'react-icons/fi';
import { storage } from '../utils/storage';

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
  const [editingMessage, setEditingMessage] = useState(null);
  const [editingInput, setEditingInput] = useState('');

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

  const handleEditMessage = (message) => {
    if (message.type === 'file' || message.type === 'system') {
      return;
    }

    setEditingMessage(message);
    if (!message.type || message.type === 'text') {
      setInput(message.content);
      return;
    }
    
    if (message.type === 'image') {
      const textContent = message.content || 'Analyze this image';
      setInput(textContent);
      return;
    }
  };

  const cancelEditing = () => {
    setEditingMessage(null);
    setEditingInput('');
    setInput('');
  };

  const handleSubmit = async (message, type = 'text') => {
    const apiKey = storage.getApiKey();
    if (!apiKey) {
      dispatch({ type: 'TOGGLE_API_KEY_MODAL', payload: true });
      return;
    }
    
    if (!message.trim() || !activeSession || isLoading) return;
    
    if (editingMessage) {
      const editedMessage = {
        ...editingMessage,
        content: message,
        timestamp: new Date().toISOString(),
        isEdited: true
      };

      dispatch({ 
        type: 'EDIT_MESSAGE', 
        payload: { 
          messageId: editingMessage.messageId,
          message: editedMessage 
        } 
      });

      setIsLoading(true);

      try {
        const contextMessages = activeSession.messages
          .slice(0, activeSession.messages.findIndex(m => m.messageId === editingMessage.messageId))
          .map(msg => ({
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp,
            messageId: msg.messageId || msg.id
          }));

        contextMessages.push({
          role: 'user',
          content: message,
          timestamp: new Date().toISOString(),
          messageId: editedMessage.messageId
        });

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
            parentMessageId: editedMessage.messageId,
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
            parentMessageId: editedMessage.messageId,
            contextType: 'error'
          }
        });
      } finally {
        setIsLoading(false);
        setEditingMessage(null);
        setEditingInput('');
        setInput('');
      }
      return;
    }
    
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

  const handleImageGeneration = async (prompt, editingMsg = null) => {
    if (!apiKey) {
      dispatch({ type: 'TOGGLE_API_KEY_MODAL', payload: true });
      return;
    }

    if (!prompt.trim() || !activeSession) return;
    
    setIsGeneratingImage(true);

    if (editingMsg) {
      // Handle editing case
      const editedMessage = {
        ...editingMsg,
        content: prompt,
        timestamp: new Date().toISOString(),
        isEdited: true
      };

      dispatch({ 
        type: 'EDIT_MESSAGE', 
        payload: { 
          messageId: editingMsg.messageId,
          message: editedMessage 
        } 
      });

      try {
        const contextMessages = activeSession.messages
          .slice(0, activeSession.messages.findIndex(m => m.messageId === editingMsg.messageId))
          .map(msg => ({
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp,
            messageId: msg.messageId || msg.id
          }));

        const response = await fetchImageGeneration(prompt, contextMessages);
        
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            role: 'assistant',
            content: response.imageUrl,
            type: 'image',
            revisedPrompt: response.revisedPrompt,
            timestamp: new Date().toISOString(),
            parentMessageId: editedMessage.messageId
          }
        });
      } catch (error) {
        console.error('Failed to generate image:', error);
        dispatch({
          type: 'ADD_MESSAGE',
          payload: {
            role: 'assistant',
            content: error.message || 'Failed to generate image. Please try again.',
            type: 'error',
            timestamp: new Date().toISOString(),
            parentMessageId: editedMessage.messageId
          }
        });
      } finally {
        setIsGeneratingImage(false);
        setEditingMessage(null);
        setEditingInput('');
      }
      return;
    }

    const userMessage = {
      role: 'user',
      content: prompt,
      type: 'text',
      timestamp: new Date().toISOString(),
      messageId: Date.now().toString()
    };
    
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    
    try {
      const { imageUrl, revisedPrompt } = await fetchImageGeneration(
        prompt, 
        activeSession.messages || []
      );
      
      // Convert blob URL to actual image URL if needed
      let finalImageUrl = imageUrl;
      if (imageUrl.startsWith('blob:')) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        finalImageUrl = URL.createObjectURL(blob);
      }

      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          role: 'assistant',
          content: finalImageUrl,
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
          type: 'error',
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

  const handleImageUpload = async (file, text, editingMsg = null) => {
    const apiKey = storage.getApiKey();
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
    
    const messageContent = {
      role: 'user',
      content: text || 'Analyze this image',
      type: 'image',
      imageUrl: await new Promise(resolve => {
        reader.onloadend = () => resolve(reader.result);
      }),
      timestamp: new Date().toISOString(),
      messageId: editingMsg ? editingMsg.messageId : Date.now().toString()
    };

    if (editingMsg) {
      dispatch({
        type: 'EDIT_MESSAGE',
        payload: {
          messageId: editingMsg.messageId,
          message: messageContent
        }
      });
    } else {
      dispatch({
        type: 'ADD_MESSAGE',
        payload: messageContent
      });
    }

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
          parentMessageId: messageContent.messageId,
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
      if (editingMsg) {
        setEditingMessage(null);
      }
    }
  };

  const handleFileUpload = async (file, text, endpoint, editingMsg = null) => {
    const apiKey = storage.getApiKey();
    if (!apiKey) {
      dispatch({ type: 'TOGGLE_API_KEY_MODAL', payload: true });
      return;
    }

    setIsProcessing(true);
    // Determine file type and endpoint first
    const fileType = file.type || (file.name.endsWith('.html') ? 'text/html' : 'application/octet-stream');
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('text', text); // Remove the default text to allow the user's query to pass through
    formData.append('smartPrompt', `Please analyze this file's content and provide:
      1. Document type identification and purpose
      2. A quick, focused summary
      3. Key points or findings
      4. Specific suggested actions or questions
      5. Any important patterns or structures (if applicable)
      6. Potential issues or recommendations

      If the content is not readable or supported:
      1. Explain why it couldn't be processed
      2. Suggest alternative approaches
      3. Recommend file formats or content types that would work better`);
    
    const messageContent = {
      role: 'user',
      content: text || `Analyzing file: ${file.name}`,
      type: 'file',
      fileName: file.name,
      fileType: fileType,
      timestamp: new Date().toISOString(),
      messageId: editingMsg ? editingMsg.messageId : Date.now().toString()
    };

    if (editingMsg) {
      dispatch({
        type: 'EDIT_MESSAGE',
        payload: {
          messageId: editingMsg.messageId,
          message: messageContent
        }
      });
    } else {
      dispatch({
        type: 'ADD_MESSAGE',
        payload: messageContent
      });
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'X-API-KEY': apiKey
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process file');
      }

      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          role: 'assistant',
          content: data.summary || data.analysis,
          type: 'text',
          timestamp: new Date().toISOString(),
          parentMessageId: messageContent.messageId,
          contextType: fileType === 'application/pdf' ? 'pdf-analysis' : 'file-analysis'
        }
      });
    } catch (error) {
      console.error('File handling error:', error);
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          role: 'assistant',
          content: error.message || 'Failed to process file. Please try again.',
          type: 'error',
          timestamp: new Date().toISOString()
        }
      });
    } finally {
      setIsProcessing(false);
      if (editingMsg) {
        setEditingMessage(null);
      }
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
    const storedApiKey = storage.getApiKey();
    if (!storedApiKey) {
      dispatch({ type: 'TOGGLE_API_KEY_MODAL', payload: true });
    }
  }, [dispatch]);

  if (!activeSession || (activeSession && activeSession.messages.length === 0)) {
    return (
      <div className="flex flex-col h-full">        
        <div className="flex-1">
          {!activeSession ? (
            <WelcomeScreen />
          ) : (
            <ActiveSessionWelcome />
          )}
        </div>
        
        <div className="w-full">
          <ApiKeyModal 
            isOpen={state.showApiKeyModal} 
            onClose={() => dispatch({ type: 'TOGGLE_API_KEY_MODAL', payload: false })}
          />
          <div className="p-1">
            {showControls && (
              <div className="mb-4">
                <ChatControls 
                  settings={state.settings}
                  onSettingsChange={handleSettingsChange}
                />
              </div>
            )}
            {activeSession && (
              <ChatInput 
                onSubmit={handleSubmit}
                isLoading={isLoading}
                onImageUpload={handleImageUpload}
                onFileUpload={handleFileUpload}
                onImageGenerate={handleImageGeneration}
                isProcessingFile={isProcessing}
                isGeneratingImage={isGeneratingImage}
                onToggleControls={() => setShowControls(!showControls)}
                editingMessage={editingMessage}
                onCancelEdit={cancelEditing}
                input={input}
                setInput={setInput}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ApiKeyModal 
        isOpen={state.showApiKeyModal} 
        onClose={() => dispatch({ type: 'TOGGLE_API_KEY_MODAL', payload: false })}
      />
      <div className="flex-1 flex flex-col h-full relative bg-gray-50">
        <div className="flex-1 overflow-y-auto">
          <div className={styles.mainChatContainer}>
            <div className="space-y-6 py-6">
              {activeSession.messages.map((message, index) => (
                <MessageBubble 
                  key={message.timestamp} 
                  message={message}
                  previousMessage={index > 0 ? activeSession.messages[index - 1] : null}
                  onEditMessage={handleEditMessage}
                />
              ))}
            </div>
            <div ref={messagesEndRef} />
          </div>
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

        <div className="p-1">
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
            editingMessage={editingMessage}
            onCancelEdit={cancelEditing}
            input={input}
            setInput={setInput}
          />
        </div>
      </div>
    </>
  );
}
import { useState, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { FiLoader } from 'react-icons/fi'; // Import the loader icon

export default function ImageUpload() {
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);
  const { dispatch } = useChat();

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const apiKey = sessionStorage.getItem('OPENAI_API_KEY');
    if (!apiKey) {
      dispatch({ type: 'TOGGLE_API_KEY_MODAL', payload: true });
      return;
    }

    setIsProcessing(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const analysisMessage = {
        role: 'user',
        content: `Analyzing image: ${file.name}`,
        type: 'system',
        timestamp: new Date().toISOString(),
        messageId: Date.now().toString()
      };
      
      dispatch({
        type: 'ADD_MESSAGE',
        payload: analysisMessage
      });

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
          parentMessageId: analysisMessage.messageId,
          contextType: 'image-analysis'
        }
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        id="image-upload"
      />
      <label
        htmlFor="image-upload"
        className="cursor-pointer inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
      >
        {isProcessing ? (
          <div className="flex items-center space-x-2">
            <FiLoader className="animate-spin" />
            <span>Processing...</span>
          </div>
        ) : (
          <>
            🖼️ Upload Image
          </>
        )}
      </label>
    </div>
  );
}
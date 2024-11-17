import { useState, useRef } from 'react';
import { useChat } from '../context/ChatContext';

export default function ImageUpload() {
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);
  const { dispatch } = useChat();

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          role: 'user',
          content: `Analyzing image: ${file.name}`,
          type: 'system',
          timestamp: new Date().toISOString()
        }
      });

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
          timestamp: new Date().toISOString()
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
          content: 'Failed to process image. Please try again.',
          type: 'text',
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
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="image-upload"
        disabled={isProcessing}
      />
      <label
        htmlFor="image-upload"
        className={`flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 cursor-pointer ${
          isProcessing ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isProcessing ? (
          <svg className="animate-spin h-5 w-5 text-gray-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        )}
      </label>
    </div>
  );
}
import { useState, useRef } from 'react';
import { useChat } from '../context/ChatContext';

export default function FileUpload() {
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
      const response = await fetch('/api/process-pdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Processing failed');
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

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('PDF handling error:', error);
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          role: 'assistant',
          content: 'Failed to process PDF. Please try again.',
          type: 'error',
          timestamp: new Date().toISOString(),
        }
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <input
      type="file"
      accept=".pdf"
      onChange={handleFileChange}
      ref={fileInputRef}
      disabled={isProcessing}
    />
  );
}
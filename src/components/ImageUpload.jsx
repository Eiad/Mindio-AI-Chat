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
          content: 'Failed to process image. Please try again.',
          type: 'error',
          timestamp: new Date().toISOString()
        }
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <input
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      ref={fileInputRef}
      disabled={isProcessing}
    />
  );
}
import { useState, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { FiLoader } from 'react-icons/fi'; // Import the loader icon

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Processing failed');
      }

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
          content: error.message || 'Failed to process PDF. Please try again.',
          type: 'error',
          timestamp: new Date().toISOString(),
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
        accept=".pdf"
        onChange={handleFileChange}
        ref={fileInputRef}
        disabled={isProcessing}
        className="hidden"
        id="pdf-upload"
      />
      <label
        htmlFor="pdf-upload"
        className={`inline-flex items-center px-4 py-2 rounded-lg cursor-pointer ${
          isProcessing
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
        }`}
      >
        {isProcessing ? (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 flex items-center space-x-4">
              <FiLoader className="animate-spin text-xl text-blue-500" />
              <span className="text-gray-700 font-medium">Uploading and processing file...</span>
            </div>
          </div>
        ) : (
          <>
            📄 Upload PDF
          </>
        )}
      </label>
    </div>
  );
}
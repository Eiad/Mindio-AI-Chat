import { useState, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { FiLoader, FiPaperclip } from 'react-icons/fi'; // Import the loader icon

export default function FileUpload() {
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
    
    // Determine file type and endpoint
    const fileType = file.type || (file.name.endsWith('.html') ? 'text/html' : 'application/octet-stream');
    const endpoint = fileType === 'application/pdf' ? '/api/process-pdf' : '/api/process-file';

    // Create user message first
    const userMessage = {
      role: 'user',
      content: `Analyzing file: ${file.name}`,
      type: 'file',
      fileName: file.name,
      fileType: fileType,
      timestamp: new Date().toISOString(),
      messageId: Date.now().toString()
    };

    dispatch({
      type: 'ADD_MESSAGE',
      payload: userMessage
    });

    try {
      formData.append('text', `Please analyze this ${fileType} file and provide a detailed summary.`);
      formData.append('smartPrompt', `Please analyze this file's content and provide:
        1. A comprehensive summary
        2. Key points or findings
        3. Any important code patterns or structures (if applicable)
        4. Potential issues or recommendations`);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'X-API-KEY': apiKey
        },
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
          content: data.summary || data.analysis,
          type: 'text',
          timestamp: new Date().toISOString(),
          parentMessageId: userMessage.messageId,
          contextType: fileType === 'application/pdf' ? 'pdf-analysis' : 'file-analysis'
        }
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept=".pdf,.txt,.js,.html,text/plain,text/javascript,text/html,application/pdf"
        onChange={handleFileChange}
        ref={fileInputRef}
        disabled={isProcessing}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className={`cursor-pointer inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
          isProcessing
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
        }`}
      >
        {isProcessing ? (
          <div className="flex items-center space-x-2">
            <FiLoader className="animate-spin" />
            <span>Processing...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <FiPaperclip className="w-5 h-5" />
            <span>Attach File</span>
          </div>
        )}
      </label>
    </div>
  );
}
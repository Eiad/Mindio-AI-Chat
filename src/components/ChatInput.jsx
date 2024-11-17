import { useState, useRef, useEffect } from 'react';
import { FiSend, FiImage, FiFile, FiSettings } from 'react-icons/fi';
import { RiMagicFill } from 'react-icons/ri';

export default function ChatInput({ 
  onSubmit, 
  isLoading,
  onImageUpload,
  onFileUpload,
  onImageGenerate,
  isProcessingFile,
  isGeneratingImage,
  onToggleControls 
}) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      if (input.includes('\n')) {
        textarea.style.height = `${textarea.scrollHeight}px`;
      } else {
        textarea.style.height = '40px';
      }
    }
  }, [input]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        onFileUpload(file);
      } else if (file.type.startsWith('image/')) {
        onImageUpload(file);
      }
    }
    e.target.value = ''; // Reset input
  };

  const handleImageGeneration = async () => {
    if (!input.trim() || isGeneratingImage) return;
    await onImageGenerate(input);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent new line
      onSubmit(input);
      setInput(''); // Clear input after submission
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf"
        className="hidden"
      />
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <div className="relative bg-white rounded-lg shadow-sm border border-gray-200">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown} // Add key down handler
          placeholder="Type your message..."
          className="w-full resize-none bg-transparent px-4 py-3 focus:outline-none"
          style={{
            overflow: 'hidden', // Prevent scrollbars
            minHeight: '40px', // Minimum height
            maxHeight: '200px' // Maximum height
          }}
        />             
        <div className="flex items-center gap-2 px-2 py-2">
          <button
            onClick={onToggleControls}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FiSettings className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessingFile}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Upload PDF"
          >
            <FiFile className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => imageInputRef.current?.click()}
            disabled={isProcessingFile}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Upload Image"
          >
            <FiImage className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1" />
          <button
            onClick={handleImageGeneration}
            disabled={isGeneratingImage || !input.trim()}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Generate Image"
          >
            <RiMagicFill className={`w-5 h-5 ${input.trim() ? 'text-purple-600' : 'text-gray-400'}`} />
          </button>
          <button
            onClick={() => onSubmit(input)}
            disabled={!input.trim() || isLoading}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Send Message"
          >
            <FiSend className={`w-5 h-5 ${input.trim() ? 'text-blue-600' : 'text-gray-400'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
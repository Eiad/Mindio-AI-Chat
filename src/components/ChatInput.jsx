import { useState, useRef, useEffect } from 'react';
import { FiSend, FiImage, FiFile } from 'react-icons/fi';
import { RiMagicFill } from 'react-icons/ri';
import { CgSpinner } from 'react-icons/cg';

export default function ChatInput({ 
  onSubmit, 
  isLoading,
  onImageUpload,
  onFileUpload,
  onImageGenerate,
  isProcessingFile,
  isGeneratingImage 
}) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const [rows, setRows] = useState(1);
  const maxRows = 5;

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const newRows = Math.min(
      Math.max(Math.ceil(textarea.scrollHeight / 24), 1),
      maxRows
    );
    setRows(newRows);
    textarea.style.height = `${Math.min(textarea.scrollHeight, 24 * maxRows)}px`;
  }, [input]);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    try {
      await onSubmit(input);
      setInput('');
      setRows(1);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Failed to submit:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'image') {
      await onImageUpload(file);
      imageInputRef.current.value = '';
    } else {
      await onFileUpload(file);
      fileInputRef.current.value = '';
    }
  };

  const handleImageGeneration = async () => {
    if (!input.trim() || isGeneratingImage) return;
    await onImageGenerate(input);
    setInput('');
    setRows(1);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-4">
      <div className="relative bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 p-2">
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessingFile}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Upload PDF"
            >
              {isProcessingFile ? (
                <CgSpinner className="w-5 h-5 animate-spin text-gray-600" />
              ) : (
                <FiFile className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <button
              onClick={() => imageInputRef.current?.click()}
              disabled={isProcessingFile}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Upload Image"
            >
              <FiImage className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={rows}
            className="flex-1 resize-none bg-transparent px-2 py-2 focus:outline-none text-gray-800 placeholder-gray-400"
            style={{
              lineHeight: '1.5',
              maxHeight: `${24 * maxRows}px`
            }}
          />

          <div className="flex gap-2">
            <button
              onClick={handleImageGeneration}
              disabled={isGeneratingImage || !input.trim()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Generate Image"
            >
              {isGeneratingImage ? (
                <CgSpinner className="w-5 h-5 animate-spin text-purple-600" />
              ) : (
                <RiMagicFill className={`w-5 h-5 ${input.trim() ? 'text-purple-600' : 'text-gray-400'}`} />
              )}
            </button>
            <button
              onClick={handleSubmit}
              disabled={!input.trim() || isLoading}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Send Message"
            >
              {isLoading ? (
                <CgSpinner className="w-5 h-5 animate-spin text-blue-600" />
              ) : (
                <FiSend className={`w-5 h-5 ${input.trim() ? 'text-blue-600' : 'text-gray-400'}`} />
              )}
            </button>
          </div>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileChange(e, 'file')}
        accept=".pdf"
        className="hidden"
      />
      <input
        type="file"
        ref={imageInputRef}
        onChange={(e) => handleFileChange(e, 'image')}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
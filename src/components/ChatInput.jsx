import { useState, useRef, useEffect } from 'react';
import { FiSend, FiImage, FiFile, FiSettings, FiPaperclip, FiX, FiFileText, FiCode } from 'react-icons/fi';
import { RiMagicFill } from 'react-icons/ri';
import styles from './ChatInput.module.scss';

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
  const [attachedFile, setAttachedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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
      setAttachedFile(file);
      
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    }
    e.target.value = '';
  };

  const handleSubmit = () => {
    if (!input.trim() && !attachedFile) return;

    if (attachedFile) {
      const formData = new FormData();
      formData.append('file', attachedFile);
      formData.append('text', input);

      if (attachedFile.type === 'application/pdf') {
        onFileUpload(attachedFile, input, '/api/process-pdf');
      } else if (attachedFile.type.startsWith('image/')) {
        onImageUpload(attachedFile, input);
      } else {
        onFileUpload(attachedFile, input, '/api/process-file');
      }
      setAttachedFile(null);
      setImagePreview(null);
    } else {
      onSubmit(input);
    }

    setInput('');
  };

  const handleRemoveAttachment = () => {
    setAttachedFile(null);
    setImagePreview(null);
  };

  const handleImageGeneration = async () => {
    if (!input.trim() || isGeneratingImage) return;

    const prompt = input;
    setInput('');

    try {
      await onImageGenerate(prompt);
    } catch (error) {
      console.error('Image generation failed:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full ">
      <div className={styles.mainChatContainer}>
        <div className="relative bg-white rounded-xl shadow-sm my-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.txt,.js,.html,text/plain,text/javascript,text/html,application/pdf"
            className="hidden"
          />
          <input
            type="file"
            ref={imageInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          
          {attachedFile && (
            <div className="absolute top-3 right-3 flex items-center gap-2 bg-gray-100 rounded-lg p-2">
              {attachedFile.type.startsWith('image/') ? (
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-10 h-10 object-cover rounded-lg"
                />
              ) : (
                <>
                  {attachedFile.name.endsWith('.pdf') && <FiPaperclip className="w-5 h-5 text-gray-500" />}
                  {attachedFile.name.endsWith('.txt') && <FiFileText className="w-4 h-4 text-gray-600" />}
                  {attachedFile.name.endsWith('.js') && <FiCode className="w-4 h-4 text-gray-600" />}
                  {attachedFile.name.endsWith('.html') && <FiCode className="w-4 h-4 text-gray-600" />}
                  {!attachedFile.name.match(/\.(pdf|txt|js|html)$/) && <FiPaperclip className="w-5 h-5 text-gray-500" />}
                </>
              )}
              <span className="text-sm text-gray-600 max-w-[150px] truncate">
                {attachedFile.name}
              </span>
              <button
                onClick={handleRemoveAttachment}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
              >
                <FiX className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="w-full resize-none bg-transparent px-4 py-4 focus:outline-none text-gray-700 placeholder-gray-400"
            style={{
              overflow: 'hidden',
              minHeight: '56px',
              maxHeight: '200px'
            }}
          />
          
          <div className="flex items-center gap-1 px-2 py-2 border-t">
            <div className="relative group">
              <button
                onClick={onToggleControls}
                className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiSettings className="w-5 h-5 text-gray-500" />
              </button>
              <span className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full mb-2 w-max bg-gray-800 text-white text-xs rounded-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Settings
              </span>
            </div>
            <div className="relative group">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessingFile}
                className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiPaperclip className="w-5 h-5 text-gray-500" />
              </button>
              <span className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full mb-2 w-max bg-gray-800 text-white text-xs rounded-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Attach Files
              </span>
            </div>
            <div className="relative group">
              <button
                onClick={() => imageInputRef.current?.click()}
                disabled={isProcessingFile}
                className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiImage className="w-5 h-5 text-gray-500" />
              </button>
              <span className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full mb-2 w-max bg-gray-800 text-white text-xs rounded-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Upload Image
              </span>
            </div>
            <div className="flex-1" />
            <div className="relative group">
              <button
                onClick={handleImageGeneration}
                disabled={isGeneratingImage || !input.trim()}
                className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                title="Generate Image"
              >
                <RiMagicFill className={`w-5 h-5 ${input.trim() ? 'text-purple-600' : 'text-gray-400'}`} />
              </button>
              <span className="absolute left-1/2 transform -translate-x-1/2 -translate-y-full mb-2 w-max bg-gray-800 text-white text-xs rounded-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Generate Image
              </span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={(!input.trim() && !attachedFile) || isLoading}
              className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Send Message"
            >
              <FiSend className={`w-5 h-5 ${input.trim() || attachedFile ? 'text-blue-600' : 'text-gray-400'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
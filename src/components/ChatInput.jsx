import { useState, useRef, useEffect } from 'react';
import { FiSend, FiImage, FiFile, FiSettings, FiPaperclip, FiX } from 'react-icons/fi';
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
        onFileUpload(attachedFile, input);
      } else if (attachedFile.type.startsWith('image/')) {
        onImageUpload(attachedFile, input);
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
    await onImageGenerate(input);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
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
        {imagePreview && (
          <div className="absolute top-2 right-2 flex items-center gap-2 bg-gray-100 rounded-lg p-2">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-8 h-8 object-cover rounded"
            />
            <button
              onClick={handleRemoveAttachment}
              className="p-1 hover:bg-gray-200 rounded-full"
            >
              <FiX className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        )}
        
        {attachedFile && attachedFile.type === 'application/pdf' && (
          <div className="absolute top-2 right-2 flex items-center gap-2 bg-gray-100 rounded-lg p-2">
            <FiPaperclip className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">{attachedFile.name}</span>
            <button
              onClick={handleRemoveAttachment}
              className="p-1 hover:bg-gray-200 rounded-full"
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
          className="w-full resize-none bg-transparent px-4 py-3 focus:outline-none"
          style={{
            overflow: 'hidden',
            minHeight: '40px',
            maxHeight: '200px'
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
            title="Attach PDF"
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
            onClick={handleSubmit}
            disabled={(!input.trim() && !attachedFile) || isLoading}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Send Message"
          >
            <FiSend className={`w-5 h-5 ${input.trim() || attachedFile ? 'text-blue-600' : 'text-gray-400'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
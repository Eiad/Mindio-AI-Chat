import { useState } from 'react';
import ImageModal from './ImageModal';
import { FiFile, FiFileText, FiCode, FiEdit } from 'react-icons/fi';

export default function MessageBubble({ message, previousMessage, onEditMessage }) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isUser = message.role === 'user';
  const isContextContinuation = message.parentMessageId || 
    (previousMessage && message.contextType === previousMessage.contextType);
  
  const getFileIcon = (fileName) => {
    if (fileName.endsWith('.pdf')) {
      return <FiFile className="w-5 h-5 text-gray-600" />;
    } else if (fileName.endsWith('.txt') || fileName.endsWith('.html')) {
      return <FiFileText className="w-5 h-5 text-gray-600" />;
    } else if (fileName.endsWith('.js')) {
      return <FiCode className="w-5 h-5 text-gray-600" />;
    }
    return <FiFile className="w-5 h-5 text-gray-600" />;
  };

  const getFileTypeLabel = (fileName) => {
    if (fileName.endsWith('.pdf')) {
      return 'PDF Document';
    } else if (fileName.endsWith('.txt')) {
      return 'Text File';
    } else if (fileName.endsWith('.js')) {
      return 'JavaScript File';
    } else if (fileName.endsWith('.html')) {
      return 'HTML File';
    }
    return 'Document';
  };

  const renderContent = () => {
    if (message.type === 'image' && isUser) {
      return (
        <div className="space-y-3">
          <p className="whitespace-pre-wrap leading-relaxed mb-2">
            {message.content}
          </p>
          <img 
            src={message.imageUrl} 
            alt="Uploaded image"
            className="rounded-lg max-w-[200px] h-auto cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setIsImageModalOpen(true)}
          />
          <ImageModal
            imageUrl={message.imageUrl}
            isOpen={isImageModalOpen}
            onClose={() => setIsImageModalOpen(false)}
          />
        </div>
      );
    }

    if (message.type === 'image' && !isUser) {
      return (
        <div className="space-y-3">
          <img 
            src={message.content} 
            alt={message.revisedPrompt || "Generated image"}
            className="rounded-lg max-w-[100%] h-auto cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setIsImageModalOpen(true)}
          />
          {message.revisedPrompt && (
            <p className="text-sm text-gray-500 italic">
              {message.revisedPrompt}
            </p>
          )}
          <ImageModal
            imageUrl={message.content}
            isOpen={isImageModalOpen}
            onClose={() => setIsImageModalOpen(false)}
          />
        </div>
      );
    }

    if (message.type === 'file' || message.type === 'pdf') {
      return (
        <div className="space-y-3">
          <p className="whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-3 max-w-[250px]">
            {getFileIcon(message.fileName)}
            <div className="flex flex-col">
              <span className="text-sm text-gray-600 truncate">
                {message.fileName}
              </span>
              <span className="text-xs text-gray-500">
                {getFileTypeLabel(message.fileName)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <p className="whitespace-pre-wrap leading-relaxed">
        {message.content}
      </p>
    );
  };

  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} ${isContextContinuation ? 'mt-2' : 'mt-6'} relative`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isUser && !isContextContinuation && (
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2 flex-shrink-0">
          <span className="text-blue-600 text-sm">AI</span>
        </div>
      )}
      <div className={`max-w-[80%] p-4 rounded-2xl ${
        isUser
          ? 'bg-blue-600 text-white rounded-br-sm'
          : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'
      }`}>
        <div className="space-y-2">
          {renderContent()}
          <span className={`text-xs block ${isUser ? 'text-blue-100' : 'text-gray-400'}`}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>
      {isUser && !isContextContinuation && (
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center ml-2 flex-shrink-0">
          <span className="text-white text-sm">You</span>
        </div>
      )}
      {isUser && isHovered && message.type !== 'file' && message.type !== 'system' && message.type !== 'image' && (
        <button
          onClick={() => onEditMessage(message)}
          className="absolute -right-6 top-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FiEdit className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
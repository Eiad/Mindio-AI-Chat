import { useState } from 'react';
import ImageModal from './ImageModal';
import { FiFile } from 'react-icons/fi';

export default function MessageBubble({ message, previousMessage }) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const isUser = message.role === 'user';
  const isContextContinuation = message.parentMessageId || 
    (previousMessage && message.contextType === previousMessage.contextType);
  
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

    if (message.type === 'pdf' && isUser) {
      return (
        <div className="space-y-3">
          <p className="whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-3 max-w-[200px]">
            <FiFile className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-600 truncate">
              {message.fileName}
            </span>
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
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} ${isContextContinuation ? 'mt-2' : 'mt-6'}`}>
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
    </div>
  );
}
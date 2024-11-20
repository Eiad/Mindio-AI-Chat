import { useState } from 'react';
import ImageModal from './ImageModal';

export default function MessageBubble({ message, previousMessage }) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const isUser = message.role === 'user';
  const isContextContinuation = message.parentMessageId || 
    (previousMessage && message.contextType === previousMessage.contextType);
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} ${isContextContinuation ? 'mt-2' : 'mt-6'}`}>
      {!isUser && !isContextContinuation && (
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2 flex-shrink-0">
          <span className="text-blue-600 text-sm">AI</span>
        </div>
      )}
      <div
        className={`max-w-[80%] p-4 rounded-2xl ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-sm'
            : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'
        }`}
      >
        {message.type === 'image' ? (
          <div className="space-y-3">
            <img 
              src={message.content} 
              alt="Generated" 
              className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
              loading="lazy"
              onClick={() => setIsImageModalOpen(true)}
            />
            {message.revisedPrompt && (
              <p className="text-xs italic text-gray-200">
                {message.revisedPrompt}
              </p>
            )}
            <span className="text-xs opacity-70 block">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
            <ImageModal
              imageUrl={message.content}
              isOpen={isImageModalOpen}
              onClose={() => setIsImageModalOpen(false)}
            />
          </div>
        ) : (
          <div className="space-y-2">
            <p className="whitespace-pre-wrap leading-relaxed">
              {message.content}
            </p>
            <span className={`text-xs block ${isUser ? 'text-blue-100' : 'text-gray-400'}`}>
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>
      {isUser && !isContextContinuation && (
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center ml-2 flex-shrink-0">
          <span className="text-white text-sm">You</span>
        </div>
      )}
    </div>
  );
}
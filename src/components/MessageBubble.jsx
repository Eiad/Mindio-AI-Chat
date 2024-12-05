import { useState } from 'react';
import ImageModal from './ImageModal';
import { FiFile, FiFileText, FiCode, FiEdit } from 'react-icons/fi';
import { highlightCode } from '../utils/prisma';
import styles from '../styles/ai-message.module.scss';

export default function MessageBubble({ message, previousMessage, onEditMessage, activeSession }) {
  if (message.hidden) {
    return null;
  }
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
            messages={previousMessage?.contextType === 'chat' ? [message] : activeSession?.messages}
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
            messages={activeSession?.messages}
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
    
    const processText = (text) => {
      text = text.replace(/####\s+([^#\n]+)/g, '<h4 class="text-lg font-semibold text-gray-900 mt-6 mb-3">$1</h4>');
      
      const codeBlockRegex = /```([\w./:]+)?\n([\s\S]*?)```/g;
      const parts = [];
      let lastIndex = 0;
      let match;
      let partIndex = 0;

      while ((match = codeBlockRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          const textContent = text.slice(lastIndex, match.index);
          parts.push(
            <div key={`text-${partIndex}`}>
              {processInlineFormatting(textContent)}
            </div>
          );
          partIndex++;
        }

        const fileInfo = match[1]?.toLowerCase() || 'javascript';
        const code = match[2].trim();
        const isFilePath = fileInfo.includes('/') || fileInfo.includes('.');
        const language = isFilePath ? fileInfo.split('.').pop() : fileInfo;
        const displayPath = isFilePath ? fileInfo : `${language} code`;
        const highlightedCode = highlightCode(code, language);

        parts.push(
          <div key={`code-${partIndex}`} className="relative group my-4">
            <div className="absolute top-0 left-0 right-0 bg-[#1e1e1e] text-gray-300 text-sm px-4 py-2 rounded-t-lg font-mono border-b border-gray-700 flex justify-between items-center">
              <span>{displayPath}</span>
              <button
                onClick={() => navigator.clipboard.writeText(code)}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <span className="text-xs">Copy</span>
              </button>
            </div>
            <pre className={`language-${language} rounded-lg overflow-x-auto mt-0 rounded-t-none`}>
              <code
                className={`language-${language}`}
                dangerouslySetInnerHTML={{ __html: highlightedCode }}
              />
            </pre>
          </div>
        );
        partIndex++;

        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < text.length) {
        parts.push(
          <div key={`text-${partIndex}`}>
            {processInlineFormatting(text.slice(lastIndex))}
          </div>
        );
      }

      return parts;
    };

    const processInlineFormatting = (text) => {
      text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
      
      text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      
      text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
      
      text = text.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
      text = text.replace(/^-\s+(.+)$/gm, '<li>$1</li>');
      
      text = text.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
      text = text.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
      text = text.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');

      return (
        <div
          className={styles.aiMessage}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      );
    };

    return (
      <div className={`space-y-2 ${!isUser ? styles.aiMessage : ''}`}>
        {processText(message.content)}
      </div>
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
          ? 'bg-blue-50 text-blue-900 rounded-br-sm border border-blue-100'
          : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'
      }`}>
        <div className="space-y-2">
          {renderContent()}
          <span className={`text-xs block ${isUser ? 'text-blue-400' : 'text-gray-400'}`}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>
      {isUser && !isContextContinuation && (
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center ml-2 flex-shrink-0">
          <span className="text-blue-600 text-sm">You</span>
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
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
      // First wrap all text content in paragraphs before other processing
      text = text.split('\n').map(line => {
        line = line.trim();
        if (line && !line.startsWith('#') && !line.startsWith('-') && !line.startsWith('|')) {
          return `<p>${line}</p>`;
        }
        return line;
      }).join('\n');

      // Handle headings
      text = text.replace(/####\s+([^#\n]+)/g, '<h4>$1</h4>');
      text = text.replace(/###\s+([^#\n]+)/g, '<h3>$1</h3>');
      text = text.replace(/##\s+([^#\n]+)/g, '<h2>$1</h2>');
      text = text.replace(/#\s+([^#\n]+)/g, '<h1>$1</h1>');

      // Handle tables
      const hasTable = text.includes('|');
      if (hasTable) {
        const lines = text.split('\n');
        const tableLines = [];
        let isInTable = false;
        let processedText = '';

        lines.forEach((line, index) => {
          if (line.includes('|')) {
            if (!isInTable) {
              isInTable = true;
              tableLines.push('<table class="dataTable">');
              tableLines.push('<thead>');
            }
            
            const cells = line.split('|').map(cell => cell.trim()).filter(Boolean);
            const isHeader = line.includes('-----');
            
            if (isHeader) {
              tableLines.push('</thead><tbody>');
            } else {
              const row = `<tr>${cells.map(cell => 
                isInTable && index === 0 ? `<th>${cell}</th>` : `<td>${cell}</td>`
              ).join('')}</tr>`;
              tableLines.push(row);
            }
          } else if (isInTable) {
            isInTable = false;
            tableLines.push('</tbody></table>');
            processedText += tableLines.join('') + '\n';
            tableLines.length = 0;
            if (line.trim()) {
              processedText += line;
            }
          } else {
            processedText += line + '\n';
          }
        });

        if (isInTable) {
          tableLines.push('</tbody></table>');
          processedText += tableLines.join('');
        }

        text = processedText;
      }

      // Handle inline formatting
      text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
      text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');

      // Handle lists
      text = text.replace(/^-\s+(.+)$/gm, '<li>$1</li>');
      text = text.replace(/(<li>.*?<\/li>\n*)+/g, match => {
        return `<ul>${match}</ul>`;
      });

      // Clean up any double-wrapped paragraphs
      text = text.replace(/<p><p>/g, '<p>');
      text = text.replace(/<\/p><\/p>/g, '</p>');

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
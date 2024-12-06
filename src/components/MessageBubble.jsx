import { useState } from 'react';
import ImageModal from './ImageModal';
import { FiFile, FiFileText, FiCode, FiEdit, FiDownload } from 'react-icons/fi';
import { highlightCode } from '../utils/prisma';
import styles from '../styles/ai-message.module.scss';

export default function MessageBubble({ message, previousMessage, onEditMessage, activeSession }) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  if (message.hidden) {
    return null;
  }
  
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

  const handleDownload = async () => {
    try {
      const response = await fetch(message.content);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
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
          <div
            className="relative inline-block"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
           
          >
            <img 
              style={{ cursor: 'zoom-in' }}
              src={message.content} 
              alt={message.revisedPrompt || "Generated image"}
              className="rounded-lg max-w-[100%] h-auto cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setIsImageModalOpen(true)}
            />
            {isHovered && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload();
                }}
                className="absolute top-2 right-2 p-1 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-75"
              >
                <FiDownload className="w-5 h-5" />
              </button>
            )}
          </div>
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
            <div key={`text-${partIndex}`} className={styles.aiMessage}>
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
          <div key={`code-${partIndex}`} className="relative group my-6">
            <div className="bg-[#1e1e1e] text-gray-300 px-4 py-3 rounded-t-lg font-mono border-b border-[#2d2d2d] flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-blue-300 bg-[#2d3748] px-2.5 py-1 rounded-md">
                  {language.toUpperCase()}
                </span>
                <span className="text-sm text-gray-200 font-medium tracking-tight">
                  {isFilePath ? fileInfo : ''}
                </span>
              </div>
              <button
                onClick={(e) => {
                  navigator.clipboard.writeText(code);
                  const button = e.currentTarget;
                  button.innerHTML = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="font-medium">Copied!</span>`;
                  
                  setTimeout(() => {
                    button.innerHTML = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    <span class="font-medium">Copy</span>`;
                  }, 1500);
                }}
                className="text-gray-400 hover:text-blue-300 transition-colors flex items-center gap-2 text-xs group px-2 py-1 rounded-md hover:bg-[#2d3748]"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                <span className="font-medium">Copy</span>
              </button>
            </div>
            <pre className={`language-${language} !rounded-t-none border border-[#2d2d2d] !mt-0`}>
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
          <div key={`text-${partIndex}`} className={styles.aiMessage}>
            {processInlineFormatting(text.slice(lastIndex))}
          </div>
        );
      }

      return <div className="space-y-4">{parts}</div>;
    };

    const processInlineFormatting = (text) => {
      // Process table data first
      const tableRegex = /\|\s*([^|\n]+)\s*\|/g;
      if (tableRegex.test(text)) {
        const rows = text.split('\n');
        const tableRows = rows.filter(row => row.trim().startsWith('|'));
        
        if (tableRows.length > 0) {
          const tableHtml = `<table>
            <thead>
              <tr>
                ${tableRows[0].split('|')
                  .filter(cell => cell.trim())
                  .map(header => `<th>${header.trim()}</th>`)
                  .join('')}
              </tr>
            </thead>
            <tbody>
              ${tableRows.slice(2)
                .map(row => `<tr>
                  ${row.split('|')
                    .filter(cell => cell.trim())
                    .map(cell => `<td>${cell.trim()}</td>`)
                    .join('')}
                </tr>`)
                .join('')}
            </tbody>
          </table>`;
          
          text = text.replace(tableRows.join('\n'), tableHtml);
        }
      }

      // Process headings before list items
      const lines = text.split('\n');
      const processedLines = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Check for heading pattern
        const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
        if (headingMatch) {
          const level = headingMatch[1].length;
          const content = headingMatch[2];
          if (level === 3) {
            processedLines.push(`<div class="heading-container"><h3 class="section-heading">${content}</h3></div>`);
          } else if (level === 2) {
            processedLines.push(`<h2>${content}</h2>`);
          } else if (level === 1) {
            processedLines.push(`<h1>${content}</h1>`);
          }
        } else {
          processedLines.push(`<li>${line}</li>`);
        }
      }

      // Wrap the list items in an <ol> tag
      const formattedText = `<ol>${processedLines.join('')}</ol>`;

      // Other formatting
      const formattedHtml = formattedText
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>');

      return (
        <div
          className={styles.aiMessage}
          dangerouslySetInnerHTML={{ __html: formattedHtml }}
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
    >
      {!isUser && !isContextContinuation && (
        <div className="w-5 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2 flex-shrink-0">
          <span className="text-blue-600 text-sm">AI</span>
        </div>
      )}
      <div className={`max-w-[55%] p-2 rounded-2xl ${
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
      {isUser &&
        isHovered &&
        message.type !== 'file' &&
        message.type !== 'system' &&
        message.type !== 'image' && (
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
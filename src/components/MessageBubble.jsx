export default function MessageBubble({ message, previousMessage }) {
    const isUser = message.role === 'user';
    const isContextContinuation = message.parentMessageId || 
      (previousMessage && message.contextType === previousMessage.contextType);
    
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div
          className={`max-w-[80%] p-3 rounded-lg ${
            isUser
              ? 'bg-blue-500 text-white rounded-br-none'
              : 'bg-gray-100 text-gray-800 rounded-bl-none'
          } ${isContextContinuation ? 'mt-1' : 'mt-4'}`}
        >
          {message.type === 'image' ? (
            <div className="space-y-2">
              <img 
                src={message.content} 
                alt="Generated" 
                className="rounded-lg max-w-full h-auto"
                loading="lazy"
              />
              {message.revisedPrompt && (
                <p className="text-xs italic mt-2 text-gray-600">
                  {message.revisedPrompt}
                </p>
              )}
              <span className="text-xs opacity-70 block">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ) : (
            <>
              <p className="whitespace-pre-wrap">{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </>
          )}
        </div>
      </div>
    );
  }
import { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';

export default function SessionTitle({ session }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(session.title);
  const inputRef = useRef(null);
  const { dispatch } = useChat();

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSubmit = () => {
    if (title.trim()) {
      dispatch({
        type: 'UPDATE_SESSION_TITLE',
        payload: { sessionId: session.id, title: title.trim() }
      });
    } else {
      setTitle(session.title);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit();
          if (e.key === 'Escape') {
            setTitle(session.title);
            setIsEditing(false);
          }
        }}
        className="w-full bg-transparent px-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
      />
    );
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      className="cursor-pointer hover:opacity-70 truncate"
    >
      {session.title}
    </span>
  );
}
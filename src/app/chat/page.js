'use client';

import { useState } from 'react';
import ChatWindow from '../../components/ChatWindow';
import SessionList from '../../components/SessionList';
import { FiMenu } from 'react-icons/fi';

export default function ChatIndexPage() {
  const [isSessionListOpen, setIsSessionListOpen] = useState(false);

  const toggleSessionList = () => {
    setIsSessionListOpen(!isSessionListOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div
        className={`
          fixed inset-y-0 left-0 w-72 bg-white shadow-md z-40
          transform transition-transform duration-300 ease-in-out
          ${isSessionListOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0
        `}
      >
        <SessionList />
      </div>

      <div className="flex-1 relative overflow-hidden">
        <ChatWindow />
      </div>
    </div>
  );
}
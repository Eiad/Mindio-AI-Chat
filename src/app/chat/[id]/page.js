'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { ChatProvider } from '../../../context/ChatContext';
import ChatWindow from '../../../components/ChatWindow';
import SessionList from '../../../components/SessionList';
import { FiMenu } from 'react-icons/fi';

export default function ChatPage() {
  const params = useParams();
  const [isSessionListOpen, setIsSessionListOpen] = useState(false);

  const toggleSessionList = () => {
    setIsSessionListOpen(!isSessionListOpen);
  };

  return (
    <ChatProvider>
      <div className="flex h-screen">
        {!isSessionListOpen && (
          <button
            onClick={toggleSessionList}
            className="md:hidden absolute top-4 left-4 z-40 w-10 h-10 flex items-center justify-center text-2xl text-gray-700 focus:outline-none bg-white rounded-full shadow-lg"
            aria-label="Toggle Session List"
          >
            <FiMenu />
          </button>
        )}

        <div
          className={`
            fixed inset-y-0 left-0 w-80 bg-white shadow-md z-50
            transform transition-transform duration-300 ease-in-out
            ${isSessionListOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0 md:relative
          `}
        >
          <SessionList />
        </div>

        {isSessionListOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
            onClick={toggleSessionList}
          ></div>
        )}

        <div className="flex-1">
          <ChatWindow />
        </div>
      </div>
    </ChatProvider>
  );
}
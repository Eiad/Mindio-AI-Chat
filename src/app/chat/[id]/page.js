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
        {/* Sidebar Toggle Button for Mobile */}
        <div className="md:hidden p-4">
          <button
            onClick={toggleSessionList}
            className="text-2xl text-gray-700 focus:outline-none"
            aria-label="Toggle Session List"
          >
            <FiMenu />
          </button>
        </div>

        {/* Session List */}
        <div
          className={`
            fixed inset-y-0 left-0 transform 
            ${isSessionListOpen ? 'translate-x-0' : '-translate-x-full'} 
            transition-transform duration-300 ease-in-out
            md:static md:translate-x-0
            w-80 bg-white shadow-md z-50
          `}
        >
          <SessionList />
        </div>

        {/* Overlay for Mobile when Session List is Open */}
        {isSessionListOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
            onClick={toggleSessionList}
          ></div>
        )}

        {/* Chat Window */}
        <div className="flex-1">
          <ChatWindow />
        </div>
      </div>
    </ChatProvider>
  );
}
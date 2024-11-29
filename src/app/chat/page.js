'use client';

import { useState } from 'react';
import ChatWindow from '../../components/ChatWindow';
import SessionList from '../../components/SessionList';
import SettingsModal from '../../components/SettingsModal';
import { FiMenu } from 'react-icons/fi';

export default function ChatIndexPage() {
  const [isSessionListOpen, setIsSessionListOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

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
          ${isSessionListOpen ? 'block' : 'hidden md:block'}
        `}
      >
        <SessionList onOpenSettings={() => setShowSettings(true)} />
      </div>

      {!isSessionListOpen && (
        <button
          onClick={toggleSessionList}
          className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center text-2xl text-gray-700 focus:outline-none bg-white rounded-full shadow-lg"
          aria-label="Toggle Session List"
        >
          <FiMenu />
        </button>
      )}

      <div className="flex-1 relative overflow-hidden w-full bg-gray-50">
        <ChatWindow />
      </div>

      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}
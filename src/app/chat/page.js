'use client';

import { useState } from 'react';
import ChatWindow from '../../components/ChatWindow';
import SessionList from '../../components/SessionList';
import SettingsModal from '../../components/SettingsModal';
import { FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

export default function ChatIndexPage() {
  const [isSessionListOpen, setIsSessionListOpen] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const toggleSessionList = () => {
    setIsSessionListOpen(!isSessionListOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div
        className={`
          fixed inset-y-0 left-0 w-80 bg-white shadow-md z-40
          transform transition-all duration-300 ease-in-out
          ${isSessionListOpen ? 'translate-x-0' : '-translate-x-full'}          
        `}
      >
        <SessionList onOpenSettings={() => setShowSettings(true)} />
      </div>

      <button
        onClick={toggleSessionList}
        className={`
          fixed top-[70px] -translate-y-1/2 z-50 
          w-6 h-24 bg-white shadow-lg rounded-r-lg
          flex items-center justify-center
          hover:bg-gray-50 transition-all duration-300
          focus:outline-none
          transform ${isSessionListOpen ? 'translate-x-80' : 'translate-x-0'}
          
        `}
        aria-label="Toggle Session List"
      >
        {isSessionListOpen ? (
          <FiChevronsLeft className="w-4 h-4 text-gray-600" />
        ) : (
          <FiChevronsRight className="w-4 h-4 text-gray-600" />
        )}
      </button>

      <div className={`
        flex-1 relative overflow-hidden w-full bg-gray-50
        transition-all duration-300 ease-in-out
        ${isSessionListOpen ? 'md:ml-80' : 'ml-0'}
      `}>
        <ChatWindow />
      </div>

      <SettingsModal 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}
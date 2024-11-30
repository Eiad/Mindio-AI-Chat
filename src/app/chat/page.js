'use client';

import { useState, useEffect } from 'react';
import ChatWindow from '../../components/ChatWindow';
import SessionList from '../../components/SessionList';
import SettingsModal from '../../components/SettingsModal';
import LeftMenuToggleButton from '../../components/LeftMenuToggleButton';

export default function ChatIndexPage() {
  const [isSessionListOpen, setIsSessionListOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const toggleSessionList = () => {
    setIsSessionListOpen(!isSessionListOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSessionListOpen(true); // Open on larger screens
      } else {
        setIsSessionListOpen(false); // Close on mobile
      }
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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

      <LeftMenuToggleButton 
        isSessionListOpen={isSessionListOpen} 
        toggleSessionList={toggleSessionList} 
      />

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
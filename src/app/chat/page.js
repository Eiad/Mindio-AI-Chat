'use client';

import { ChatProvider } from '../../context/ChatContext';
import ChatWindow from '../../components/ChatWindow';
import SessionList from '../../components/SessionList';

export default function ChatIndexPage() {
  return (
    <ChatProvider>
      <div className="flex h-screen">
        <SessionList />
        <ChatWindow />
      </div>
    </ChatProvider>
  );
}
'use client';

import { useParams } from 'next/navigation';
import { ChatProvider } from '../../../context/ChatContext';
import ChatWindow from '../../../components/ChatWindow';
import SessionList from '../../../components/SessionList';

export default function ChatPage() {
  const params = useParams();
  
  return (
    <ChatProvider>
      <div className="flex h-screen">
        <SessionList />
        <ChatWindow />
      </div>
    </ChatProvider>
  );
}
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChatProvider } from '../context/ChatContext';
import ChatWindow from '../components/ChatWindow';
import SessionList from '../components/SessionList';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/chat');
  }, [router]);

  return (
    <ChatProvider>
      <div className="flex h-screen">
        <SessionList />
        <ChatWindow />
      </div>
    </ChatProvider>
  );
}
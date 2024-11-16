'use client';

import { ChatProvider } from '../context/ChatContext';
import ChatWindow from '../components/ChatWindow';

export default function Home() {
  return (
    <ChatProvider>
      <ChatWindow />
    </ChatProvider>
  );
}

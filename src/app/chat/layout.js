'use client';

import { ChatProvider } from '../../context/ChatContext';

export default function ChatLayout({ children }) {
  return (
    <ChatProvider>
      {children}
    </ChatProvider>
  );
}
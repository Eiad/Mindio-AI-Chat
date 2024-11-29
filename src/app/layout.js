import localFont from "next/font/local";
import "./globals.scss";
import { ChatProvider } from '../context/ChatContext';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Mindio: Your AI-Powered Creative Assistant",
  description: "Mindio is an innovative platform that harnesses the power of AI to enhance your creative processes. Whether you're crafting engaging content, generating stunning visuals, or seeking inspiration for your next project, Mindio is here to assist you.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ChatProvider>
          {children}
        </ChatProvider>
      </body>
    </html>
  );
}

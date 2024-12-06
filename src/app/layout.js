import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import localFont from "next/font/local";
import "./globals.scss";
import { ChatProvider } from '../context/ChatContext';
import '../styles/prisma-custom.scss';
import Script from 'next/script';

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
      <body className={`${geistSans.variable} ${geistMono.variable} font-roboto antialiased`}>
        <ChatProvider>
          {children}
        </ChatProvider>
        <Script
          id="prism-loader"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                window.Prism = window.Prism || {};
                window.Prism.manual = true;
              }
            `,
          }}
        />
      </body>
    </html>
  );
}

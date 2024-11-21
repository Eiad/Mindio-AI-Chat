import { FiMail, FiYoutube, FiCode, FiImage } from 'react-icons/fi';
import { useChat } from '../context/ChatContext';
import { useRouter } from 'next/navigation';

export default function WelcomeScreen() {
  const { createSession } = useChat();
  const router = useRouter();

  const handleCreateSession = () => {
    const newSessionId = createSession();
    router.push(`/chat/${newSessionId}`);
  };

  const agents = [
    {
      icon: <FiYoutube className="w-8 h-8 text-red-500" />,
      title: "YouTube Content Writer",
      description: "A YouTube content writer specialized in creating engaging and high-performing video scripts"
    },
    {
      icon: <FiMail className="w-8 h-8 text-yellow-500" />,
      title: "Cold Email Template",
      description: "An email marketing expert specializing in cold emails. I have helped many businesses improve their outreach"
    },
    {
      icon: <FiCode className="w-8 h-8 text-blue-500" />,
      title: "Pro Coder",
      description: "Help you write code without overexplain things too much using only its internal knowledge"
    },
    {
      icon: <FiImage className="w-8 h-8 text-green-500" />,
      title: "Blog Image Generator",
      description: "A blog image generator specialized in creating modern vector illustrations for your content"
    }
  ];

  return (
    <div className="flex-1 flex flex-col items-center p-8 max-w-5xl mx-auto w-full">
      <div className="w-full space-y-8">
        <div className="flex justify-center mb-12">
          <img
            src="/assets/main-logo.png"
            alt="Main Logo"
            className="h-16 w-auto"
          />
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map((agent, index) => (
              <button
                key={index}
                onClick={handleCreateSession}
                className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all text-left"
              >
                <div className="p-2 bg-gray-50 rounded-lg">
                  {agent.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{agent.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {agent.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
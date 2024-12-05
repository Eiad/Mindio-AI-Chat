import { FiMail, FiYoutube, FiCode, FiImage } from 'react-icons/fi';
import { useChat } from '../context/ChatContext';
import { useApiKey } from '../hooks/useApiKey';

export default function WelcomeScreen() {
  const { createSession, dispatch } = useChat();
  const [apiKey] = useApiKey();

  const handleCreateSession = () => {
    if (!apiKey) {
      dispatch({ type: 'TOGGLE_API_KEY_MODAL', payload: true });
      dispatch({ type: 'SET_PENDING_ACTION', payload: 'createSession' });
      return;
    }
    createSession();
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
        <div className="flex justify-center mb-12 opacity-0 animate-fade-in-up" 
             style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
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
                className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all text-left opacity-0 animate-fade-in-up"
                style={{ 
                  animationDelay: `${(index + 1) * 0.15 + 0.3}s`,
                  animationFillMode: 'forwards'
                }}
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

          <div className="flex flex-col items-center mt-12 pt-8 border-t border-gray-100">
            <h2 
              className="text-2xl font-bold text-gray-900 mb-3 opacity-0 animate-fade-in-up"
              style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}
            >
              Ready to start chatting?
            </h2>
            <p 
              className="text-gray-600 mb-6 text-center max-w-md opacity-0 animate-fade-in-up"
              style={{ animationDelay: '0.9s', animationFillMode: 'forwards' }}
            >
              Choose any template above or start a fresh conversation with our AI assistant
            </p>
            <button
              onClick={handleCreateSession}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-full overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 opacity-0 animate-fade-in-up"
              style={{ animationDelay: '1s', animationFillMode: 'forwards' }}
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
              <span className="relative flex items-center">
                Start New Chat
                <svg 
                  className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
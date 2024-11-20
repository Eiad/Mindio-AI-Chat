import { useRouter } from 'next/navigation';
import { FiPlus } from 'react-icons/fi';
import { MdChat } from 'react-icons/md';
import { FaBrain, FaLightbulb, FaQuestionCircle } from 'react-icons/fa';
import { useChat } from '../context/ChatContext';

export default function WelcomeScreen() {
  const { createSession } = useChat();
  const router = useRouter();

  const handleCreateSession = () => {
    const newSessionId = createSession();
    router.push(`/chat/${newSessionId}`);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-8 p-6">
      <MdChat className="w-24 h-24 text-indigo-600" />
      <h2 className="text-3xl font-semibold text-gray-800">
        Welcome to Mindio!
      </h2>
      <p className="text-gray-600 text-center max-w-lg">
        Mindio is your personal AI assistant, here to help you brainstorm ideas,
        answer questions, and much more. Start a new chat to unlock endless possibilities!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <div className="flex flex-col items-center">
          <FaBrain className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-800">Brainstorm Ideas</h3>
          <p className="text-gray-600 text-center">
            Need inspiration? Let Mindio help you generate creative ideas.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <FaLightbulb className="w-12 h-12 text-yellow-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-800">Get Answers</h3>
          <p className="text-gray-600 text-center">
            Have questions? Mindio provides accurate answers quickly.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <FaQuestionCircle className="w-12 h-12 text-green-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-800">Learn New Things</h3>
          <p className="text-gray-600 text-center">
            Explore new topics and expand your knowledge with Mindio.
          </p>
        </div>
      </div>

      <button
        onClick={handleCreateSession}
        className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-8"
        aria-label="Create New Chat"
      >
        <FiPlus className="w-5 h-5" />
        <span className="font-semibold">Start a New Chat</span>
      </button>
    </div>
  );
}
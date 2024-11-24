import { FiMessageSquare, FiImage, FiFile, FiCode } from 'react-icons/fi';

export default function ActiveSessionWelcome() {
  const suggestions = [
    {
      icon: <FiMessageSquare className="w-5 h-5 text-blue-500" />,
      title: "Chat with AI",
      examples: [
        "Explain quantum computing in simple terms",
        "Help me write a professional email",
        "What are some creative writing prompts?"
      ]
    },
    {
      icon: <FiImage className="w-5 h-5 text-purple-500" />,
      title: "Image Generation",
      examples: [
        "Generate a watercolor painting of a sunset",
        "Create a minimalist logo design",
        "Design a futuristic city landscape"
      ]
    },
    {
      icon: <FiFile className="w-5 h-5 text-green-500" />,
      title: "Document Analysis",
      examples: [
        "Analyze this research paper",
        "Summarize this PDF document",
        "Extract key points from this report"
      ]
    },
    {
      icon: <FiCode className="w-5 h-5 text-orange-500" />,
      title: "Code Assistant",
      examples: [
        "Help me debug this React component",
        "Explain this algorithm",
        "Convert this code to TypeScript"
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <h1 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        How can I help you today?
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {suggestions.map((category, index) => (
          <div 
            key={index}
            className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 hover:border-gray-200 transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-gray-50 rounded-md">
                {category.icon}
              </div>
              <h2 className="text-base font-medium text-gray-800">
                {category.title}
              </h2>
            </div>
            
            <ul className="space-y-1">
              {category.examples.map((example, idx) => (
                <li 
                  key={idx}
                  className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer p-1.5 rounded hover:bg-gray-50 transition-all"
                >
                  "{example}"
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
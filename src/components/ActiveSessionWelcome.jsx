import { FiMessageSquare, FiImage, FiFile, FiCode } from 'react-icons/fi';
import { useState, useEffect } from 'react';

export default function ActiveSessionWelcome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % suggestions.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + suggestions.length) % suggestions.length);
  };

  return (
    <div className="max-w-4xl mx-auto mt-5 md:mt-20 p-6 md:p-12">
      <h1 
        className="text-lg font-semibold text-gray-800 mb-6 text-center opacity-0 animate-fade-in-up"
        style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
      >
        How can I help you today?
      </h1>

      {isMobile ? (
        <div className="relative p-0">
          <button
            onClick={prevSlide}
            className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200 opacity-20 hover:opacity-100"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all duration-200 opacity-20 hover:opacity-100"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {suggestions.map((category, index) => (
                <div 
                  key={index}
                  className="w-full flex-shrink-0 px-2"
                >
                  <div 
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:border-gray-200 transition-all opacity-0 animate-fade-in-up"
                    style={{ 
                      animationDelay: `${(index + 1) * 0.15 + 0.3}s`,
                      animationFillMode: 'forwards'
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-gray-50 rounded-md">
                        {category.icon}
                      </div>
                      <h2 className="text-md font-medium text-gray-800">
                        {category.title}
                      </h2>
                    </div>
                    
                    <ul className="space-y-2">
                      {category.examples.map((example, idx) => (
                        <li 
                          key={idx}
                          className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer p-1 rounded hover:bg-gray-50 transition-all opacity-0 animate-fade-in-up"
                          style={{ 
                            animationDelay: `${(index * 3 + idx) * 0.1 + 0.6}s`,
                            animationFillMode: 'forwards'
                          }}
                        >
                          "{example}"
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center space-x-2 mt-4">
            {suggestions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  currentSlide === index ? 'bg-gray-800 w-3' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {suggestions.map((category, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:border-gray-200 transition-all opacity-0 animate-fade-in-up"
              style={{ 
                animationDelay: `${(index + 1) * 0.15 + 0.3}s`,
                animationFillMode: 'forwards'
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-gray-50 rounded-md">
                  {category.icon}
                </div>
                <h2 className="text-md font-medium text-gray-800">
                  {category.title}
                </h2>
              </div>
              
              <ul className="space-y-2">
                {category.examples.map((example, idx) => (
                  <li 
                    key={idx}
                    className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer p-1 rounded hover:bg-gray-50 transition-all opacity-0 animate-fade-in-up"
                    style={{ 
                      animationDelay: `${(index * 3 + idx) * 0.1 + 0.6}s`,
                      animationFillMode: 'forwards'
                    }}
                  >
                    "{example}"
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
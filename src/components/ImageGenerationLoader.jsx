export default function ImageGenerationLoader() {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-purple-200 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 border-4 border-purple-600 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="text-gray-700 font-medium">Creating your image...</p>
        </div>
      </div>
    );
  }
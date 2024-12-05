import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useEffect, useState, useCallback, useMemo } from 'react';

export default function ImageModal({ imageUrl, isOpen, onClose, messages }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const imageMessages = useMemo(() => 
    messages?.filter(msg => 
      msg.type === 'image' && !msg.imageUrl // Only AI generated images (they have content but no imageUrl)
    ) || [], 
    [messages]
  );

  useEffect(() => {
    if (isOpen && imageUrl) {
      const index = imageMessages.findIndex(msg => 
        (msg.content === imageUrl) || (msg.imageUrl === imageUrl)
      );
      setCurrentImageIndex(index !== -1 ? index : 0);
    }
  }, [isOpen, imageUrl, imageMessages]);

  const navigateImages = useCallback((direction) => {
    console.log('Current state before navigation:', {
      direction,
      currentIndex: currentImageIndex,
      totalImages: imageMessages.length
    });

    setCurrentImageIndex(prev => {
      const newIndex = direction === 'next' 
        ? (prev < imageMessages.length - 1 ? prev + 1 : prev)
        : (prev > 0 ? prev - 1 : prev);
      
      console.log('New index:', newIndex);
      return newIndex;
    });
  }, [imageMessages]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      if (e.key === 'ArrowLeft') {
        navigateImages('prev');
      } else if (e.key === 'ArrowRight') {
        navigateImages('next');
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, navigateImages, onClose]);

  if (!isOpen) return null;

  const currentImage = imageMessages[currentImageIndex];
  const currentImageUrl = currentImage?.content || currentImage?.imageUrl;
  const showPrevButton = currentImageIndex > 0;
  const showNextButton = currentImageIndex < imageMessages.length - 1;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-start justify-center z-50 p-10 !m-0"
      onClick={onClose}
    >
      <div className="relative max-w-[90vw] max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800"
        >
          <FiX className="w-5 h-5 text-white" />
        </button>

        {showPrevButton && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigateImages('prev');
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all"
          >
            <FiChevronLeft className="w-6 h-6 text-white" />
          </button>
        )}

        {showNextButton && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigateImages('next');
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all"
          >
            <FiChevronRight className="w-6 h-6 text-white" />
          </button>
        )}

        <img
          src={currentImageUrl}
          alt="Full size"
          className="max-w-full max-h-[90vh] object-contain !m-0"
          onClick={(e) => e.stopPropagation()}
        />

        {imageMessages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 px-3 py-1 rounded-full text-white text-sm">
            {currentImageIndex + 1} / {imageMessages.length}
          </div>
        )}
      </div>
    </div>
  );
}
import { FiX } from 'react-icons/fi';

export default function ImageModal({ imageUrl, isOpen, onClose }) {
  if (!isOpen) return null;

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
        <img
          src={imageUrl}
          alt="Full size"
          className="max-w-full max-h-[90vh] object-contain !m-0"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}
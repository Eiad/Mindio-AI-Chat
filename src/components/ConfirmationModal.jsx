import { useEffect } from 'react';

export default function ConfirmationModal({ title, message, onConfirm, onCancel }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-lg w-80">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        <div className="p-4">
          <p className="text-gray-700">{message}</p>
        </div>
        <div className="flex justify-end p-4 space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
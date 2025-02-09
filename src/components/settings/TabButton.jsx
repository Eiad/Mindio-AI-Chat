export default function TabButton({ active, onClick, children }) {
    return (
      <button
        onClick={onClick}
        className={`px-4 py-2 font-medium text-sm transition-colors relative
          ${active ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}
        `}
      >
        {children}
        {active && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
        )}
      </button>
    );
  }
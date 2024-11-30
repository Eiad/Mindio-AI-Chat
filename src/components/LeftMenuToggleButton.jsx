import { FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

export default function LeftMenuToggleButton({ isSessionListOpen, toggleSessionList }) {
  return (
    <button
      onClick={toggleSessionList}
      className={`
        fixed top-[50px] -translate-y-1/2 z-50 
        w-5 h-10 bg-[#4B4B4B] shadow-lg rounded-r-lg
        flex items-center justify-center text-white hover:text-black
        hover:bg-primary transition-all duration-300
        focus:outline-none
        transform ${isSessionListOpen ? 'translate-x-80' : 'translate-x-0'}
      `}
      aria-label="Toggle Session List"
    >
      {isSessionListOpen ? (
        <FiChevronsLeft className="w-4 h-4 text-gray-300" />
      ) : (
        <FiChevronsRight className="w-4 h-4 text-gray-300" />
      )}
    </button>
  );
}
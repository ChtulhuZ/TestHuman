import React from 'react';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const XIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

export const Popup: React.FC<PopupProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-8 m-4 max-w-md w-full relative transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the popup
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
          aria-label="Chiudi popup"
        >
          <XIcon className="h-6 w-6" />
        </button>
        <div className="text-center">
          <h2 id="popup-title" className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
          <div className="text-gray-600">
            {children}
          </div>
        </div>
        <style>{`
            @keyframes fade-in-scale {
                0% {
                    opacity: 0;
                    transform: scale(0.95);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            .animate-fade-in-scale {
                animation: fade-in-scale 0.3s forwards cubic-bezier(0.16, 1, 0.3, 1);
            }
        `}</style>
      </div>
    </div>
  );
};
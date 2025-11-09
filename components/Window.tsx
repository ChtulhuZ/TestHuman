

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CloseIcon } from './icons/CloseIcon';

interface WindowProps {
    children: React.ReactNode;
    title: string;
    onClose: () => void;
    className?: string;
}

const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

    useEffect(() => {
        const media = window.matchMedia(query);
        const listener = () => setMatches(media.matches);
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [query]);

    return matches;
};

// FIX: Added `as const` to `ease` properties to fix framer-motion typing issue.
const windowVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const } },
    exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2, ease: "easeOut" as const } },
};

const mobileBackdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
};

// FIX: Added `as const` to `ease` properties to fix framer-motion typing issue.
const mobileWindowVariants = {
    hidden: { y: "100%" },
    visible: { y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
    exit: { y: "100%", transition: { duration: 0.3, ease: "easeIn" as const } },
};

const Window: React.FC<WindowProps> = ({ children, title, onClose, className = '' }) => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    
    const dragProps = isMobile ? { drag: false } : { drag: true, dragMomentum: false, dragHandle: ".drag-handle" };

    if (isMobile) {
        return (
            <motion.div
                variants={mobileBackdropVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 flex items-end justify-center"
                onClick={onClose}
            >
                <motion.div
                    variants={mobileWindowVariants}
                    className="w-full h-[90vh] bg-slate-800 border-t border-slate-700 rounded-t-2xl shadow-2xl z-50 flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="h-14 flex-shrink-0 flex items-center justify-between px-4 rounded-t-2xl border-b border-slate-700">
                        <span className="font-bold text-slate-200 text-lg">{title}</span>
                        <button 
                            onClick={onClose} 
                            className="p-2 -mr-2 rounded-full text-slate-400 hover:bg-slate-700/50 hover:text-slate-100 transition-colors"
                            aria-label="Close window"
                        >
                            <CloseIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                        {children}
                    </div>
                </motion.div>
            </motion.div>
        )
    }

    return (
        <motion.div
            variants={windowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            {...dragProps}
            className={`bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-lg shadow-2xl z-30 flex flex-col ${className}`}
            style={{ pointerEvents: 'auto' }}
        >
            <div className="drag-handle h-10 flex-shrink-0 flex items-center justify-between px-4 bg-slate-900/50 rounded-t-lg border-b border-slate-700 cursor-move">
                <span className="font-bold text-slate-200">{title}</span>
                <button 
                    onClick={onClose} 
                    className="p-1 rounded-full text-slate-400 hover:bg-slate-700/50 hover:text-slate-100 transition-colors"
                    aria-label="Close window"
                >
                    <CloseIcon className="w-5 h-5" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {children}
            </div>
             <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #64748b; }
            `}</style>
        </motion.div>
    );
};

export default Window;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseIcon } from './icons/CloseIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';

interface SurveyWidgetProps {
    onOpen: () => void;
    onClose: () => void;
}

// FIX: Added `as const` to `ease` properties to fix framer-motion typing issue.
const widgetVariants = {
    hidden: { opacity: 0, x: -30, scale: 0.95 },
    visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
    exit: { opacity: 0, x: -20, scale: 0.95, transition: { duration: 0.3, ease: 'easeIn' as const } },
};

const SurveyWidget: React.FC<SurveyWidgetProps> = ({ onOpen, onClose }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            variants={widgetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-6 left-6 w-80 z-40"
        >
            <div 
                className="bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-lg shadow-2xl overflow-hidden"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="h-10 flex items-center justify-between px-3 bg-slate-900/50">
                    <div className="flex items-center gap-2">
                        <ClipboardIcon className="w-4 h-4 text-cyan-300" />
                        <span className="font-bold text-slate-200 text-sm">Active Surveys</span>
                    </div>
                     <button 
                        onClick={onClose} 
                        className="p-1 rounded-full text-slate-400 hover:bg-slate-700/50 hover:text-slate-100 transition-colors"
                        aria-label="Close survey widget"
                    >
                        <CloseIcon className="w-4 h-4" />
                    </button>
                </div>
                <div 
                    className="p-4 cursor-pointer"
                    onClick={onOpen}
                >
                    <div className="flex items-center gap-3 text-slate-400">
                        <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse"></div>
                        <span>loading survey...</span>
                    </div>
                </div>
                 <AnimatePresence>
                {isHovered && (
                    <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: '2px' }}
                        exit={{ height: 0 }}
                        className="bg-cyan-400"
                    />
                )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default SurveyWidget;
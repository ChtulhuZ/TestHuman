
import React from 'react';
import { motion } from 'framer-motion';

interface SurveyToastProps {
    onStart: () => void;
    onDismiss: () => void;
}

// FIX: Added `as const` to `ease` properties to fix framer-motion typing issue.
const toastVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
    exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.3, ease: 'easeIn' as const } },
};

const SurveyToast: React.FC<SurveyToastProps> = ({ onStart, onDismiss }) => {
    return (
        <motion.div
            variants={toastVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-lg p-4 z-50"
        >
            <div className="bg-slate-800/70 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl p-5 flex items-center justify-between gap-4">
                <div>
                    <h3 className="font-bold text-slate-100">Help Improve HumanMade</h3>
                    <p className="text-slate-400 text-sm mt-1">Take a short survey to share your feedback about this experience.</p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-3">
                     <button 
                        onClick={onDismiss}
                        className="px-4 py-2 text-sm font-semibold text-slate-300 rounded-md hover:bg-slate-700/50 transition-colors"
                    >
                        Maybe Later
                    </button>
                    <button 
                        onClick={onStart}
                        className="px-4 py-2 text-sm font-bold text-slate-900 bg-cyan-400 rounded-md hover:bg-cyan-300 transition-colors"
                    >
                        Start Survey
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default SurveyToast;
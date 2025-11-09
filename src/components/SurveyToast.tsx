import React, { useState, useEffect } from 'react';

interface SurveyToastProps {
    onStart: () => void;
    onDismiss: () => void;
}

const SurveyToast: React.FC<SurveyToastProps> = ({ onStart, onDismiss }) => {
    const [isExiting, setIsExiting] = useState(false);

    const handleDismiss = () => {
        setIsExiting(true);
        setTimeout(onDismiss, 300); // match animation duration
    };
    
    const handleStart = () => {
        setIsExiting(true);
        setTimeout(onStart, 300); // match animation duration
    };

    return (
        <div
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-lg p-4 z-50 ${isExiting ? 'anim-scale-out' : 'anim-scale-in'}`}
        >
            <div className="bg-slate-800/70 backdrop-blur-md border border-slate-700 rounded-xl shadow-2xl p-5 flex items-center justify-between gap-4">
                <div>
                    <h3 className="font-bold text-slate-100">Help Improve HumanMade</h3>
                    <p className="text-slate-400 text-sm mt-1">Take a short survey to share your feedback about this experience.</p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-3">
                     <button 
                        onClick={handleDismiss}
                        className="px-4 py-2 text-sm font-semibold text-slate-300 rounded-md hover:bg-slate-700/50 transition-colors"
                    >
                        Maybe Later
                    </button>
                    <button 
                        onClick={handleStart}
                        className="px-4 py-2 text-sm font-bold text-slate-900 bg-cyan-400 rounded-md hover:bg-cyan-300 transition-colors"
                    >
                        Start Survey
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SurveyToast;

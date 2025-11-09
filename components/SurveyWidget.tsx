import React, { useState } from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { ClipboardIcon } from './icons/ClipboardIcon';

interface SurveyWidgetProps {
    onOpen: () => void;
    onClose: () => void;
}

const SurveyWidget: React.FC<SurveyWidgetProps> = ({ onOpen, onClose }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(onClose, 300); // match animation duration
    }

    return (
        <div
            className={`fixed bottom-6 left-6 w-80 z-40 transition-all duration-300 ${isExiting ? 'opacity-0 -translate-x-5' : 'opacity-100 translate-x-0'}`}
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
                        onClick={handleClose} 
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
                
                <div 
                    className="bg-cyan-400 transition-all duration-300"
                    style={{ height: isHovered ? '2px' : '0px' }}
                />
            </div>
        </div>
    );
};

export default SurveyWidget;
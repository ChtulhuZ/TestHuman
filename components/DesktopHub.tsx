
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Window from './Window';
import KeepInTouch from './KeepInTouch';
import BeHuman from './BeHuman';
import SurveyToast from './SurveyToast';
import SurveyWidget from './SurveyWidget';
import SurveyContent from './SurveyContent';
import { SyncIcon } from './icons/SyncIcon';
import { LetterIcon } from './icons/LetterIcon';

const SURVEY_INTERACTED_KEY = 'humanmade_survey_interacted';

const DesktopHub: React.FC = () => {
    const [isSyncOpen, setIsSyncOpen] = useState(false);
    const [isKitOpen, setIsKitOpen] = useState(false);

    // Survey state
    const [isSurveyToastVisible, setIsSurveyToastVisible] = useState(false);
    const [isSurveyWidgetVisible, setIsSurveyWidgetVisible] = useState(false);
    const [isSurveyWindowOpen, setIsSurveyWindowOpen] = useState(false);

    useEffect(() => {
        if (localStorage.getItem(SURVEY_INTERACTED_KEY)) {
            // If they dismissed it before, show the widget
            if (localStorage.getItem(SURVEY_INTERACTED_KEY) === 'dismissed') {
                setIsSurveyWidgetVisible(true);
            }
            return;
        }

        const timer = setTimeout(() => {
            setIsSurveyToastVisible(true);
        }, 4000); // Show toast after 4 seconds

        return () => clearTimeout(timer);
    }, []);

    const handleStartSurvey = () => {
        setIsSurveyToastVisible(false);
        setIsSurveyWindowOpen(true);
        localStorage.setItem(SURVEY_INTERACTED_KEY, 'started');
    };

    const handleDismissToast = () => {
        setIsSurveyToastVisible(false);
        setIsSurveyWidgetVisible(true);
        localStorage.setItem(SURVEY_INTERACTED_KEY, 'dismissed');
    };

    const handleOpenSurveyFromWidget = () => {
        setIsSurveyWidgetVisible(false);
        setIsSurveyWindowOpen(true);
    };
    
    const handleCloseSurveyWindow = () => {
        setIsSurveyWindowOpen(false);
        // Bring back the widget so they can open it again
        setIsSurveyWidgetVisible(true);
    };


    const DesktopIcon: React.FC<{onClick: () => void, icon: React.ReactNode, label: string}> = ({ onClick, icon, label }) => (
        <motion.button 
            onClick={onClick}
            className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-slate-700/50 transition-colors w-32 text-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <div className="p-4 bg-slate-800/60 rounded-lg border border-slate-700">
                {icon}
            </div>
            <span className="text-slate-300 text-sm">{label}</span>
        </motion.button>
    );

    return (
        <motion.div
            className="relative w-full h-full p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            {/* Desktop Icons */}
            <div className="space-y-4">
                <DesktopIcon 
                    onClick={() => setIsSyncOpen(true)}
                    icon={<SyncIcon className="w-8 h-8 text-cyan-300" />}
                    label="Synchronize Connection"
                />
                <DesktopIcon 
                    onClick={() => setIsKitOpen(true)}
                    icon={<LetterIcon className="w-8 h-8 text-cyan-300" />}
                    label="Keep in Touch"
                />
            </div>
            
            {/* Windows */}
            <AnimatePresence>
                {isSyncOpen && (
                    <Window 
                        title="Synchronize Connection" 
                        onClose={() => setIsSyncOpen(false)}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-auto max-w-[90vw] h-auto max-h-[80vh]"
                    >
                        <BeHuman />
                    </Window>
                )}
                {isKitOpen && (
                    <Window 
                        title="Keep in Touch" 
                        onClose={() => setIsKitOpen(false)} 
                        className="absolute top-8 right-8 w-[400px] h-[640px]"
                    >
                        <KeepInTouch />
                    </Window>
                )}
                 {isSurveyWindowOpen && (
                    <Window
                        title="HumanMade Research Survey"
                        onClose={handleCloseSurveyWindow}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px]"
                    >
                        <SurveyContent />
                    </Window>
                )}
            </AnimatePresence>

            {/* Survey UI */}
            <AnimatePresence>
                {isSurveyToastVisible && (
                    <SurveyToast onStart={handleStartSurvey} onDismiss={handleDismissToast} />
                )}
                {isSurveyWidgetVisible && (
                    <SurveyWidget onOpen={handleOpenSurveyFromWidget} onClose={() => setIsSurveyWidgetVisible(false)} />
                )}
            </AnimatePresence>

        </motion.div>
    );
};

export default DesktopHub;

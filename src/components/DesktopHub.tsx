import React, { useState, useEffect } from 'react';
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
        <button 
            onClick={onClick}
            className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200 w-32 text-center hover:scale-105 active:scale-95"
        >
            <div className="p-4 bg-slate-800/60 rounded-lg border border-slate-700">
                {icon}
            </div>
            <span className="text-slate-300 text-sm">{label}</span>
        </button>
    );

    return (
        <div
            className="relative w-full h-full p-4 md:p-8 anim-fade-in"
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
            
            {isSyncOpen && (
                <Window 
                    title="Synchronize Connection" 
                    onClose={() => setIsSyncOpen(false)}
                    initialSize={{ width: 'auto', height: 'auto' }}
                    isCentered={true}
                >
                    <BeHuman />
                </Window>
            )}
            {isKitOpen && (
                <Window 
                    title="Keep in Touch" 
                    onClose={() => setIsKitOpen(false)} 
                    initialPosition={{ top: 32, right: 32 }}
                    initialSize={{ width: 400, height: 640 }}
                >
                    <KeepInTouch />
                </Window>
            )}
             {isSurveyWindowOpen && (
                <Window
                    title="HumanMade Research Survey"
                    onClose={handleCloseSurveyWindow}
                    initialSize={{ width: 500, height: 300 }}
                    isCentered={true}
                >
                    <SurveyContent />
                </Window>
            )}
            

            {/* Survey UI */}
            
            {isSurveyToastVisible && (
                <SurveyToast onStart={handleStartSurvey} onDismiss={handleDismissToast} />
            )}
            {isSurveyWidgetVisible && (
                <SurveyWidget onOpen={handleOpenSurveyFromWidget} onClose={() => setIsSurveyWidgetVisible(false)} />
            )}
            

        </div>
    );
};

export default DesktopHub;

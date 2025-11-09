
import React from 'react';

const SurveyContent: React.FC = () => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-4">
            <div 
                className="w-8 h-8 border-4 border-slate-600 border-t-cyan-400 rounded-full animate-spin"
                aria-label="Loading survey"
            ></div>
            <p className="text-lg">loading survey...</p>
        </div>
    );
};

export default SurveyContent;

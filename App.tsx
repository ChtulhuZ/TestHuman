
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Certification from './components/Certification';
import DesktopHub from './components/DesktopHub';

const App: React.FC = () => {
    const [isCertified, setIsCertified] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check certification status after a brief moment to avoid flash of content
        const timer = setTimeout(() => {
            if (localStorage.getItem('humanmade_certified') === 'true') {
                setIsCertified(true);
            }
            setIsLoading(false);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const handleCertification = () => {
        localStorage.setItem('humanmade_certified', 'true');
        setIsCertified(true);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 antialiased selection:bg-cyan-300 selection:text-slate-900">
            <div className="relative isolate min-h-screen overflow-hidden">
                <div 
                    className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"
                >
                    <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-cyan-400 opacity-20 blur-[100px]"></div>
                </div>
                <main className="h-screen w-screen">
                     <AnimatePresence mode="wait">
                        {isLoading ? (
                            <div key="loader" className="w-full h-full flex items-center justify-center"></div>
                        ) : isCertified ? (
                           <DesktopHub key="hub" />
                        ) : (
                           <Certification key="certification" onCertified={handleCertification} />
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default App;

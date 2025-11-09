
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CertificationProps {
    onCertified: () => void;
}

const Certification: React.FC<CertificationProps> = ({ onCertified }) => {
    const [canProceed, setCanProceed] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkForScroll = () => {
            const container = scrollContainerRef.current;
            // If the content isn't taller than the container, there's no scrollbar.
            // In this case, the user can proceed immediately.
            if (container && container.scrollHeight <= container.clientHeight) {
                setCanProceed(true);
            }
        };

        // A small delay is needed for the DOM to be fully painted and scrollHeight to be accurate.
        const timer = setTimeout(checkForScroll, 100);

        window.addEventListener('resize', checkForScroll);
        
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', checkForScroll);
        };
    }, []);

    const handleScroll = () => {
        if (canProceed) return;
        const container = scrollContainerRef.current;
        if (container) {
            // Check if user has scrolled to the bottom (with a small tolerance)
            const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 5;
            if (isAtBottom) {
                setCanProceed(true);
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full h-full flex flex-col items-center justify-center p-4 md:p-8"
        >
            <div className="max-w-4xl w-full h-full flex flex-col">
                <div 
                    ref={scrollContainerRef} 
                    onScroll={handleScroll} 
                    className="flex-1 overflow-y-auto p-8 md:p-12 bg-slate-800/40 border border-slate-700/50 rounded-xl backdrop-blur-sm custom-scrollbar"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-100 tracking-tight">Human Made Certification</h1>
                    <p className="mt-2 text-lg text-cyan-300 italic">The Organic Product of Technology.</p>
                    
                    <div className="mt-8 space-y-4 text-slate-300 text-base/relaxed">
                        <p>
                            In an age dominated by artificial intelligence, the <strong className="font-bold text-slate-100">Human Made</strong> seal represents a commitment to the most sincere human creativity. This certification is awarded to products of any kind: Works of art, products, services, and more. Any human creation free from even a minimal amount of artificial intelligence in the creative process.
                        </p>
                        <p>
                            It demonstrates the value of the purely human touch, intention, and skill. From hand-crafted code to music, images, and emotions. The Human Made certification promotes a personal imperfection that only a human hand can possess.
                        </p>
                         <p>
                            At Human Made, we believe that, while artificial intelligence is a powerful tool, human creation, experience, effort, and inspiration should be recognized irreplaceably. We plan to preserve and highlight these qualities, offering distinction to consumers and products, seeking authenticity in an environment saturated with content.
                        </p>

                        <h2 className="text-xl font-semibold text-slate-100 pt-4">Core Principles:</h2>
                        <ul className="list-disc list-inside space-y-2 pl-4">
                            <li>
                                <span className="font-semibold text-cyan-400">Authenticity:</span> Verify conceptual and practical work, guided by human authors.
                            </li>
                            <li>
                                <span className="font-semibold text-cyan-400">Craftsmanship:</span> Praise to human skill, time, experience, creation, and artistic flair.
                            </li>
                            <li>
                                <span className="font-semibold text-cyan-400">Transparency:</span> Clarity of the tools used, ensuring human exclusivity in the production and creation of content.
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="flex-shrink-0 mt-6 flex justify-center h-12">
                    <AnimatePresence>
                        {canProceed && (
                            <motion.button 
                                onClick={onCertified}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className="px-8 py-3 bg-cyan-500/80 text-slate-900 font-bold text-lg rounded-lg border border-cyan-400/50 shadow-lg shadow-cyan-500/10 hover:bg-cyan-500"
                            >
                                I am human.
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #1e293b50;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #475569;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #64748b;
                }
            `}</style>
        </motion.div>
    );
};

export default Certification;
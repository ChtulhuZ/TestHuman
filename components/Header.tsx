

import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuIcon } from './icons/MenuIcon';
import { CloseIcon } from './icons/CloseIcon';
import { useTranslation } from '../hooks/useTranslation';

// FIX: Added `as const` to `ease` properties to fix framer-motion typing issue.
const menuVariants = {
    hidden: {
        opacity: 0,
        y: -20,
        scale: 0.95,
        transition: { duration: 0.2, ease: "easeOut" as const }
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.2, ease: "easeIn" as const }
    }
};

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const { t } = useTranslation();

    // Close menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    // Close menu on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <motion.header 
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="py-6 px-4 sm:px-6 lg:px-8"
        >
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center gap-4 md:gap-6">
                    <Link to="/" className="text-3xl md:text-4xl font-bold tracking-widest text-slate-100 hover:text-cyan-300 transition-colors duration-300 uppercase">
                        HumanMade
                    </Link>
                </div>
                
                <div className="flex items-center">
                    <div className="relative" ref={menuRef}>
                        <button 
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-md text-slate-300 hover:text-cyan-300 hover:bg-slate-800/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                            aria-label="Toggle menu"
                            aria-expanded={isOpen}
                        >
                            {isOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                        </button>
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    variants={menuVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    className="absolute top-full right-0 mt-2 w-72 origin-top-right bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-lg shadow-2xl z-50 p-4"
                                >
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('header.experiences')}</h3>
                                            <nav className="mt-2 flex flex-col space-y-1">
                                                <Link to="/keep-in-touch" className="px-3 py-2 text-slate-200 hover:bg-slate-700/50 hover:text-cyan-300 rounded-md transition-colors">
                                                    {t('header.keepInTouch')}
                                                </Link>
                                                <Link to="/be-human" className="px-3 py-2 text-slate-200 hover:bg-slate-700/50 hover:text-cyan-300 rounded-md transition-colors">
                                                    {t('header.synchronizeConnection')}
                                                </Link>
                                            </nav>
                                        </div>
                                        <div className="border-t border-slate-700"></div>
                                        <div>
                                            <h3 className="px-3 pt-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">{t('header.projects')}</h3>
                                            <nav className="mt-2 flex flex-col space-y-1">
                                                 <Link to="/certification" className="px-3 py-2 text-slate-200 hover:bg-slate-700/50 hover:text-cyan-300 rounded-md transition-colors">
                                                    {t('header.hmCertification')}
                                                </Link>
                                            </nav>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.header>
    );
}

export default Header;
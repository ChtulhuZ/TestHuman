

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../hooks/useTranslation';
import { Locale } from '../locales/translations';

import { ItalyFlagIcon } from './icons/flags/ItalyFlagIcon';
import { UsaFlagIcon } from './icons/flags/UsaFlagIcon';
import { GermanyFlagIcon } from './icons/flags/GermanyFlagIcon';
import { FranceFlagIcon } from './icons/flags/FranceFlagIcon';
import { RussiaFlagIcon } from './icons/flags/RussiaFlagIcon';

// FIX: Added `as const` to `ease` properties to fix framer-motion typing issue.
const menuVariants = {
    hidden: {
        opacity: 0,
        y: -10,
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

const languages: { locale: Locale; Flag: React.FC<React.SVGProps<SVGSVGElement>>; name: string }[] = [
    { locale: 'it', Flag: ItalyFlagIcon, name: 'Italiano' },
    { locale: 'en', Flag: UsaFlagIcon, name: 'English' },
    { locale: 'de', Flag: GermanyFlagIcon, name: 'Deutsch' },
    { locale: 'fr', Flag: FranceFlagIcon, name: 'Français' },
    { locale: 'ru', Flag: RussiaFlagIcon, name: 'Русский' },
];

const LanguageSwitcher: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { locale, setLocale } = useLanguage();
    const menuRef = useRef<HTMLDivElement>(null);

    const CurrentFlag = languages.find(l => l.locale === locale)?.Flag || ItalyFlagIcon;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectLanguage = (newLocale: Locale) => {
        setLocale(newLocale);
        setIsOpen(false);
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center p-2 rounded-md hover:bg-slate-800/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                aria-label="Change language"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <CurrentFlag className="w-6 h-6 rounded-sm" />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={menuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="absolute top-full left-0 mt-2 w-48 origin-top-left bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-lg shadow-2xl z-50 p-2"
                    >
                        <ul className="space-y-1">
                            {languages.map(({ locale: langLocale, Flag, name }) => (
                                <li key={langLocale}>
                                    <button
                                        onClick={() => handleSelectLanguage(langLocale)}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-left text-slate-200 hover:bg-slate-700/50 hover:text-cyan-300 rounded-md transition-colors"
                                    >
                                        <Flag className="w-5 h-5 rounded-sm flex-shrink-0" />
                                        <span>{name}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LanguageSwitcher;
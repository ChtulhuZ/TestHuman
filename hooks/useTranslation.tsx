

import React, { createContext, useContext, useMemo, useState } from 'react';
import { translations, Language, Locale } from '../locales/translations';

interface LanguageContextType {
    locale: Locale;
    translations: Language;
    setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // FIX: Use useState to allow changing the locale.
    const [locale, setLocale] = useState<Locale>('en'); 
    
    const value = useMemo(() => ({
        locale,
        translations: translations[locale],
        setLocale // FIX: Provide setLocale to consumers of the context.
    }), [locale]);

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export const useTranslation = () => {
    const { translations } = useLanguage();

    const t = (key: string): string => {
        const keys = key.split('.');
        let result: any = translations;
        for (const k of keys) {
            result = result[k];
            if (result === undefined) {
                console.warn(`Translation key not found: ${key}`);
                return key;
            }
        }
        return result as string;
    };

    return { t };
};
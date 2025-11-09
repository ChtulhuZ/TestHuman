

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { useTranslation } from '../hooks/useTranslation';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        }
    }
};

// FIX: Added `as const` to `ease` property to fix framer-motion typing issue.
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
  }
};

const ExperienceCard: React.FC<{ to: string; title: string; description: string }> = ({ to, title, description }) => {
    const { t } = useTranslation();
    return (
        <motion.div variants={cardVariants} whileHover={{ y: -8, scale: 1.03 }} transition={{ type: 'spring', stiffness: 300 }}>
            <Link 
                to={to}
                className="block p-8 bg-slate-800/40 border border-slate-700/50 rounded-xl backdrop-blur-sm h-full flex flex-col group"
            >
                <h3 className="text-2xl font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">{title}</h3>
                <p className="mt-2 text-slate-400 flex-grow">{description}</p>
                <div className="mt-6 flex items-center text-cyan-300 font-semibold">
                    <span className="group-hover:underline">{t('hub.card.enterExperience')}</span>
                    <ArrowRightIcon className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </div>
            </Link>
        </motion.div>
    );
};

const Hub: React.FC = () => {
    const { t } = useTranslation();
    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={containerVariants}
        >
            <motion.div variants={cardVariants} className="text-center max-w-2xl mx-auto mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-100 tracking-tight">{t('hub.title')}</h1>
                <p className="mt-4 text-lg text-slate-400">{t('hub.subtitle')}</p>
            </motion.div>

            <motion.div 
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            >
                <ExperienceCard 
                    to="/keep-in-touch"
                    title={t('hub.card1.title')}
                    description={t('hub.card1.description')}
                />
                <ExperienceCard 
                    to="/be-human"
                    title={t('hub.card2.title')}
                    description={t('hub.card2.description')}
                />
            </motion.div>
        </motion.div>
    );
}

export default Hub;
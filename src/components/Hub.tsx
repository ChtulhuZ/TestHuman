

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { useTranslation } from '../hooks/useTranslation';

const ExperienceCard: React.FC<{ to: string; title: string; description: string; delay: number }> = ({ to, title, description, delay }) => {
    const { t } = useTranslation();
    return (
        <div 
            className="transition-transform duration-300 ease-out hover:-translate-y-2 hover:scale-[1.03] anim-fade-in-up"
            style={{ animationDelay: `${delay}s`}}
        >
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
        </div>
    );
};

const Hub: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="anim-fade-in">
            <div className="text-center max-w-2xl mx-auto mb-12 anim-fade-in-up" style={{ animationDelay: '0.1s'}}>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-100 tracking-tight">{t('hub.title')}</h1>
                <p className="mt-4 text-lg text-slate-400">{t('hub.subtitle')}</p>
            </div>

            <div 
                className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            >
                <ExperienceCard 
                    to="/keep-in-touch"
                    title={t('hub.card1.title')}
                    description={t('hub.card1.description')}
                    delay={0.2}
                />
                <ExperienceCard 
                    to="/be-human"
                    title={t('hub.card2.title')}
                    description={t('hub.card2.description')}
                    delay={0.3}
                />
            </div>
        </div>
    );
}

export default Hub;

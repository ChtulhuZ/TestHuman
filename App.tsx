import React, { useState, useEffect, useRef, createContext, useContext, useCallback, useMemo } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
// FIX: Imported `Variants` type from framer-motion to correctly type the animation variants object.
import { motion, AnimatePresence, Variants } from 'framer-motion';

// --- CONSTANTS ---
const LOCAL_STORAGE_KEYS = {
    CERTIFIED: 'humanmade_certified',
    KEEP_IN_TOUCH_MESSAGES: 'humanmade_kit_messages',
    KEEP_IN_TOUCH_LAST_SENT: 'humanmade_kit_last_sent',
    SYNC_CONN_LAST_SOLVED: 'humanmade_sc_last_solved',
    SURVEY_STATE: 'humanmade_survey_state', // 'initial', 'dismissed', 'started'
};
const COOLDOWN_MILLISECONDS = 24 * 60 * 60 * 1000;

// --- INTERNATIONALIZATION (i18n) ---
const locales = {
    en: {
        certification: {
            title: "Human Made Certification",
            manifesto: "In an age of automated artistry and algorithmic echoes, we champion the unquantifiable spark of human creativity. This space is a sanctuary for thoughts, feelings, and creations born from organic, unassisted consciousness. By proceeding, you certify that your interactions are your own, a testament to the authentic, imperfect, and irreplaceable human touch.",
            button: "I am human."
        },
        desktop: {
            keepInTouch: "Keep in Touch",
            synchronizeConnection: "Synchronize Connection",
        },
        keepInTouch: {
            title: "Keep in Touch",
            placeholder: "Send a message... (1 per 24h)",
            send: "Send",
            cooldown: "Next message available in:",
            response: "Thank you for sharing. Your message has been received and contemplated."
        },
        beHuman: {
            title: "Synchronize Connection",
            forceSync: "Force Synchronization",
            forceSyncing: "Synchronizing...",
            puzzleSolved: "Connection Synchronized",
            timeTaken: "Time:",
            interactions: "Interactions:",
            cooldown: "Next synchronization available in:"
        },
        survey: {
            toastTitle: "Share your thoughts?",
            start: "Start Survey",
            later: "Maybe Later",
            widgetText: "Feedback",
            loading: "loading survey..."
        },
        close: "Close"
    },
    it: {
        certification: {
            title: "Certificazione Human Made",
            manifesto: "In un'epoca di arte automatizzata ed echi algoritmici, sosteniamo la scintilla inquantificabile della creatività umana. Questo spazio è un santuario per pensieri, sentimenti e creazioni nate da una coscienza organica e non assistita. Proseguendo, certifichi che le tue interazioni sono le tue, una testimonianza del tocco umano autentico, imperfetto e insostituibile.",
            button: "Sono umano."
        },
        desktop: {
            keepInTouch: "Resta in Contatto",
            synchronizeConnection: "Sincronizza Connessione",
        },
        keepInTouch: {
            title: "Resta in Contatto",
            placeholder: "Invia un messaggio... (1 ogni 24h)",
            send: "Invia",
            cooldown: "Prossimo messaggio disponibile tra:",
            response: "Grazie per aver condiviso. Il tuo messaggio è stato ricevuto e contemplato."
        },
        beHuman: {
            title: "Sincronizza Connessione",
            forceSync: "Forza Sincronizzazione",
            forceSyncing: "Sincronizzazione...",
            puzzleSolved: "Connessione Sincronizzata",
            timeTaken: "Tempo:",
            interactions: "Interazioni:",
            cooldown: "Prossima sincronizzazione disponibile tra:"
        },
        survey: {
            toastTitle: "Condividi i tuoi pensieri?",
            start: "Inizia Sondaggio",
            later: "Forse più tardi",
            widgetText: "Feedback",
            loading: "caricamento sondaggio..."
        },
        close: "Chiudi"
    },
    de: {
        certification: {
            title: "Human Made Zertifizierung",
            manifesto: "In einem Zeitalter automatisierter Kunst und algorithmischer Echos setzen wir uns für den unermesslichen Funken menschlicher Kreativität ein. Dieser Raum ist ein Zufluchtsort für Gedanken, Gefühle und Schöpfungen, die aus organischem, ununterstütztem Bewusstsein geboren wurden. Indem Sie fortfahren, bestätigen Sie, dass Ihre Interaktionen Ihre eigenen sind, ein Zeugnis für die authentische, unvollkommene und unersetzliche menschliche Note.",
            button: "Ich bin ein Mensch."
        },
        desktop: { keepInTouch: "In Kontakt bleiben", synchronizeConnection: "Verbindung synchronisieren" },
        keepInTouch: { title: "In Kontakt bleiben", placeholder: "Nachricht senden... (1 pro 24h)", send: "Senden", cooldown: "Nächste Nachricht verfügbar in:", response: "Danke für das Teilen. Deine Nachricht wurde empfangen und bedacht." },
        beHuman: { title: "Verbindung synchronisieren", forceSync: "Synchronisation erzwingen", forceSyncing: "Synchronisiere...", puzzleSolved: "Verbindung synchronisiert", timeTaken: "Zeit:", interactions: "Interaktionen:", cooldown: "Nächste Synchronisation verfügbar in:" },
        survey: { toastTitle: "Teilen Sie Ihre Gedanken?", start: "Umfrage starten", later: "Vielleicht später", widgetText: "Feedback", loading: "lade umfrage..." },
        close: "Schließen"
    },
    fr: {
        certification: {
            title: "Certification Human Made",
            manifesto: "À une époque d'art automatisé et d'échos algorithmiques, nous défendons l'étincelle incommensurable de la créativité humaine. Cet espace est un sanctuaire pour les pensées, les sentiments et les créations nés d'une conscience organique et non assistée. En continuant, vous certifiez que vos interactions sont les vôtres, un témoignage de la touche humaine authentique, imparfaite et irremplaçable.",
            button: "Je suis humain."
        },
        desktop: { keepInTouch: "Garder le contact", synchronizeConnection: "Synchroniser la Connexion" },
        keepInTouch: { title: "Garder le contact", placeholder: "Envoyer un message... (1 par 24h)", send: "Envoyer", cooldown: "Prochain message disponible dans :", response: "Merci de partager. Votre message a été reçu et contemplé." },
        beHuman: { title: "Synchroniser la Connexion", forceSync: "Forcer la Synchronisation", forceSyncing: "Synchronisation...", puzzleSolved: "Connexion Synchronisée", timeTaken: "Temps :", interactions: "Interactions :", cooldown: "Prochaine synchronisation disponible dans :" },
        survey: { toastTitle: "Partagez vos pensées ?", start: "Commencer l'enquête", later: "Peut-être plus tard", widgetText: "Avis", loading: "chargement de l'enquête..." },
        close: "Fermer"
    },
    ru: {
        certification: {
            title: "Сертификация Human Made",
            manifesto: "В эпоху автоматизированного искусства и алгоритмических эхо мы отстаиваем неизмеримую искру человеческого творчества. Это пространство - убежище для мыслей, чувств и творений, рожденных из органического, неподдерживаемого сознания. Продолжая, вы подтверждаете, что ваши взаимодействия являются вашими собственными, свидетельством подлинного, несовершенного и незаменимого человеческого прикосновения.",
            button: "Я человек."
        },
        desktop: { keepInTouch: "Оставаться на связи", synchronizeConnection: "Синхронизировать Соединение" },
        keepInTouch: { title: "Оставаться на связи", placeholder: "Отправить сообщение... (1 в 24ч)", send: "Отправить", cooldown: "Следующее сообщение доступно через:", response: "Спасибо, что поделились. Ваше сообщение получено и обдумано." },
        beHuman: { title: "Синхронизировать Соединение", forceSync: "Принудительная синхронизация", forceSyncing: "Синхронизация...", puzzleSolved: "Соединение синхронизировано", timeTaken: "Время:", interactions: "Взаимодействия:", cooldown: "Следующая синхронизация доступна через:" },
        survey: { toastTitle: "Поделитесь своими мыслями?", start: "Начать опрос", later: "Может быть, позже", widgetText: "Обратная связь", loading: "загрузка опроса..." },
        close: "Закрыть"
    }
};

const LanguageContext = createContext({ t: (key) => key });
const LanguageProvider = ({ children }) => {
    const [language] = useState('en'); // Default language
    const t = useCallback((key) => {
        const keys = key.split('.');
        let result = locales[language];
        for (const k of keys) {
            result = result?.[k];
            if (result === undefined) return key;
        }
        return result;
    }, [language]);
    return <LanguageContext.Provider value={{ t }}>{children}</LanguageContext.Provider>;
};
const useTranslation = () => useContext(LanguageContext);

// --- CUSTOM HOOKS ---
const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });
    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };
    return [storedValue, setValue];
};

const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(false);
    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        window.addEventListener("resize", listener);
        return () => window.removeEventListener("resize", listener);
    }, [matches, query]);
    return matches;
};


// --- ICONS ---
const CloseIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
const SyncIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-3.181-3.182a8.25 8.25 0 00-11.664 0l-3.181 3.183" /></svg>);
const MessageIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>);
const Spinner = () => (<svg className="animate-spin h-5 w-5 text-cyan-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>);


// --- CERTIFICATION ---
const Certification = ({ onCertify }) => {
    const { t } = useTranslation();
    const [isAtBottom, setIsAtBottom] = useState(false);
    const scrollRef = useRef(null);

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 5) {
            setIsAtBottom(true);
        }
    };

    useEffect(() => {
        const element = scrollRef.current;
        if (element) {
            // Check if content is not scrollable initially. If so, user is at the bottom.
            if (element.scrollHeight <= element.clientHeight) {
                setIsAtBottom(true);
            }
        }
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-screen flex items-center justify-center bg-slate-900 p-4"
        >
            <div className="w-full max-w-2xl bg-slate-800/50 backdrop-blur-sm border border-cyan-300/20 rounded-lg p-8 space-y-6">
                <h1 className="text-3xl font-bold text-center text-cyan-300 glow">{t('certification.title')}</h1>
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="h-64 overflow-y-auto pr-4 custom-scrollbar"
                >
                    <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{t('certification.manifesto')}</p>
                </div>
                <div className="text-center">
                    <AnimatePresence>
                        {isAtBottom && (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={onCertify}
                                className="px-8 py-3 bg-cyan-400/20 border border-cyan-300 text-cyan-300 rounded-md hover:bg-cyan-300 hover:text-slate-900 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-300 btn-glow"
                            >
                                {t('certification.button')}
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};


// --- DESKTOP COMPONENTS ---
const Window = ({ title, children, onClose, appKey }) => {
    const { t } = useTranslation();
    const isMobile = useMediaQuery("(max-width: 768px)");

    // FIX: Explicitly typed `variants` with `Variants` from framer-motion to resolve type inference issue.
    const variants: Variants = isMobile ? {
        hidden: { y: "100%" },
        visible: { y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
        exit: { y: "100%" }
    } : {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 }
    };

    return (
        <motion.div
            key={appKey}
            drag={!isMobile}
            dragMomentum={false}
            dragConstraints={{ top: -200, left: -400, right: 400, bottom: 200 }}
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={isMobile
                ? "fixed bottom-0 left-0 right-0 h-[90vh] bg-slate-800/80 backdrop-blur-xl border-t-2 border-cyan-400/50 rounded-t-2xl z-50"
                : "absolute w-[600px] h-[500px] bg-slate-800/60 backdrop-blur-xl border border-cyan-400/30 rounded-lg shadow-2xl shadow-cyan-500/10 z-50"
            }
        >
            <header className={`flex items-center justify-between p-3 border-b border-slate-700/50 ${!isMobile && 'drag-handle'}`}>
                <h2 className="font-bold text-cyan-300">{title}</h2>
                <button
                    onClick={onClose}
                    aria-label={t('close')}
                    className="p-1 rounded-full hover:bg-slate-700/50 text-slate-400 hover:text-cyan-300 transition-colors"
                >
                    <CloseIcon />
                </button>
            </header>
            <div className="p-4 h-[calc(100%-53px)] overflow-y-auto custom-scrollbar">
                {children}
            </div>
        </motion.div>
    );
};

const DesktopIcon = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="flex flex-col items-center gap-2 text-slate-300 hover:text-cyan-300 transition-colors group">
        <div className="p-4 border-2 border-transparent group-hover:border-cyan-400/50 rounded-lg transition-all bg-slate-800/50 group-hover:bg-slate-700/50">
            {icon}
        </div>
        <span className="text-sm group-hover:glow">{label}</span>
    </button>
);

// --- SURVEY COMPONENTS ---
const SurveyToast = ({ onStart, onDismiss }) => {
    const { t } = useTranslation();
    return (
        <motion.div
            layout
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="fixed bottom-4 right-4 bg-slate-700/80 backdrop-blur-md p-4 rounded-lg shadow-lg border border-slate-600 z-50"
        >
            <p className="font-semibold text-slate-200 mb-3">{t('survey.toastTitle')}</p>
            <div className="flex gap-3">
                <button onClick={onStart} className="px-4 py-1 text-sm bg-cyan-400 text-slate-900 font-bold rounded hover:bg-cyan-300 transition-colors">{t('survey.start')}</button>
                <button onClick={onDismiss} className="px-4 py-1 text-sm bg-slate-600/50 text-slate-300 rounded hover:bg-slate-600 transition-colors">{t('survey.later')}</button>
            </div>
        </motion.div>
    );
};

const SurveyWidget = ({ onStart }) => {
    const { t } = useTranslation();
    return (
        <motion.button
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            onClick={onStart}
            className="fixed bottom-4 left-4 bg-slate-700/80 backdrop-blur-md px-4 py-2 rounded-lg shadow-lg border border-slate-600 z-40 text-sm hover:bg-slate-700 hover:border-cyan-400/50 transition-all"
        >
            {t('survey.widgetText')}
        </motion.button>
    );
};

const SurveyContent = () => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <Spinner />
            <p className="mt-4">{t('survey.loading')}</p>
        </div>
    );
};


// --- APP EXPERIENCES ---
const CooldownTimer = ({ expiryTimestamp, onEnd, label }) => {
    const [timeLeft, setTimeLeft] = useState(expiryTimestamp - Date.now());

    useEffect(() => {
        if (timeLeft <= 0) {
            onEnd();
            return;
        }
        const intervalId = setInterval(() => {
            const newTimeLeft = expiryTimestamp - Date.now();
            if (newTimeLeft <= 0) {
                clearInterval(intervalId);
                onEnd();
            }
            setTimeLeft(newTimeLeft);
        }, 1000);
        return () => clearInterval(intervalId);
    }, [expiryTimestamp, onEnd]);

    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24).toString().padStart(2, '0');
    const minutes = Math.floor((timeLeft / 1000 / 60) % 60).toString().padStart(2, '0');
    const seconds = Math.floor((timeLeft / 1000) % 60).toString().padStart(2, '0');

    return (
        <div className="text-center p-4 bg-slate-900/50 rounded-lg">
            <p className="text-sm text-slate-400 mb-2">{label}</p>
            <p className="text-2xl font-mono text-cyan-300">{`${hours}:${minutes}:${seconds}`}</p>
        </div>
    );
};

const KeepInTouch = () => {
    const { t } = useTranslation();
    const [messages, setMessages] = useLocalStorage(LOCAL_STORAGE_KEYS.KEEP_IN_TOUCH_MESSAGES, []);
    const [lastSent, setLastSent] = useLocalStorage(LOCAL_STORAGE_KEYS.KEEP_IN_TOUCH_LAST_SENT, null);
    const [inputValue, setInputValue] = useState('');
    const [isReplying, setIsReplying] = useState(false);
    const messagesEndRef = useRef(null);

    const isCooldownActive = useMemo(() => {
        if (!lastSent) return false;
        return Date.now() < lastSent + COOLDOWN_MILLISECONDS;
    }, [lastSent]);
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);
    
    useEffect(() => {
        if (Notification.permission === 'default') {
             setTimeout(() => Notification.requestPermission(), 5000);
        }
    },[]);

    const handleSend = () => {
        if (!inputValue.trim() || isCooldownActive) return;
        const newMessage = { text: inputValue, sender: 'user', timestamp: new Date().toISOString() };
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        setLastSent(Date.now());
        setInputValue('');
        setIsReplying(true);

        setTimeout(() => {
            setMessages(prev => [...prev, { text: t('keepInTouch.response'), sender: 'system', timestamp: new Date().toISOString() }]);
            setIsReplying(false);
            if (Notification.permission === 'granted') {
                new Notification('HumanMade', { body: 'A new message has arrived.' });
            }
        }, 10000);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-y-auto custom-scrollbar pr-2">
                {messages.map((msg, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[80%] p-3 rounded-lg ${msg.sender === 'user' ? 'bg-cyan-800/50 text-slate-200' : 'bg-slate-700/50 text-slate-300'}`}>
                            <p>{msg.text}</p>
                        </div>
                    </motion.div>
                ))}
                {isReplying && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start mb-4"
                    >
                        <div className="p-3 rounded-lg bg-slate-700/50">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="mt-4">
                {isCooldownActive ? (
                    <CooldownTimer expiryTimestamp={lastSent + COOLDOWN_MILLISECONDS} onEnd={() => setLastSent(null)} label={t('keepInTouch.cooldown')} />
                ) : (
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={t('keepInTouch.placeholder')}
                            className="flex-grow bg-slate-900/50 border border-slate-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-shadow"
                        />
                        <button onClick={handleSend} className="px-4 py-2 bg-cyan-400 text-slate-900 font-bold rounded-md hover:bg-cyan-300 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed" disabled={!inputValue.trim()}>
                            {t('keepInTouch.send')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const BeHuman = () => {
    const { t } = useTranslation();
    const [grid, setGrid] = useState(() => Array(5).fill(null).map(() => Array(5).fill(false)));
    const [isSolved, setIsSolved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [interactions, setInteractions] = useState(0);
    const [startTime, setStartTime] = useState(Date.now());
    const [timeTaken, setTimeTaken] = useState(0);
    const [simulatedClick, setSimulatedClick] = useState(null);
    const [lastSolved, setLastSolved] = useLocalStorage(LOCAL_STORAGE_KEYS.SYNC_CONN_LAST_SOLVED, null);

    const isCooldownActive = useMemo(() => {
        if (!lastSolved) return false;
        return Date.now() < lastSolved + COOLDOWN_MILLISECONDS;
    }, [lastSolved]);

    const resetGame = useCallback(() => {
        const newGrid = Array(5).fill(null).map(() => Array(5).fill(false));
        // Apply a random number of clicks to ensure it's solvable
        for (let i = 0; i < 15; i++) {
            const r = Math.floor(Math.random() * 5);
            const c = Math.floor(Math.random() * 5);
            toggleCell(r, c, newGrid, false);
        }
        setGrid(newGrid);
        setIsSolved(false);
        setInteractions(0);
        setStartTime(Date.now());
        setTimeTaken(0);
    }, []);

    useEffect(() => {
        if (!isCooldownActive) {
            resetGame();
        }
    }, [isCooldownActive, resetGame]);
    
    useEffect(() => {
        if (isSolved || isCooldownActive || isLoading) return;

        const interval = setInterval(() => {
            const r = Math.floor(Math.random() * 5);
            const c = Math.floor(Math.random() * 5);
            setGrid(prevGrid => {
                const newGrid = prevGrid.map(row => [...row]);
                toggleCell(r, c, newGrid, false);
                return newGrid;
            });
            setSimulatedClick({r, c});
            setTimeout(() => setSimulatedClick(null), 500);
        }, Math.random() * 2000 + 2000); // 2-4 seconds

        return () => clearInterval(interval);
    }, [isSolved, isCooldownActive, isLoading]);


    const toggleCell = (r, c, currentGrid, userInteraction = true) => {
        if (userInteraction) setInteractions(i => i + 1);
        const newGrid = currentGrid;
        const positions = [[r, c], [r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]];
        positions.forEach(([nr, nc]) => {
            if (nr >= 0 && nr < 5 && nc >= 0 && nc < 5) {
                newGrid[nr][nc] = !newGrid[nr][nc];
            }
        });
        
        const solved = newGrid.every(row => row.every(cell => cell));
        if (solved) {
            setIsSolved(true);
            setLastSolved(Date.now());
            setTimeTaken(Date.now() - startTime);
        }
        return newGrid;
    };
    
    const handleClick = (r, c) => {
        if (isSolved || isLoading) return;
        setGrid(prevGrid => {
            const newGrid = prevGrid.map(row => [...row]);
            return toggleCell(r, c, newGrid);
        });
    };

    const solvePuzzle = async () => {
        setIsLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const gridString = grid.map(row => row.map(cell => (cell ? 'X' : 'O')).join(' ')).join('\n');
            const prompt = `You are a logic puzzle solver. The puzzle is a 5x5 'Lights Out' game. I will provide the current state of the grid, where 'X' is a light that is ON and 'O' is a light that is OFF. Your task is to provide the sequence of button presses to turn all lights ON. A button press toggles its own state and the state of its adjacent (up, down, left, right) neighbors. Your response must be a JSON array of objects, where each object represents a move and has 'row' and 'col' properties (0-indexed). The goal is to make all lights OFF ('O'). Here is the grid state:\n\n${gridString}`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                row: { type: Type.INTEGER },
                                col: { type: Type.INTEGER },
                            },
                        },
                    },
                },
            });
            
            const moves = JSON.parse(response.text);

            let currentGrid = grid.map(row => [...row]);
            for (let i = 0; i < moves.length; i++) {
                const move = moves[i];
                await new Promise(resolve => setTimeout(resolve, 150));
                setGrid(prev => {
                    const newGrid = prev.map(r => [...r]);
                    return toggleCell(move.row, move.col, newGrid, false);
                });
            }

        } catch (error) {
            console.error("Failed to solve puzzle:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    if (isCooldownActive) {
        return <div className="flex items-center justify-center h-full"><CooldownTimer expiryTimestamp={lastSolved + COOLDOWN_MILLISECONDS} onEnd={() => setLastSolved(null)} label={t('beHuman.cooldown')} /></div>;
    }

    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            {isSolved ? (
                <div className="text-center space-y-4">
                    <h3 className="text-2xl font-bold text-cyan-300 glow">{t('beHuman.puzzleSolved')}</h3>
                    <div className="text-lg">
                        <p>{t('beHuman.timeTaken')} <span className="font-mono text-cyan-400">{(timeTaken / 1000).toFixed(2)}s</span></p>
                        <p>{t('beHuman.interactions')} <span className="font-mono text-cyan-400">{interactions}</span></p>
                    </div>
                    <button onClick={resetGame} className="px-6 py-2 bg-cyan-400/20 border border-cyan-300 text-cyan-300 rounded-md hover:bg-cyan-300 hover:text-slate-900 transition-all">Play Again</button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-5 gap-1 p-2 bg-slate-900/50 rounded-lg">
                        {grid.map((row, r) => row.map((cell, c) => (
                            <button
                                key={`${r}-${c}`}
                                onClick={() => handleClick(r, c)}
                                className={`w-16 h-16 rounded-md transition-all duration-300 relative
                                    ${cell ? 'bg-cyan-300 shadow-lg shadow-cyan-400/50' : 'bg-slate-700 hover:bg-slate-600'}
                                    ${isLoading ? 'cursor-wait' : ''}
                                `}
                            >
                                {simulatedClick && simulatedClick.r === r && simulatedClick.c === c && (
                                    <motion.div 
                                        initial={{ scale: 1, opacity: 1}} 
                                        animate={{ scale: 1.5, opacity: 0}} 
                                        transition={{ duration: 0.5}}
                                        className="absolute inset-0 border-2 border-yellow-300 rounded-md"
                                    />
                                )}
                            </button>
                        )))}
                    </div>
                    <button onClick={solvePuzzle} disabled={isLoading} className="w-64 px-6 py-3 bg-cyan-400/20 border border-cyan-300 text-cyan-300 rounded-md hover:bg-cyan-300 hover:text-slate-900 transition-all duration-300 disabled:cursor-not-allowed disabled:bg-slate-700/50 disabled:border-slate-600 disabled:text-slate-500 flex items-center justify-center gap-2">
                        {isLoading ? <><Spinner /> {t('beHuman.forceSyncing')}</> : t('beHuman.forceSync')}
                    </button>
                </>
            )}
        </div>
    );
};

// --- DESKTOP HUB ---
const DesktopHub = () => {
    const { t } = useTranslation();
    const [openApp, setOpenApp] = useState(null);
    const [surveyState, setSurveyState] = useLocalStorage(LOCAL_STORAGE_KEYS.SURVEY_STATE, 'initial');
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (surveyState === 'initial') {
            const timer = setTimeout(() => setShowToast(true), 4000);
            return () => clearTimeout(timer);
        }
    }, [surveyState]);

    const handleStartSurvey = () => {
        setSurveyState('started');
        setShowToast(false);
        setOpenApp('survey');
    };

    const handleDismissSurvey = () => {
        setSurveyState('dismissed');
        setShowToast(false);
    };
    
    const APP_CONFIG = {
        keepInTouch: { title: t('desktop.keepInTouch'), component: <KeepInTouch /> },
        synchronize: { title: t('desktop.synchronizeConnection'), component: <BeHuman /> },
        survey: { title: t('survey.start'), component: <SurveyContent /> },
    };
    
    const CurrentApp = openApp ? APP_CONFIG[openApp] : null;

    return (
        <div className="relative w-screen h-screen flex flex-col items-center justify-center">
            <div className="absolute inset-0 bg-slate-900" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.05), #0f172a 50%)' }}></div>
            
            <div className="absolute top-1/2 left-8 -translate-y-1/2 flex flex-col gap-8">
                <DesktopIcon icon={<SyncIcon />} label={t('desktop.synchronizeConnection')} onClick={() => setOpenApp('synchronize')} />
                <DesktopIcon icon={<MessageIcon />} label={t('desktop.keepInTouch')} onClick={() => setOpenApp('keepInTouch')} />
            </div>

            <AnimatePresence>
                {CurrentApp && (
                    <Window title={CurrentApp.title} onClose={() => setOpenApp(null)} appKey={openApp}>
                       {CurrentApp.component}
                    </Window>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showToast && surveyState === 'initial' && (
                    <SurveyToast onStart={handleStartSurvey} onDismiss={handleDismissSurvey} />
                )}
            </AnimatePresence>

            {surveyState === 'dismissed' && <SurveyWidget onStart={handleStartSurvey} />}
        </div>
    );
};


// --- MAIN APP ---
const App = () => {
    const [isCertified, setIsCertified] = useLocalStorage(LOCAL_STORAGE_KEYS.CERTIFIED, false);

    return (
        <LanguageProvider>
            <AnimatePresence mode="wait">
                {isCertified ? (
                    <motion.div key="hub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <DesktopHub />
                    </motion.div>
                ) : (
                    <motion.div key="cert" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Certification onCertify={() => setIsCertified(true)} />
                    </motion.div>
                )}
            </AnimatePresence>
        </LanguageProvider>
    );
};

export default App;
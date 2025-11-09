
import React, { useState, useEffect, FormEvent, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SendIcon } from './icons/SendIcon';

const MESSAGE_TIMESTAMP_KEY = 'humanmade_last_message_timestamp';
const MESSAGES_KEY = 'humanmade_messages';
const COOLDOWN_HOURS = 24;

interface Message {
    id: string;
    text: string;
    sentAt: number;
    reply?: {
        text: string;
        receivedAt: number;
    };
}

const KeepInTouch: React.FC = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [lastMessageTimestamp, setLastMessageTimestamp] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [isSentOrOnCooldown, setIsSentOrOnCooldown] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // Load initial data from localStorage
    useEffect(() => {
        // Cooldown check
        const storedTimestamp = localStorage.getItem(MESSAGE_TIMESTAMP_KEY);
        if (storedTimestamp) {
            const timestamp = parseInt(storedTimestamp, 10);
            const now = new Date().getTime();
            const cooldownEndTime = timestamp + COOLDOWN_HOURS * 60 * 60 * 1000;
            
            if (now < cooldownEndTime) {
                setLastMessageTimestamp(timestamp);
                setIsSentOrOnCooldown(true);
            } else {
                localStorage.removeItem(MESSAGE_TIMESTAMP_KEY);
            }
        }

        // Message history
        const storedMessages = localStorage.getItem(MESSAGES_KEY);
        if (storedMessages) {
            setMessages(JSON.parse(storedMessages));
        }
    }, []);

    // Cooldown timer logic
    useEffect(() => {
        if (!lastMessageTimestamp) {
            setTimeLeft('');
            return;
        }

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const cooldownEndTime = lastMessageTimestamp + COOLDOWN_HOURS * 60 * 60 * 1000;
            const distance = cooldownEndTime - now;

            if (distance < 0) {
                setTimeLeft('');
                setLastMessageTimestamp(null);
                localStorage.removeItem(MESSAGE_TIMESTAMP_KEY);
                setIsSentOrOnCooldown(false);
                clearInterval(interval);
                return;
            }

            const hours = Math.floor(distance / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }, 1000);

        return () => clearInterval(interval);
    }, [lastMessageTimestamp]);

    // Simulate replies
    useEffect(() => {
        const simulateReplies = () => {
            setMessages(currentMessages => {
                let messagesChanged = false;
                let newReplyText: string | null = null;

                const updatedMessages = currentMessages.map(msg => {
                    if (!msg.reply && (new Date().getTime() - msg.sentAt > 10000)) { // Reply after 10 seconds
                        messagesChanged = true;
                         const cannedReplies = [
                            "Thank you for your message. I've read it and I really appreciate you taking the time to write.",
                            "I received your message. It's great to hear from you, thank you for sharing this with me.",
                            "Got your message. Thank you for taking the time to connect. I'll keep your words in mind."
                        ];
                        const replyText = cannedReplies[Math.floor(Math.random() * cannedReplies.length)];
                        newReplyText = replyText;
                        return {
                            ...msg,
                            reply: {
                                text: replyText,
                                receivedAt: new Date().getTime() + (Math.random() * 2000 + 1000)
                            }
                        };
                    }
                    return msg;
                });
                
                if (messagesChanged) {
                    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updatedMessages));
                    if (newReplyText && typeof Notification !== 'undefined' && Notification.permission === 'granted' && document.hidden) {
                        new Notification('You have a reply from HumanMade', {
                            body: `"${newReplyText}"`,
                            icon: '/vite.svg',
                        });
                    }
                    return updatedMessages;
                }
                return currentMessages;
            });
        };
        const interval = setInterval(simulateReplies, 5000); // Check every 5 seconds
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isSentOrOnCooldown]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!message.trim() || isSentOrOnCooldown) return;

        const now = new Date().getTime();
        const newMessage: Message = { id: now.toString(), text: message, sentAt: now };
        
        setMessages(prev => {
            const updated = [...prev, newMessage];
            localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
            return updated;
        });
        
        localStorage.setItem(MESSAGE_TIMESTAMP_KEY, now.toString());
        setLastMessageTimestamp(now);
        setIsSentOrOnCooldown(true);
        setMessage('');

        if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    };
    
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col w-full h-full bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden backdrop-blur-sm shadow-2xl"
        >
            <div className="p-4 border-b border-slate-700/50 flex items-center justify-between flex-shrink-0">
                <h2 className="text-xl font-bold text-slate-100">Keep in Touch</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-2">
                <AnimatePresence>
                    {messages.length === 0 && !isSentOrOnCooldown && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center text-slate-400 pt-10"
                        >
                            <p className="italic text-slate-300 mb-6 text-base/loose">The purpose of this space is to re-establish slow, human connection.</p>
                            <p>You can send one message every 24 hours.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div 
                            key={msg.id}
                            layout
                            initial={{ opacity: 0, y: 20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="space-y-4"
                        >
                            <div className="flex items-start gap-3 justify-end">
                                <div className="max-w-xs rounded-xl px-4 py-3 bg-cyan-500/80 text-slate-900">
                                    <p className="whitespace-pre-wrap">{msg.text}</p>
                                    <p className="text-xs text-slate-800/70 text-right mt-1">{new Date(msg.sentAt).toLocaleString()}</p>
                                </div>
                            </div>
                            {msg.reply && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
                                    className="flex items-start gap-3 justify-start"
                                >
                                     <div className="w-8 h-8 rounded-full bg-slate-700 flex-shrink-0 flex items-center justify-center font-bold text-cyan-300 text-sm">
                                        HM
                                    </div>
                                    <div className="max-w-xs rounded-xl px-4 py-3 bg-slate-700 text-slate-200">
                                       <p className="whitespace-pre-wrap">{msg.reply.text}</p>
                                       <p className="text-xs text-slate-400/70 text-right mt-1">{new Date(msg.reply.receivedAt).toLocaleString()}</p>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-slate-700/50 flex-shrink-0">
                { !isSentOrOnCooldown ? (
                    <form onSubmit={handleSubmit} className="flex items-center gap-3">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write your message here..."
                            className="flex-1 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-shadow"
                            aria-label="Your message"
                        />
                        <button 
                            type="submit" 
                            disabled={!message.trim()} 
                            className="p-2.5 bg-cyan-500 rounded-lg text-slate-900 font-bold disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-cyan-400 transition-colors"
                        >
                            <SendIcon className="w-5 h-5" />
                        </button>
                    </form>
                ) : (
                    <div className="text-center">
                        <h3 className="font-semibold text-cyan-300 mb-2">Thank you for your message!</h3>
                        <p className="text-slate-400 text-sm mb-4">I'll reply soon. Enable notifications to stay in touch.</p>
                        <div className="bg-slate-900/50 border border-slate-700 rounded-lg px-6 py-2 inline-block" aria-live="polite">
                            <p className="text-slate-400 text-xs mb-1">Next message available in:</p>
                            <p className="text-2xl font-mono font-bold text-slate-100 tracking-wider">{timeLeft || 'Loading...'}</p>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default KeepInTouch;

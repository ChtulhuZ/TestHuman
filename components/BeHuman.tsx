

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SyncIcon } from './icons/SyncIcon';
import { useTranslation } from '../hooks/useTranslation';
import { solvePuzzle } from '../services/geminiService';

const GRID_SIZE = 5;
const PATTERN: number[][] = [[0, 0], [0, 1], [0, -1], [1, 0], [-1, 0]]; // Cross pattern
const COOLDOWN_KEY = 'humanmade_sync_cooldown_timestamp';
const COMPLETION_TIME_KEY = 'humanmade_sync_completion_time';
const PARTICIPANT_COUNT_KEY = 'humanmade_sync_participant_count';
const COOLDOWN_HOURS = 24;

const toggleConnections = (grid: boolean[][], row: number, col: number): boolean[][] => {
    const newGrid = grid.map(r => [...r]);
    PATTERN.forEach(([dr, dc]) => {
        const r = row + dr;
        const c = col + dc;
        if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
            newGrid[r][c] = !newGrid[r][c];
        }
    });
    return newGrid;
};

const createPuzzle = (): boolean[][] => {
    let grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(true));
    const scrambleMoves = Math.floor(Math.random() * 5) + 5; // 5 to 9 random moves
    for (let i = 0; i < scrambleMoves; i++) {
        const r = Math.floor(Math.random() * GRID_SIZE);
        const c = Math.floor(Math.random() * GRID_SIZE);
        grid = toggleConnections(grid, r, c);
    }
    // If it's accidentally solved, scramble again
    if (isSolved(grid)) {
        return createPuzzle();
    }
    return grid;
};

const isSolved = (grid: boolean[][]): boolean => {
    return grid.every(row => row.every(cell => cell === true));
};

const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
};

const BeHuman: React.FC = () => {
    const [grid, setGrid] = useState<boolean[][] | null>(null);
    const [solved, setSolved] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [simulatedClick, setSimulatedClick] = useState<{ r: number, c: number, id: number } | null>(null);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [interactionCount, setInteractionCount] = useState(0);
    const [cooldownTimestamp, setCooldownTimestamp] = useState<number | null>(null);
    const [timeLeft, setTimeLeft] = useState('');
    const [completionStats, setCompletionStats] = useState<{ time: number; count: number } | null>(null);
    const { t } = useTranslation();

    const resetGame = useCallback(() => {
        setGrid(createPuzzle());
        setSolved(false);
        setIsLoading(false);
        setStartTime(Date.now());
        setElapsedTime(0);
        setInteractionCount(0);
        setCooldownTimestamp(null);
        setCompletionStats(null);
        localStorage.removeItem(COOLDOWN_KEY);
        localStorage.removeItem(COMPLETION_TIME_KEY);
        localStorage.removeItem(PARTICIPANT_COUNT_KEY);
    }, []);

    const startCooldown = useCallback(() => {
        const now = Date.now();
        const finalTime = elapsedTime;
        const finalCount = interactionCount;

        localStorage.setItem(COOLDOWN_KEY, now.toString());
        localStorage.setItem(COMPLETION_TIME_KEY, finalTime.toString());
        localStorage.setItem(PARTICIPANT_COUNT_KEY, finalCount.toString());
        
        setCooldownTimestamp(now);
        setCompletionStats({ time: finalTime, count: finalCount });
        setSolved(true);
    }, [elapsedTime, interactionCount]);

    // Load initial state and check for cooldown
    useEffect(() => {
        const storedTimestamp = localStorage.getItem(COOLDOWN_KEY);
        if (storedTimestamp) {
            const timestamp = parseInt(storedTimestamp, 10);
            const now = Date.now();
            const cooldownEndTime = timestamp + COOLDOWN_HOURS * 60 * 60 * 1000;

            if (now < cooldownEndTime) {
                setCooldownTimestamp(timestamp);
                setGrid(Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(true))); // Show solved grid
                setSolved(true);
                const storedTime = localStorage.getItem(COMPLETION_TIME_KEY);
                const storedCount = localStorage.getItem(PARTICIPANT_COUNT_KEY);
                if (storedTime && storedCount) {
                    setCompletionStats({
                        time: parseInt(storedTime, 10),
                        count: parseInt(storedCount, 10)
                    });
                }
            } else {
                resetGame();
            }
        } else {
            setGrid(createPuzzle());
            setStartTime(Date.now());
        }
    }, [resetGame]);

    // Cooldown timer logic
    useEffect(() => {
        if (!cooldownTimestamp) {
            setTimeLeft('');
            return;
        }

        const interval = setInterval(() => {
            const now = Date.now();
            const cooldownEndTime = cooldownTimestamp + COOLDOWN_HOURS * 60 * 60 * 1000;
            const distance = cooldownEndTime - now;

            if (distance < 0) {
                setTimeLeft('');
                clearInterval(interval);
                resetGame();
                return;
            }

            const hours = Math.floor(distance / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }, 1000);

        return () => clearInterval(interval);
    }, [cooldownTimestamp, resetGame]);

    // Simulate other players
    useEffect(() => {
        if (solved || isLoading || cooldownTimestamp) return;

        const simulateInteraction = () => {
            setInteractionCount(prev => prev + 1);
            setGrid(prevGrid => {
                if (!prevGrid) return prevGrid;
                const r = Math.floor(Math.random() * GRID_SIZE);
                const c = Math.floor(Math.random() * GRID_SIZE);
                setSimulatedClick({ r, c, id: Date.now() });
                setTimeout(() => setSimulatedClick(null), 400);
                return toggleConnections(prevGrid, r, c);
            });
        };

        const intervalId = setInterval(simulateInteraction, Math.random() * 2000 + 2000); // 2-4 seconds

        return () => clearInterval(intervalId);
    }, [solved, isLoading, cooldownTimestamp]);
    
    // Game timer
    useEffect(() => {
        if (solved || !startTime || cooldownTimestamp) return;
        const timerId = setInterval(() => {
            setElapsedTime(Date.now() - startTime);
        }, 100);
        return () => clearInterval(timerId);
    }, [solved, startTime, cooldownTimestamp]);

    // Check for solved state
    useEffect(() => {
        if (grid && !solved && isSolved(grid)) {
            startCooldown();
        }
    }, [grid, solved, startCooldown]);

    const handleCellClick = (row: number, col: number) => {
        if (solved || isLoading || !grid || cooldownTimestamp) return;
        setGrid(toggleConnections(grid, row, col));
        setInteractionCount(prev => prev + 1);
    };

    const handleForceSync = async () => {
        if (!grid || isLoading || solved || cooldownTimestamp) return;
        setIsLoading(true);
        setInteractionCount(prev => prev + 1);
        
        try {
            const solution = await solvePuzzle(grid);
            let currentGrid = grid;
            for (const move of solution) {
                await new Promise(resolve => setTimeout(resolve, 100)); // Animate the clicks
                currentGrid = toggleConnections(currentGrid, move.row, move.col);
                setGrid(currentGrid);
            }
        } catch (error) {
            console.error("Failed to solve puzzle:", error);
             // Fallback to simple solve if API fails
            const solvedGrid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(true));
            setGrid(solvedGrid);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
        >
            <div className="p-4 md:p-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-100">{t('beHuman.title')}</h1>
                        <p className="text-slate-400 mt-1">{t('beHuman.subtitle')}</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                    <div className={`aspect-square p-2 bg-slate-900/50 border border-slate-700 rounded-lg ${cooldownTimestamp ? 'opacity-50' : ''}`}>
                        <div className={`grid grid-cols-5 gap-1.5 md:gap-2`}>
                            {grid?.map((rowArr, r) =>
                                rowArr.map((cell, c) => (
                                    <div key={`${r}-${c}`} className="relative">
                                         <motion.button
                                            onClick={() => handleCellClick(r, c)}
                                            className={`w-12 h-12 md:w-16 md:h-16 rounded-md transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 focus-visible:ring-cyan-400 relative z-10`}
                                            style={{
                                                backgroundColor: cell ? '#22d3ee' : '#1e293b',
                                                boxShadow: cell ? '0 0 15px #22d3ee, inset 0 0 5px rgba(255, 255, 255, 0.5)' : 'inset 0 2px 4px rgba(0,0,0,0.5)',
                                            }}
                                            whileTap={{ scale: solved || isLoading ? 1 : 0.9 }}
                                            disabled={solved || isLoading || !!cooldownTimestamp}
                                            aria-label={`Grid cell row ${r+1}, column ${c+1}. State: ${cell ? 'On' : 'Off'}`}
                                        />
                                        <AnimatePresence>
                                        {simulatedClick?.r === r && simulatedClick?.c === c && (
                                            <motion.div
                                                key={simulatedClick.id}
                                                className="absolute inset-0 rounded-md border-2 border-yellow-300 pointer-events-none"
                                                initial={{ opacity: 1, scale: 0.8 }}
                                                animate={{ opacity: 0, scale: 1.2 }}
                                                transition={{ duration: 0.4, ease: "easeOut" }}
                                            />
                                        )}
                                        </AnimatePresence>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="w-full md:w-72 text-center flex flex-col items-center justify-center gap-6">
                       <AnimatePresence mode="wait">
                       {cooldownTimestamp ? (
                           <motion.div
                                key="cooldown"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                           >
                                <h3 className="font-semibold text-2xl text-cyan-300 mb-2">{t('beHuman.solved.title')}</h3>
                                <p className="text-slate-300 mb-4">{t('beHuman.solved.description')}</p>
                                
                                {completionStats && (
                                    <div className="text-center text-slate-400 text-sm mb-4 space-y-1 bg-slate-900/30 p-3 rounded-lg border border-slate-700">
                                        <p>
                                            {t('beHuman.solved.completionTime').replace('{time}', formatTime(completionStats.time))}
                                        </p>
                                        <p>
                                            {t('beHuman.solved.participants').replace('{count}', completionStats.count.toString())}
                                        </p>
                                    </div>
                                )}
                                
                                <div className="bg-slate-900/50 border border-slate-700 rounded-lg px-6 py-2 inline-block" aria-live="polite">
                                    <p className="text-slate-400 text-xs mb-1">{t('beHuman.cooldown.nextSync')}</p>
                                    <p className="text-2xl font-mono font-bold text-slate-100 tracking-wider">{timeLeft || t('beHuman.cooldown.loading')}</p>
                                </div>
                           </motion.div>
                       ) : (
                           <motion.div
                                key="playing"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="w-full"
                           >
                               <div className="mb-6">
                                    <p className="text-sm text-slate-400 uppercase tracking-widest">{t('beHuman.timerLabel')}</p>
                                    <p className="text-4xl font-mono font-bold text-slate-100 tracking-wider mt-1">
                                        {formatTime(elapsedTime)}
                                    </p>
                               </div>
                               <button 
                                   onClick={handleForceSync}
                                   disabled={isLoading}
                                   className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                                >
                                   <div className="relative w-5 h-5">
                                       <AnimatePresence>
                                       {isLoading ? (
                                           <motion.div
                                                key="loader"
                                                className="absolute inset-0 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.5 }}
                                           ></motion.div>
                                       ) : (
                                           <motion.div 
                                                key="icon"
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.5 }}
                                           >
                                                <SyncIcon className="w-5 h-5 transform transition-transform group-hover:rotate-90" />
                                           </motion.div>
                                       )}
                                       </AnimatePresence>
                                   </div>
                                   <span>
                                       {isLoading ? t('beHuman.forceSyncLoading') : t('beHuman.forceSync')}
                                   </span>
                               </button>
                           </motion.div>
                       )}
                       </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default BeHuman;
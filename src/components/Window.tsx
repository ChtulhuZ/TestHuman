import React, { useState, useEffect, useRef } from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface WindowProps {
    children: React.ReactNode;
    title: string;
    onClose: () => void;
    initialPosition?: { top?: number; right?: number; bottom?: number; left?: number };
    initialSize?: { width?: number | string; height?: number | string };
    isCentered?: boolean;
}

const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

    useEffect(() => {
        const media = window.matchMedia(query);
        const listener = () => setMatches(media.matches);
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [query]);

    return matches;
};

const Window: React.FC<WindowProps> = ({ children, title, onClose, initialPosition, initialSize, isCentered = false }) => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const windowRef = useRef<HTMLDivElement>(null);

    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    // Drag and Drop State
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        setIsVisible(true); // Trigger enter animation
        if (isCentered && windowRef.current) {
            const { offsetWidth, offsetHeight } = windowRef.current;
            setPosition({
                x: window.innerWidth / 2 - offsetWidth / 2,
                y: window.innerHeight / 2 - offsetHeight / 2,
            });
        }
    }, [isCentered]);
    
    const handleClose = () => {
        setIsExiting(true);
        setTimeout(onClose, 200); // Match animation duration
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).closest('button')) return; // Don't drag on buttons
        setIsDragging(true);
        const rect = windowRef.current!.getBoundingClientRect();
        setOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };
    
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                setPosition({
                    x: e.clientX - offset.x,
                    y: e.clientY - offset.y,
                });
            }
        };
        const handleMouseUp = () => setIsDragging(false);

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, offset]);


    if (isMobile) {
        const animationClass = isExiting ? 'anim-slide-out' : 'anim-slide-in';
        return (
            <div
                className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 flex items-end justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleClose}
            >
                <div
                    className={`w-full h-[90vh] bg-slate-800 border-t border-slate-700 rounded-t-2xl shadow-2xl z-50 flex flex-col ${isExiting ? 'translate-y-full' : 'translate-y-0'} transition-transform duration-300 ease-in-out`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="h-14 flex-shrink-0 flex items-center justify-between px-4 rounded-t-2xl border-b border-slate-700">
                        <span className="font-bold text-slate-200 text-lg">{title}</span>
                        <button 
                            onClick={handleClose} 
                            className="p-2 -mr-2 rounded-full text-slate-400 hover:bg-slate-700/50 hover:text-slate-100 transition-colors"
                            aria-label="Close window"
                        >
                            <CloseIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                        {children}
                    </div>
                </div>
            </div>
        )
    }

    const positionStyle = isCentered 
        ? { transform: `translate(${position.x}px, ${position.y}px)`}
        : { ...initialPosition };
        
    const sizeStyle = { ...initialSize };

    return (
        <div
            ref={windowRef}
            className={`fixed bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-lg shadow-2xl z-30 flex flex-col ${isExiting ? 'anim-scale-out' : 'anim-scale-in'}`}
            style={{
                ...positionStyle,
                ...sizeStyle,
                pointerEvents: 'auto',
                opacity: isVisible ? 1 : 0, // Initial state for animation
            }}
        >
            <div 
                className="drag-handle h-10 flex-shrink-0 flex items-center justify-between px-4 bg-slate-900/50 rounded-t-lg border-b border-slate-700 cursor-move"
                onMouseDown={isCentered ? handleMouseDown : undefined}
            >
                <span className="font-bold text-slate-200">{title}</span>
                <button 
                    onClick={handleClose} 
                    className="p-1 rounded-full text-slate-400 hover:bg-slate-700/50 hover:text-slate-100 transition-colors"
                    aria-label="Close window"
                >
                    <CloseIcon className="w-5 h-5" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {children}
            </div>
        </div>
    );
};

export default Window;

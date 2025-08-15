import React, { useEffect } from 'react';

interface FailureAnimationProps {
    onClose: () => void;
}

const FailureAnimation: React.FC<FailureAnimationProps> = ({ onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 2500); // Matches the animation duration

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 z-[80]">
             <div className="flex items-center justify-center gap-4 px-6 py-4 bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-lg shadow-2xl border-2 border-white/50 animate-slide-in-out-top animate-subtle-shake">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                <h2 className="text-xl font-bold tracking-wider">Busted!</h2>
            </div>
        </div>
    );
};

export default FailureAnimation;

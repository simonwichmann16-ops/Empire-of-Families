import React, { useEffect } from 'react';

interface SuccessAnimationProps {
    onClose: () => void;
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 2500); // Matches the animation duration

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 z-[80]">
            <div className="flex items-center justify-center gap-4 px-6 py-4 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-lg shadow-2xl border-2 border-white/50 animate-slide-in-out-top">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                <h2 className="text-xl font-bold tracking-wider">Jobs Done</h2>
            </div>
        </div>
    );
};

export default SuccessAnimation;

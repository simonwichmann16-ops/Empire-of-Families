

import React, { useState, useEffect } from 'react';
import { MockUser } from '../types';
import { HandcuffsIcon } from './Icon';

const CountdownTimer: React.FC<{ endTime: number | null }> = ({ endTime }) => {
    const [timeLeft, setTimeLeft] = useState(endTime ? Math.max(0, endTime - Date.now()) : 0);

    useEffect(() => {
        if (!endTime || endTime < Date.now()) {
            setTimeLeft(0);
            return;
        }

        const intervalId = setInterval(() => {
            const newTimeLeft = Math.max(0, endTime - Date.now());
            setTimeLeft(newTimeLeft);
            if (newTimeLeft <= 0) {
                clearInterval(intervalId);
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [endTime]);

    if (timeLeft <= 0) return <span>Released</span>;

    const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    return <span>{`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</span>;
};


interface PrisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: MockUser[];
  playerLocation: string;
  onBreakOut: (user: MockUser) => void;
  disabled: boolean;
}

const PrisonModal: React.FC<PrisonModalProps> = ({ isOpen, onClose, users, playerLocation, onBreakOut, disabled }) => {
  if (!isOpen) return null;

  const jailedUsers = users.filter(u => u.jailedUntil && u.jailedUntil > Date.now() && u.locationId === playerLocation);

  return (
    <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
        role="dialog" aria-modal="true" aria-labelledby="prison-modal-title"
    >
      <div 
        className="bg-slate-100/95 backdrop-blur-md border border-slate-300 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-2xl m-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-slate-300 pb-4 mb-4">
          <h2 id="prison-modal-title" className="text-2xl font-bold text-slate-800">The State Penitentiary</h2>
          <button 
            onClick={onClose} 
            className="text-slate-700 text-3xl leading-none hover:text-slate-900 transition-colors"
            aria-label="Close prison modal"
          >&times;</button>
        </div>

        <div className="overflow-y-auto space-y-3 pr-2 -mr-4 flex-grow">
          {jailedUsers.length > 0 ? (
            <ul className="space-y-3">
              {jailedUsers.map(user => (
                <li key={user.id} className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-slate-50/70 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-200 rounded-full text-slate-600">
                      <HandcuffsIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{user.name}</h4>
                      <p className="text-xs text-slate-700">
                        Release in: <span className="font-mono font-bold"><CountdownTimer endTime={user.jailedUntil} /></span>
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onBreakOut(user)}
                    disabled={disabled}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-semibold rounded-md transition-colors text-center bg-amber-600 text-white hover:bg-amber-700 disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed"
                  >
                    Attempt Breakout (20 Stamina)
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center p-8 text-slate-600">
              <p className="text-lg">The cells are empty.</p>
              <p className="text-sm">Seems like everyone is behaving... for now.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrisonModal;
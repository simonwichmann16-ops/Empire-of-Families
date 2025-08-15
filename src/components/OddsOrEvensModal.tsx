import React, { useState } from 'react';
import { Player } from '../types';

interface OddsOrEvensModalProps {
  player: Player;
  onBet: (bet: number, isWin: boolean, roll1: number, roll2: number) => void;
  onClose: () => void;
  disabled: boolean;
}

const Die: React.FC<{ value: number; isRolling: boolean }> = ({ value, isRolling }) => {
    const pips = [];
    // Define positions for pips 1-6
    const positions: { [key: number]: string[] } = {
        1: ['center'],
        2: ['top-left', 'bottom-right'],
        3: ['top-left', 'center', 'bottom-right'],
        4: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
        5: ['top-left', 'top-right', 'center', 'bottom-left', 'bottom-right'],
        6: ['top-left', 'top-right', 'middle-left', 'middle-right', 'bottom-left', 'bottom-right'],
    };

    const pipPositions = positions[value] || [];

    for (let i = 0; i < pipPositions.length; i++) {
        pips.push(
            <div key={i} className={`absolute w-3 h-3 bg-orange-900 rounded-full ${
                {
                    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                    'top-left': 'top-2 left-2',
                    'top-right': 'top-2 right-2',
                    'bottom-left': 'bottom-2 left-2',
                    'bottom-right': 'bottom-2 right-2',
                    'middle-left': 'left-2 top-1/2 -translate-y-1/2',
                    'middle-right': 'right-2 top-1/2 -translate-y-1/2',
                }[pipPositions[i]]
            }`}></div>
        );
    }
    return (
        <div className="relative w-16 h-16 bg-orange-50 border-2 border-orange-200 rounded-lg shadow-md flex items-center justify-center">
            {isRolling ? (
                 <div className="text-4xl font-bold text-orange-400">?</div>
            ) : pips}
        </div>
    );
};


const OddsOrEvensModal: React.FC<OddsOrEvensModalProps> = ({ player, onBet, onClose, disabled }) => {
  const [betAmount, setBetAmount] = useState<number | string>(10);
  const [view, setView] = useState<'betting' | 'rolling' | 'result'>('betting');
  const [rolls, setRolls] = useState<{roll1: number, roll2: number, choice: 'odd' | 'even'} | null>(null);

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
        setBetAmount('');
        return;
    }
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
        setBetAmount(Math.min(numValue, player.money));
    }
  };

  const handlePlaceBet = (choice: 'odd' | 'even') => {
    const amount = Number(betAmount);
    if (amount > 0 && amount <= player.money) {
        const roll1 = Math.floor(Math.random() * 6) + 1;
        const roll2 = Math.floor(Math.random() * 6) + 1;
        setRolls({ roll1, roll2, choice });
        setView('rolling');

        setTimeout(() => {
            const total = roll1 + roll2;
            const resultIs = (total % 2 === 0) ? 'even' : 'odd';
            const win = choice === resultIs;
            onBet(amount, win, roll1, roll2);
            setView('result');

            setTimeout(() => {
                onClose();
            }, 2500); // Wait on result screen
        }, 1200); // Rolling duration matches CSS animation
    }
  };
  
  const isWin = rolls ? ((rolls.roll1 + rolls.roll2) % 2 === 0 ? 'even' : 'odd') === rolls.choice : false;

  const renderContent = () => {
      if(view === 'rolling' || view === 'result') {
          return (
             <div className="flex flex-col items-center justify-center gap-6 h-48">
                <div className="flex gap-4">
                    <div className={view === 'rolling' ? 'animate-roll-in-left' : ''}>
                        <Die value={rolls!.roll1} isRolling={view === 'rolling'} />
                    </div>
                     <div className={view === 'rolling' ? 'animate-roll-in-right' : ''}>
                        <Die value={rolls!.roll2} isRolling={view === 'rolling'} />
                    </div>
                </div>
                {view === 'result' && (
                    <div className="text-center animate-fade-in">
                        <p className="text-xl font-bold">Total: {rolls!.roll1 + rolls!.roll2}</p>
                        <p className={`text-2xl font-bold ${isWin ? 'text-green-600' : 'text-red-600'}`}>
                           {isWin ? "You Won!" : "You Lost!"}
                        </p>
                    </div>
                )}
             </div>
          );
      }
      
      return (
          <>
            <p className="text-orange-700 text-center">Bet on the sum of a two-dice roll. Payout is 1:1.</p>
        
            <div className="space-y-3">
                <h3 className="font-bold text-lg text-orange-900 text-center">Your Bet</h3>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400">$</span>
                    <input 
                        type="number"
                        min="1"
                        max={player.money}
                        value={betAmount}
                        onChange={handleBetChange}
                        className="w-full bg-white border border-orange-300 rounded-md p-3 pl-6 text-center font-mono text-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        disabled={disabled}
                    />
                </div>
                 <div className="flex justify-end gap-2">
                     <button 
                        onClick={() => setBetAmount(Math.floor(player.money / 4))}
                        disabled={disabled}
                        className="px-3 py-1 text-xs font-semibold rounded-md transition-colors text-center bg-orange-200 text-orange-800 hover:bg-orange-300 disabled:opacity-50">
                        25%
                    </button>
                     <button 
                        onClick={() => setBetAmount(Math.floor(player.money / 2))}
                        disabled={disabled}
                        className="px-3 py-1 text-xs font-semibold rounded-md transition-colors text-center bg-orange-200 text-orange-800 hover:bg-orange-300 disabled:opacity-50">
                        50%
                    </button>
                    <button 
                        onClick={() => setBetAmount(player.money)}
                        disabled={disabled}
                        className="px-3 py-1 text-xs font-semibold rounded-md transition-colors text-center bg-orange-200 text-orange-800 hover:bg-orange-300 disabled:opacity-50">
                        Max
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => handlePlaceBet('odd')}
                    disabled={disabled || Number(betAmount) <= 0 || Number(betAmount) > player.money}
                    className="py-4 text-lg font-bold rounded-lg transition-colors bg-indigo-500 text-white hover:bg-indigo-600 disabled:bg-orange-100 disabled:text-orange-400"
                >
                    Bet on Odd
                </button>
                <button
                    onClick={() => handlePlaceBet('even')}
                    disabled={disabled || Number(betAmount) <= 0 || Number(betAmount) > player.money}
                    className="py-4 text-lg font-bold rounded-lg transition-colors bg-violet-500 text-white hover:bg-violet-600 disabled:bg-orange-100 disabled:text-orange-400"
                >
                    Bet on Even
                </button>
            </div>
          </>
      )
  }

  return (
    <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ooe-modal-title"
    >
      <div 
        className="bg-orange-50/95 backdrop-blur-md border border-orange-200 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-md m-4 flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-orange-200 pb-4">
          <h2 id="ooe-modal-title" className="text-2xl font-bold text-indigo-600">Odds or Evens</h2>
          <button 
            onClick={onClose} 
            className="text-orange-600 text-3xl leading-none hover:text-orange-900 transition-colors"
            aria-label="Close modal"
          >&times;</button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default OddsOrEvensModal;

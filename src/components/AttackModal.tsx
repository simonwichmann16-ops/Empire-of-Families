import React, { useState, useEffect } from 'react';
import { Player, MockUser, AttackOutcome } from '../types';
import { ThiefIcon } from './Icon';

interface AttackModalProps {
  player: Player;
  targetUser: MockUser | null;
  outcome: AttackOutcome | null;
  onClose: () => void;
}

const AttackModal: React.FC<AttackModalProps> = ({ player, targetUser, outcome, onClose }) => {
  const [animationState, setAnimationState] = useState<'idle' | 'attacking' | 'finished'>('idle');
  
  useEffect(() => {
    // Start the attack animation shortly after the modal opens
    const attackTimer = setTimeout(() => {
      setAnimationState('attacking');
    }, 100);

    // End the animation and show the result
    const resultTimer = setTimeout(() => {
      setAnimationState('finished');
    }, 1600); // Should match the animation duration

    // Auto-close the modal after showing the result
    const closeTimer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => {
      clearTimeout(attackTimer);
      clearTimeout(resultTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  if (!targetUser || !outcome) return null;

  const { playerWon, moneyExchanged, playerHealthLost, targetHealthLost } = outcome;

  return (
    <div
      className="fixed inset-0 bg-black/70 z-[70] flex items-center justify-center backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="attack-modal-title"
    >
      <div
        className="bg-amber-100/95 backdrop-blur-md border border-amber-300 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-2xl m-4 flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="attack-modal-title" className="text-3xl font-bold text-center text-red-700">ATTACK!</h2>
        
        <div className="relative flex justify-between items-end h-48 overflow-hidden px-4">
            {/* Player (Attacker) */}
            <div className={`flex flex-col items-center ${animationState === 'attacking' ? 'animate-headbutt-attacker' : ''}`}>
                <ThiefIcon className="w-24 h-24" />
                <div className="mt-2 p-2 bg-blue-100 rounded-lg text-center">
                    <p className="font-bold text-blue-800">You</p>
                    <p className="font-mono text-blue-900">{player.power.toLocaleString()} Power</p>
                </div>
            </div>

            {/* Target (Defender) */}
            <div className={`flex flex-col items-center ${animationState === 'attacking' ? 'animate-headbutt-defender' : ''}`}>
                <ThiefIcon className="w-24 h-24" />
                <div className="mt-2 p-2 bg-red-100 rounded-lg text-center">
                    <p className="font-bold text-red-800">{targetUser.name}</p>
                    <p className="font-mono text-red-900">{targetUser.power.toLocaleString()} Power</p>
                </div>
            </div>
        </div>

        <div className="text-center h-20">
          {animationState === 'finished' && (
            <div className="animate-fade-in">
                <p className={`text-4xl font-black ${playerWon ? 'text-green-600' : 'text-red-600'}`}>
                {playerWon ? "YOU WON!" : "YOU LOST!"}
                </p>
                <p className={`mt-1 font-semibold ${playerWon ? 'text-green-700' : 'text-red-700'}`}>
                    {playerWon ? `You took $${moneyExchanged.toLocaleString()}!` : `You lost $${moneyExchanged.toLocaleString()}!`}
                    <br />
                    <span className="text-sm text-gray-600">
                        You lost {playerHealthLost} HP. {targetUser.name} lost {targetHealthLost} HP.
                    </span>
                </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttackModal;

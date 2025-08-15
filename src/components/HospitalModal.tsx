
import React, { useState, useMemo } from 'react';
import { Player } from '../types';
import { HEAL_COST_PER_HP } from '../constants';
import { HospitalIcon } from './Icon';

interface HospitalModalProps {
  player: Player;
  onClose: () => void;
  onHeal: (amount: number) => void;
  disabled: boolean;
}

const HospitalModal: React.FC<HospitalModalProps> = ({ player, onClose, onHeal, disabled }) => {
  const maxHealAmount = 100 - player.hp;
  const [healAmount, setHealAmount] = useState(maxHealAmount);

  const healCost = useMemo(() => healAmount * HEAL_COST_PER_HP, [healAmount]);
  const canAfford = player.money >= healCost;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHealAmount(parseInt(e.target.value, 10));
  };
  
  const handleHealAction = () => {
    if (healAmount > 0 && canAfford) {
      onHeal(healAmount);
    }
  };

  return (
    <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="hospital-modal-title"
    >
      <div 
        className="bg-orange-50/95 backdrop-blur-md border border-orange-200 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-md m-4 flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-orange-200 pb-4">
          <h2 id="hospital-modal-title" className="text-2xl font-bold text-emerald-600">Visit Hospital</h2>
          <button 
            onClick={onClose} 
            className="text-orange-600 text-3xl leading-none hover:text-orange-900 transition-colors"
            aria-label="Close modal"
          >&times;</button>
        </div>

        <div className="text-center">
          <p className="text-orange-700">Your current health is <span className="font-bold text-red-600">{player.hp} / 100</span>.</p>
          <p className="text-sm text-orange-600">Select how much health you want to recover.</p>
        </div>
        
        <div className="space-y-4">
            <div className="flex justify-between font-mono text-lg">
                <span className="text-orange-800">Heal Amount: <span className="font-bold text-emerald-700">{healAmount} HP</span></span>
                <span className="text-orange-800">Cost: <span className={`font-bold ${canAfford ? 'text-green-600' : 'text-red-600'}`}>${healCost.toLocaleString()}</span></span>
            </div>
            <input
                type="range"
                min="0"
                max={maxHealAmount}
                value={healAmount}
                onChange={handleSliderChange}
                disabled={disabled || maxHealAmount === 0}
                className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
        </div>
        
        <button
            onClick={handleHealAction}
            disabled={disabled || healAmount <= 0 || !canAfford}
            className="w-full py-3 text-lg font-bold rounded-lg transition-colors bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-orange-100 disabled:text-orange-400"
        >
          {canAfford ? `Heal ${healAmount} HP` : 'Not Enough Money'}
        </button>

      </div>
    </div>
  );
};

export default HospitalModal;

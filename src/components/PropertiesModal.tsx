

import React, { useState } from 'react';
import { Player } from '../types';
import { HomeModernIcon } from './Icon';
import { RANK_LAND_CAPS, LAND_COST_PER_M3 } from '../constants';

interface PropertiesModalProps {
  onClose: () => void;
  player: Player;
  onBuy: (amount: number) => void;
  disabled: boolean;
}

const PropertiesModal: React.FC<PropertiesModalProps> = ({ onClose, player, onBuy, disabled }) => {
  const [buyAmount, setBuyAmount] = useState<number | string>(1);

  const landCap = RANK_LAND_CAPS[player.rank] || 0;
  const landAvailableToBuy = landCap - player.landOwned;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setBuyAmount('');
      return;
    }
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      setBuyAmount(Math.min(numValue, landAvailableToBuy));
    }
  };
  
  const totalCost = Number(buyAmount) * LAND_COST_PER_M3;
  const canAfford = player.money >= totalCost;

  const handleBuy = () => {
    if (Number(buyAmount) > 0) {
      onBuy(Number(buyAmount));
    }
  };

  return (
    <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="properties-modal-title"
    >
      <div 
        className="bg-orange-50/95 backdrop-blur-md border border-orange-200 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-xl m-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-orange-200 pb-4 mb-4">
          <h2 id="properties-modal-title" className="text-2xl font-bold text-cyan-700">Real Estate</h2>
          <button 
            onClick={onClose} 
            className="text-orange-600 text-3xl leading-none hover:text-orange-900 transition-colors"
            aria-label="Close properties modal"
          >&times;</button>
        </div>
        
        <div className="p-4 mb-4 bg-orange-100/50 border border-orange-200 rounded-lg flex items-center justify-between text-center">
             <div>
                <h3 className="font-bold text-lg text-orange-900">Land Owned</h3>
                <span className="font-mono text-xl text-cyan-800">{player.landOwned.toLocaleString()} m³</span>
            </div>
             <div>
                <h3 className="font-bold text-lg text-orange-900">Max Land</h3>
                <span className="font-mono text-xl text-orange-800">{landCap.toLocaleString()} m³</span>
            </div>
        </div>
        
        <div className="flex-grow space-y-4 p-4 bg-orange-50/70 rounded-lg">
            <h3 className="text-xl font-bold text-orange-900">Buy More Land</h3>
            <p className="text-sm text-orange-700">Each square meter of land costs ${LAND_COST_PER_M3.toLocaleString()} and allows you to plant one weed plant for passive income. Your maximum land ownership increases with your rank.</p>
            
            <div className="space-y-2">
                <label htmlFor="buyAmount" className="block text-sm font-semibold text-orange-800">Amount to Buy (m³)</label>
                <div className="flex gap-2">
                    <input
                        id="buyAmount"
                        type="number"
                        min="1"
                        max={landAvailableToBuy}
                        value={buyAmount}
                        onChange={handleAmountChange}
                        disabled={disabled || landAvailableToBuy <= 0}
                        className="w-full bg-white border border-orange-300 rounded-md p-2 text-center font-mono focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    />
                    <button 
                        onClick={() => setBuyAmount(landAvailableToBuy)}
                        disabled={disabled || landAvailableToBuy <= 0}
                        className="px-4 py-2 text-sm font-semibold rounded-md transition-colors text-center bg-orange-200 text-orange-800 hover:bg-orange-300 disabled:opacity-50"
                    >
                        Max
                    </button>
                </div>
            </div>

            <div className="text-center font-semibold text-lg">
                Total Cost: <span className={`font-mono ${canAfford ? 'text-green-700' : 'text-red-600'}`}>${totalCost.toLocaleString()}</span>
            </div>
            
             <button
                onClick={handleBuy}
                disabled={disabled || !canAfford || Number(buyAmount) <= 0 || landAvailableToBuy <= 0}
                className="w-full px-4 py-3 text-lg font-semibold rounded-md transition-colors text-center bg-cyan-600 text-white hover:bg-cyan-700 disabled:bg-orange-100 disabled:text-orange-400 disabled:cursor-not-allowed"
            >
                {landAvailableToBuy <= 0 ? 'Land Cap Reached' : !canAfford ? 'Not Enough Cash' : 'Buy Land'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default PropertiesModal;


import React, { useState } from 'react';
import { Player } from '../types';
import { LeafIcon, HomeModernIcon, CogIcon } from './Icon';
import { WEED_PRODUCTION_PER_M3_PER_DAY, PLANT_COST_PER_M3 } from '../constants';

interface ProductionModalProps {
  onClose: () => void;
  player: Player;
  onBuy: (amount: number) => void;
  disabled: boolean;
}

const ProductionModal: React.FC<ProductionModalProps> = ({ onClose, player, onBuy, disabled }) => {
  const [buyAmount, setBuyAmount] = useState<number | string>(1);
  const totalProductionPerDay = player.weedPlants * WEED_PRODUCTION_PER_M3_PER_DAY;
  const spaceAvailable = player.landOwned - player.weedPlants;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setBuyAmount('');
      return;
    }
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      setBuyAmount(Math.min(numValue, spaceAvailable));
    }
  };
  
  const totalCost = Number(buyAmount) * PLANT_COST_PER_M3;
  const canAfford = player.money >= totalCost;

  const handleBuy = () => {
    if (Number(buyAmount) > 0) {
      onBuy(Number(buyAmount));
    }
  };
  
  const CapacityBar: React.FC<{ value: number; max: number; }> = ({ value, max }) => (
    <div className="w-full bg-orange-200/50 rounded-full h-4 relative">
      <div className="bg-lime-600 h-4 rounded-full" style={{ width: `${max > 0 ? (value / max) * 100 : 0}%`, transition: 'width 0.5s ease-in-out' }}></div>
      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
          {value.toLocaleString()} / {max.toLocaleString()} m³ Used
      </div>
    </div>
  );

  return (
    <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="production-modal-title"
    >
      <div 
        className="bg-orange-50/95 backdrop-blur-md border border-orange-200 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-2xl m-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-orange-200 pb-4 mb-4">
          <h2 id="production-modal-title" className="text-2xl font-bold text-lime-700">Production Management</h2>
          <button 
            onClick={onClose} 
            className="text-orange-600 text-3xl leading-none hover:text-orange-900 transition-colors"
            aria-label="Close production modal"
          >&times;</button>
        </div>
        
        <div className="flex-grow space-y-4 overflow-y-auto pr-2 -mr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-orange-100/50 border border-orange-200 rounded-lg">
                    <h3 className="font-bold text-lg text-orange-900">Land Capacity</h3>
                    <p className="font-mono text-2xl text-cyan-800">{player.landOwned.toLocaleString()} m³</p>
                </div>
                <div className="text-center p-4 bg-orange-100/50 border border-orange-200 rounded-lg">
                    <h3 className="font-bold text-lg text-orange-900">Weed Plants</h3>
                    <p className="font-mono text-2xl text-lime-800">{player.weedPlants.toLocaleString()}</p>
                </div>
            </div>
            
            <div className="p-4 bg-orange-100/50 border border-orange-200 rounded-lg space-y-2">
                <h3 className="font-bold text-lg text-orange-900 text-center">Grow-op Capacity</h3>
                <CapacityBar value={player.weedPlants} max={player.landOwned} />
            </div>

            <div className="text-center p-4 bg-green-100/50 border border-green-200 rounded-lg">
                <h3 className="font-bold text-lg text-green-900">Total Daily Production</h3>
                <div className="flex items-center justify-center gap-2">
                    <LeafIcon className="h-8 w-8 text-green-700"/>
                    <p className="font-mono text-2xl text-green-800">
                        {totalProductionPerDay.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} Weed
                    </p>
                </div>
                 <p className="text-xs text-orange-600">({WEED_PRODUCTION_PER_M3_PER_DAY} per plant)</p>
            </div>
            
            <div className="space-y-4 p-4 bg-orange-50/70 rounded-lg border-t-2 border-orange-200 mt-4">
                <h3 className="text-xl font-bold text-orange-900">Expand Operation</h3>
                <p className="text-sm text-orange-700">Buy and plant more weed to increase your passive income. Each plant requires 1 m³ of available land and costs ${PLANT_COST_PER_M3.toLocaleString()}.</p>
                
                <div className="space-y-2">
                    <label htmlFor="buyAmount" className="block text-sm font-semibold text-orange-800">Amount to Plant</label>
                    <div className="flex gap-2">
                        <input
                            id="buyAmount"
                            type="number"
                            min="1"
                            max={spaceAvailable}
                            value={buyAmount}
                            onChange={handleAmountChange}
                            disabled={disabled || spaceAvailable <= 0}
                            className="w-full bg-white border border-orange-300 rounded-md p-2 text-center font-mono focus:ring-2 focus:ring-lime-500 focus:outline-none"
                        />
                        <button 
                            onClick={() => setBuyAmount(spaceAvailable)}
                            disabled={disabled || spaceAvailable <= 0}
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
                    disabled={disabled || !canAfford || Number(buyAmount) <= 0 || spaceAvailable <= 0}
                    className="w-full px-4 py-3 text-lg font-semibold rounded-md transition-colors text-center bg-lime-600 text-white hover:bg-lime-700 disabled:bg-orange-100 disabled:text-orange-400 disabled:cursor-not-allowed"
                >
                    {spaceAvailable <= 0 ? 'Not Enough Land' : !canAfford ? 'Not Enough Cash' : 'Buy & Plant'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionModal;
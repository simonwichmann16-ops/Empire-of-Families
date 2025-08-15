
import React from 'react';
import { PlayerVehicle } from '../types';
import { VEHICLES, REPAIR_COST_FACTOR } from '../constants';
import { GarageIcon, WrenchIcon } from './Icon';

interface GarageModalProps {
  playerVehicles: PlayerVehicle[];
  playerMoney: number;
  onSell: (vehicleInstanceId: string) => void;
  onRepair: (vehicleInstanceId: string) => void;
  disabled: boolean;
  onClose: () => void;
}

const ConditionBar: React.FC<{ value: number }> = ({ value }) => {
    let color = 'bg-green-500';
    if (value < 50) color = 'bg-red-500';
    else if (value < 80) color = 'bg-yellow-500';
    
    return (
        <div className="w-full bg-orange-200/50 rounded-full h-2.5">
            <div className={`${color} h-2.5 rounded-full`} style={{ width: `${value}%`, transition: 'width 0.5s ease-in-out' }}></div>
        </div>
    );
};

const GarageModal: React.FC<GarageModalProps> = ({ playerVehicles, playerMoney, onSell, onRepair, disabled, onClose }) => {

  return (
    <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="garage-modal-title"
    >
      <div 
        className="bg-orange-50/95 backdrop-blur-md border border-orange-200 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-3xl m-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-orange-200 pb-4 mb-4">
          <h2 id="garage-modal-title" className="text-2xl font-bold text-stone-800">Your Garage</h2>
          <button 
            onClick={onClose} 
            className="text-orange-600 text-3xl leading-none hover:text-orange-900 transition-colors"
            aria-label="Close garage modal"
          >&times;</button>
        </div>
        <div className="overflow-y-auto space-y-4 pr-2 -mr-4 flex-grow">
          {playerVehicles.length > 0 ? (
            <ul className="space-y-4">
              {playerVehicles.map((playerVehicle) => {
                const vehicleInfo = VEHICLES.find(v => v.id === playerVehicle.vehicleId);
                if (!vehicleInfo) return null;

                const salePrice = Math.round(vehicleInfo.resaleValue * (playerVehicle.condition / 100));
                const repairCost = Math.round(vehicleInfo.resaleValue * REPAIR_COST_FACTOR);

                return (
                    <li key={playerVehicle.id} className="flex flex-col gap-4 p-4 bg-orange-50/70 rounded-lg">
                        {/* Top Info Section */}
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-orange-100 rounded-md text-stone-600">
                                <GarageIcon className="h-8 w-8" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-orange-900">{vehicleInfo.name}</h4>
                                <p className="text-sm text-orange-700">{vehicleInfo.description}</p>
                            </div>
                        </div>
                        
                        {/* Condition and Value Section */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-orange-200/80 pt-4">
                           <div>
                                <div className="flex justify-between text-sm font-semibold text-orange-800">
                                    <span>Condition</span>
                                    <span className="font-mono">{playerVehicle.condition}%</span>
                                </div>
                                <ConditionBar value={playerVehicle.condition} />
                           </div>
                           <div className="text-right">
                                <p className="text-sm font-semibold text-orange-800">Current Value</p>
                                <p className="font-mono text-lg text-green-700">${salePrice.toLocaleString()}</p>
                           </div>
                        </div>

                        {/* Actions Section */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => onSell(playerVehicle.id)}
                                disabled={disabled}
                                className="flex-1 px-4 py-2 text-sm font-semibold rounded-md transition-colors text-center bg-green-600 text-white hover:bg-green-700 disabled:bg-orange-100 disabled:text-orange-400 disabled:cursor-not-allowed"
                            >
                                Sell for ${salePrice.toLocaleString()}
                            </button>
                            <button
                                onClick={() => onRepair(playerVehicle.id)}
                                disabled={disabled || playerVehicle.condition === 100 || playerMoney < repairCost}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors text-center bg-blue-600 text-white hover:bg-blue-700 disabled:bg-orange-100 disabled:text-orange-400 disabled:cursor-not-allowed"
                            >
                                <WrenchIcon className="h-4 w-4" />
                                <span>Repair for ${repairCost.toLocaleString()}</span>
                            </button>
                        </div>
                         {playerVehicle.condition < 100 && playerMoney < repairCost && (
                            <p className="text-xs text-center text-red-600 -mt-2">Not enough cash to repair.</p>
                         )}
                    </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-center p-8 text-orange-600 flex flex-col items-center gap-4">
              <GarageIcon className="h-16 w-16 text-orange-400" />
              <p className="text-lg">Your garage is empty.</p>
              <p className="text-sm">Visit the "Commit a Crime" menu to steal some vehicles.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GarageModal;

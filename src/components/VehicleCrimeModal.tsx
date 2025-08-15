

import React, { useState, useEffect } from 'react';
import { Player, VehicleCrime } from '../types';
import { RANKS, VEHICLES } from '../constants';
import { calculateVehicleCrimeSuccessChance } from '../utils/crimeCalculations';

const CooldownTimer: React.FC<{ cooldownEnd: number | undefined }> = ({ cooldownEnd }) => {
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        if (cooldownEnd && cooldownEnd > now) {
            const timer = setInterval(() => {
                const newNow = Date.now();
                if (newNow >= cooldownEnd) {
                    clearInterval(timer);
                }
                setNow(newNow);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [cooldownEnd, now]);

    const remaining = cooldownEnd ? Math.max(0, Math.ceil((cooldownEnd - now) / 1000)) : 0;
    const isCoolingDown = remaining > 0;

    if (!isCoolingDown) return null;

    return <span className="text-amber-600 font-bold">{remaining}s</span>;
};

const VehicleCrimeItemCard: React.FC<{
    crime: VehicleCrime;
    onCrime: (crime: VehicleCrime) => void;
    cooldownEnd: number | undefined;
    disabled: boolean;
    successChance: number;
    isLocked: boolean;
}> = ({ crime, onCrime, cooldownEnd, disabled, successChance, isLocked }) => {
    const isCoolingDown = cooldownEnd && cooldownEnd > Date.now();
    const targetVehicle = VEHICLES.find(v => v.id === crime.targetVehicleId);
    const getChanceColor = (chance: number) => chance >= 75 ? 'text-lime-600' : chance >= 50 ? 'text-amber-600' : 'text-red-600';

    return (
        <li className={`flex flex-col gap-3 p-4 bg-orange-50/70 rounded-lg transition-opacity ${isLocked ? 'opacity-60' : 'opacity-100'}`}>
            <div>
                <h4 className="font-semibold text-orange-900">{crime.name}</h4>
                <p className="text-sm text-orange-700 mt-1">{crime.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-mono border-t border-orange-200/80 pt-3">
                 <div className="flex items-center gap-1.5"><span className="text-orange-600">Success:</span>{isLocked ? <span className="font-bold text-orange-600">Locked</span> : <span className={`font-bold ${getChanceColor(successChance)}`}>{successChance}%</span>}</div>
                 <div className="flex items-center gap-1.5 justify-end"><span className="text-orange-600">Reward:</span>{!isLocked && (<span className="font-bold text-sky-600">{targetVehicle?.name}</span>)}</div>
                 <div className="flex items-center gap-1.5"><span className="text-orange-600">Rank:</span><span className="font-bold text-orange-800">{crime.rankRequired}</span></div>
                 <div className="flex items-center gap-1.5 justify-end"><span className="text-orange-600">Cooldown:</span>{isCoolingDown ? <CooldownTimer cooldownEnd={cooldownEnd} /> : <span className="text-orange-800 font-bold">{crime.cooldown}s</span>}</div>
            </div>
            <button onClick={() => onCrime(crime)} disabled={disabled || isCoolingDown || isLocked} className="w-full text-center mt-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors bg-sky-600 text-white hover:bg-sky-700 disabled:bg-orange-100 disabled:text-orange-400 disabled:cursor-not-allowed">
                {isLocked ? `Rank needed: ${crime.rankRequired}` : isCoolingDown ? 'On Cooldown' : 'Steal'}
            </button>
        </li>
    );
};


interface VehicleCrimeModalProps {
  vehicleCrimes: VehicleCrime[];
  player: Player;
  onVehicleCrime: (crime: VehicleCrime) => void;
  vehicleCrimeCooldownEnd: number | null;
  disabled: boolean;
  onClose: () => void;
}

const VehicleCrimeModal: React.FC<VehicleCrimeModalProps> = ({ vehicleCrimes, player, onVehicleCrime, vehicleCrimeCooldownEnd, disabled, onClose }) => {
  const currentRankIndex = RANKS.findIndex(r => r.name === player.rank);
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="v-crime-modal-title">
      <div className="bg-orange-50/95 backdrop-blur-md border border-orange-200 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-2xl m-4 max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center border-b border-orange-200 pb-4 mb-4">
          <h2 id="v-crime-modal-title" className="text-2xl font-bold text-sky-600">Vehicle Theft</h2>
          <button onClick={onClose} className="text-orange-600 text-3xl leading-none hover:text-orange-900 transition-colors" aria-label="Close vehicle crime modal">&times;</button>
        </div>
        
        <ul className="overflow-y-auto space-y-3 pr-2 -mr-4 flex-grow">
          {vehicleCrimes.map(crime => {
            const crimeRankIndex = RANKS.findIndex(r => r.name === crime.rankRequired);
            return <VehicleCrimeItemCard key={crime.id} crime={crime} onCrime={onVehicleCrime} cooldownEnd={vehicleCrimeCooldownEnd} disabled={disabled} successChance={calculateVehicleCrimeSuccessChance(crime, player, 0)} isLocked={crimeRankIndex > currentRankIndex} />;
          })}
        </ul>
      </div>
    </div>
  );
};

export default VehicleCrimeModal;
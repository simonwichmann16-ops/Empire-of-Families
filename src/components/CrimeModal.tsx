import React, { useState, useEffect } from 'react';
import { Crime, Player } from '../types';
import { RANKS } from '../constants';
import { calculateCrimeSuccessChance } from '../utils/crimeCalculations';

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

    return <span className="text-amber-700 font-bold">{remaining}s</span>;
};


const CrimeItemCard: React.FC<{
    crime: Crime;
    onCrime: (crime: Crime) => void;
    generalCrimeCooldownEnd: number;
    disabled: boolean;
    successChance: number;
    isLocked: boolean;
}> = ({ crime, onCrime, generalCrimeCooldownEnd, disabled, successChance, isLocked }) => {
    const isCoolingDown = generalCrimeCooldownEnd > Date.now();
    const averageReward = Math.round((crime.moneyRange[0] + crime.moneyRange[1]) / 2);
    const getChanceColor = (chance: number) => chance >= 75 ? 'text-lime-600' : chance >= 50 ? 'text-amber-600' : 'text-red-600';

    return (
        <li className={`flex flex-col gap-3 p-4 bg-amber-200/70 rounded-lg transition-opacity ${isLocked ? 'opacity-60' : 'opacity-100'}`}>
            <div>
                <h4 className="font-semibold text-amber-900">{crime.name}</h4>
                <p className="text-sm text-amber-800 mt-1">{crime.description}</p>
            </div>
            <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-xs font-mono border-t border-amber-300/80 pt-3">
                <div className="flex items-center gap-1.5"><span className="text-amber-700">Success:</span>{isLocked ? <span className="font-bold text-amber-700">Locked</span> : <span className={`font-bold ${getChanceColor(successChance)}`}>{successChance}%</span>}</div>
                <div className="flex items-center gap-1.5"><span className="text-amber-700">Health Cost:</span><span className="font-bold text-red-600">-{crime.healthCost} HP</span></div>
                <div className="flex items-center gap-1.5 justify-end"><span className="text-amber-700">Reward:</span>{!isLocked && (<span className="font-bold text-green-700">~${averageReward.toLocaleString()}</span>)}</div>
                <div className="flex items-center gap-1.5"><span className="text-amber-700">Rank:</span><span className="font-bold text-amber-800">{crime.rankRequired}</span></div>
                <div className="flex items-center gap-1.5 col-span-2 justify-end"><span className="text-amber-700">Cooldown:</span>{isCoolingDown ? <CooldownTimer cooldownEnd={generalCrimeCooldownEnd} /> : <span className="text-amber-800 font-bold">{crime.cooldown}s</span>}</div>
            </div>
            <button onClick={() => onCrime(crime)} disabled={disabled || isCoolingDown || isLocked} className="w-full text-center mt-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors bg-amber-700 text-white hover:bg-amber-800 disabled:bg-amber-200 disabled:text-amber-500 disabled:cursor-not-allowed">
                {isLocked ? `Rank needed: ${crime.rankRequired}` : isCoolingDown ? 'On Cooldown' : 'Attempt'}
            </button>
        </li>
    );
};

interface CrimeModalProps {
  crimes: Crime[];
  player: Player;
  onCrime: (crime: Crime) => void;
  generalCrimeCooldownEnd: number;
  disabled: boolean;
  onClose: () => void;
}

const CrimeModal: React.FC<CrimeModalProps> = ({ crimes, player, onCrime, generalCrimeCooldownEnd, disabled, onClose }) => {
  const [activeTab, setActiveTab] = useState<'Petty Theft' | 'Felony' | 'Operations'>('Petty Theft');
  const currentRankIndex = RANKS.findIndex(r => r.name === player.rank);
  
  const pettyTheftCrimes = crimes.filter(c => c.category === 'Petty Theft');
  const felonyCrimes = crimes.filter(c => c.category === 'Felony');
  const operationsCrimes = crimes.filter(c => c.category === 'Operations');

  const TabButton: React.FC<{ label: 'Petty Theft' | 'Felony' | 'Operations' }> = ({ label }) => (
    <button onClick={() => setActiveTab(label)} className={`px-4 py-2 font-bold text-lg rounded-t-md transition-colors ${activeTab === label ? 'bg-amber-100/50 text-amber-800' : 'bg-transparent text-amber-700 hover:bg-amber-200/50'}`}>
      {label}
    </button>
  );
  
  const renderCrimes = (crimeList: Crime[]) => (
      <div className="space-y-4">
          {crimeList.map(crime => {
              const crimeRankIndex = RANKS.findIndex(r => r.name === crime.rankRequired);
              return <CrimeItemCard key={crime.id} crime={crime} onCrime={onCrime} generalCrimeCooldownEnd={generalCrimeCooldownEnd} disabled={disabled} successChance={calculateCrimeSuccessChance(crime, player, 0)} isLocked={crimeRankIndex > currentRankIndex} />;
          })}
      </div>
  );
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="crime-modal-title">
      <div className="bg-amber-100/95 backdrop-blur-md border border-amber-300 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-2xl m-4 max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center border-b border-amber-300 pb-4 mb-1">
          <h2 id="crime-modal-title" className="text-2xl font-bold text-amber-800">Commit a Crime</h2>
          <button onClick={onClose} className="text-amber-700 text-3xl leading-none hover:text-amber-900 transition-colors" aria-label="Close crime modal">&times;</button>
        </div>
        
        <div className="flex border-b border-amber-300 mb-4">
            <TabButton label="Petty Theft" />
            <TabButton label="Felony" />
            <TabButton label="Operations" />
        </div>

        <div className="overflow-y-auto pr-2 -mr-4 flex-grow">
          {activeTab === 'Petty Theft' && renderCrimes(pettyTheftCrimes)}
          {activeTab === 'Felony' && renderCrimes(felonyCrimes)}
          {activeTab === 'Operations' && renderCrimes(operationsCrimes)}
        </div>
      </div>
    </div>
  );
};

export default CrimeModal;


import React, { useState, useEffect, useMemo } from 'react';
import { Player, Heist, HeistStage, FinalHeistOutcome, PlayerVehicle, HeistStageOption } from '../types';
import { HeistIcon } from './Icon';
import { RANKS, VEHICLES } from '../constants';

interface HeistModalProps {
  player: Player;
  playerVehicles: PlayerVehicle[];
  heists: Heist[];
  onExecuteHeist: (heist: Heist, chosenOptions: HeistStageOption[], vehicleId?: string) => void;
  onClose: () => void;
  disabled: boolean;
  heistCooldownEnd: number | null;
}

const CooldownTimer: React.FC<{ endTime: number }> = ({ endTime }) => {
    const [timeLeft, setTimeLeft] = useState(Math.max(0, endTime - Date.now()));

    useEffect(() => {
        const intervalId = setInterval(() => {
            const newTimeLeft = Math.max(0, endTime - Date.now());
            setTimeLeft(newTimeLeft);
            if (newTimeLeft <= 0) {
                clearInterval(intervalId);
            }
        }, 1000);
        return () => clearInterval(intervalId);
    }, [endTime]);

    if (timeLeft <= 0) return null;

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return <span>{`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}</span>;
};

const FinalOutcomeDisplay: React.FC<{ outcome: FinalHeistOutcome }> = ({ outcome }) => (
    <div className={`mt-4 border-t-2 border-dashed ${outcome.success ? 'border-green-400' : 'border-red-400'} p-4 text-center rounded-b-lg ${outcome.success ? 'bg-green-100/50' : 'bg-red-100/50'}`}>
        <h4 className="font-bold text-lg text-orange-950">Heist Outcome</h4>
        <p className={`italic my-2 ${outcome.success ? 'text-green-800' : 'text-red-800'}`}>{outcome.narrative}</p>
        {outcome.success && (
            <p className="font-semibold text-orange-800">
                You escaped with ${outcome.moneyGained.toLocaleString()} and earned {outcome.xpGained.toLocaleString()} XP.
            </p>
        )}
    </div>
);

const HeistPlanner: React.FC<{
    heist: Heist;
    player: Player;
    playerVehicles: PlayerVehicle[];
    onExecute: (heist: Heist, chosenOptions: HeistStageOption[], vehicleId?: string) => void;
    disabled: boolean;
}> = ({ heist, player, playerVehicles, onExecute, disabled }) => {
    
    const initialOptions = heist.stages.reduce((acc, stage) => {
        if (stage.options && stage.options.length > 0) {
            acc[stage.id] = stage.options[0].id;
        }
        return acc;
    }, {} as {[stageId: string]: string});

    const [selectedOptions, setSelectedOptions] = useState<{[stageId: string]: string}>(initialOptions);
    const [selectedVehicleId, setSelectedVehicleId] = useState('');

    const handleOptionChange = (stageId: string, optionId: string) => {
        setSelectedOptions(prev => ({ ...prev, [stageId]: optionId }));
    };

    const chosenOptions = useMemo(() => {
        return Object.entries(selectedOptions).map(([stageId, optionId]) => {
            const stage = heist.stages.find(s => s.id === stageId);
            return stage?.options?.find(opt => opt.id === optionId);
        }).filter((opt): opt is HeistStageOption => opt !== undefined);
    }, [selectedOptions, heist.stages]);

    const totalCost = useMemo(() => chosenOptions.reduce((sum, opt) => sum + opt.cost, 0), [chosenOptions]);
    const totalSuccessBonus = useMemo(() => chosenOptions.reduce((sum, opt) => sum + opt.successBonus, 0), [chosenOptions]);
    const totalFailureBonus = useMemo(() => chosenOptions.reduce((sum, opt) => sum + opt.failureBonus, 0), [chosenOptions]);
    
    const canAfford = player.money >= totalCost;
    
    const prepStages = heist.stages.filter(s => s.options && s.options.length > 0);

    const successChance = 50 + totalSuccessBonus;
    const failureChance = 5 + totalFailureBonus;

    return (
        <div className="mt-4 border-t border-orange-200 pt-4 space-y-3">
            <h3 className="font-bold text-lg text-orange-950">Plan your approach:</h3>
            {prepStages.map(stage => (
                <div key={stage.id} className="p-3 bg-orange-100/50 rounded-lg">
                    <label htmlFor={stage.id} className="block font-semibold text-orange-800 mb-1">{stage.name}</label>
                    <select
                        id={stage.id}
                        value={selectedOptions[stage.id]}
                        onChange={(e) => handleOptionChange(stage.id, e.target.value)}
                        disabled={disabled}
                        className="w-full p-2 bg-white border border-orange-300 rounded-md focus:ring-2 focus:ring-red-500 disabled:bg-gray-200"
                    >
                        {stage.options?.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                    </select>
                </div>
            ))}
            
            <div className="p-3 bg-orange-100/50 rounded-lg">
                <label htmlFor="getaway-vehicle" className="block font-semibold text-orange-800 mb-1">Getaway Vehicle (Optional)</label>
                <select 
                    id="getaway-vehicle"
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    disabled={disabled}
                    className="w-full p-2 bg-white border border-orange-300 rounded-md focus:ring-2 focus:ring-red-500 disabled:bg-gray-200"
                >
                    <option value="">-- No Vehicle --</option>
                    {playerVehicles.map(v => {
                        const vInfo = VEHICLES.find(base => base.id === v.vehicleId);
                        return vInfo ? (
                            <option key={v.id} value={v.id}>
                                {vInfo.name} ({v.condition}% Cond, +{vInfo.heistBonus}% Bonus)
                            </option>
                        ) : null;
                    })}
                </select>
            </div>

            <div className="p-4 bg-orange-100/50 border border-orange-200 rounded-lg grid grid-cols-3 text-center">
                <div>
                  <h3 className="font-bold text-lg text-orange-900">Total Cost</h3>
                  <span className={`font-mono text-xl ${canAfford ? 'text-green-800' : 'text-red-700'}`}>${totalCost.toLocaleString()}</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-orange-900">Success Chance</h3>
                  <span className="font-mono text-xl text-green-700">~{successChance}%</span>
                </div>
                 <div>
                  <h3 className="font-bold text-lg text-orange-900">Failure Chance</h3>
                  <span className="font-mono text-xl text-red-700">~{failureChance}%</span>
                </div>
            </div>

            <button
              onClick={() => onExecute(heist, chosenOptions, selectedVehicleId)}
              disabled={disabled || !canAfford}
              className="w-full mt-2 px-4 py-3 text-lg font-semibold rounded-md transition-colors text-center bg-red-800 text-white hover:bg-red-700 disabled:bg-orange-200 disabled:text-orange-500 disabled:cursor-not-allowed"
            >
              {canAfford ? "Execute Heist" : "Not Enough Funds"}
            </button>
        </div>
    );
};

const HeistModal: React.FC<HeistModalProps> = ({ player, playerVehicles, heists, onExecuteHeist, onClose, disabled, heistCooldownEnd }) => {
  const isOnCooldown = heistCooldownEnd && heistCooldownEnd > Date.now();

  return (
    <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="heist-modal-title"
    >
      <div 
        className="bg-orange-50/95 backdrop-blur-md border border-orange-200 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-2xl m-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-orange-200 pb-4 mb-4">
          <h2 id="heist-modal-title" className="text-2xl font-bold text-red-800">Heists</h2>
          <button 
            onClick={onClose} 
            className="text-orange-600 text-3xl leading-none hover:text-orange-900 transition-colors"
            aria-label="Close heist modal"
          >&times;</button>
        </div>
        {isOnCooldown && (
            <div className="mb-4 text-center p-3 bg-red-100/50 border border-red-200 rounded-lg">
                <p className="font-bold text-red-700">Heists on Cooldown</p>
                <p className="font-mono text-xl text-red-800"><CooldownTimer endTime={heistCooldownEnd} /></p>
            </div>
        )}
        <div className="overflow-y-auto space-y-4 pr-2 -mr-4 flex-grow">
          {heists.map(activeHeist => {
            const playerRankIndex = RANKS.findIndex(r => r.name === player.rank);
            const heistRankIndex = RANKS.findIndex(r => r.name === activeHeist.minRank);
            const isHeistLocked = playerRankIndex < heistRankIndex;
            
            const heistProgress = player.heists[activeHeist.id];
            const lastOutcome = heistProgress?.lastHeistOutcome;
            
            return (
              <div key={activeHeist.id} className={`p-4 rounded-lg bg-orange-100/50 border border-orange-200 ${isHeistLocked || isOnCooldown ? 'opacity-60' : ''}`}>
                <div className="flex items-center gap-4">
                    <HeistIcon className="h-10 w-10 text-red-800 flex-shrink-0"/>
                    <div>
                        <h3 className="text-xl font-bold text-orange-950">{activeHeist.name}</h3>
                        <p className="text-sm text-orange-700">{activeHeist.description}</p>
                        {isHeistLocked && <p className="text-sm font-bold text-red-600 mt-1">Requires Rank: {activeHeist.minRank}</p>}
                    </div>
                </div>
                
                {lastOutcome && (
                    <div className="mt-4 text-center">
                         <FinalOutcomeDisplay outcome={lastOutcome} />
                    </div>
                )}

                {!isHeistLocked && (
                    <HeistPlanner 
                        heist={activeHeist}
                        player={player}
                        playerVehicles={playerVehicles}
                        onExecute={onExecuteHeist}
                        disabled={disabled || isOnCooldown}
                    />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HeistModal;

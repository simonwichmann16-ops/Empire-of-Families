

import React from 'react';
import { Territory, Player, Family } from '../types';
import { MapIcon, ShieldCheckIcon, PowerIcon, DaggerIcon } from './Icon';

interface CityMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  territories: Territory[];
  locationName: string;
  player: Player;
  families: Family[];
  onAttackTerritory: (territoryId: string) => void;
  disabled: boolean;
}

const InfluenceBar: React.FC<{ value: number; max: number; }> = ({ value, max }) => (
  <div className="w-full bg-orange-200/50 rounded-full h-2.5">
    <div className="bg-rose-500 h-2.5 rounded-full" style={{ width: `${max > 0 ? (value / max) * 100 : 0}%`, transition: 'width 0.5s ease-in-out' }}></div>
  </div>
);

const CityMapModal: React.FC<CityMapModalProps> = ({ isOpen, onClose, territories, locationName, player, families, onAttackTerritory, disabled }) => {
    if (!isOpen) return null;

    const getBonusText = (bonus: Territory['bonus']) => {
        switch (bonus.type) {
            case 'BUSINESS_INCOME': return `+${bonus.value}% Business Income`;
            case 'CRIME_SUCCESS': return `+${bonus.value}% Crime Success`;
            case 'HEIST_SUCCESS': return `+${bonus.value}% Heist Success`;
            case 'XP_GAIN': return `+${bonus.value}% XP Gain`;
            case 'CASINO_LOSS_CUT': return `${bonus.value}% of Casino Losses`;
            case 'DRUG_PRODUCTION': return `+${bonus.value}% Drug Production`;
            default: return 'Unknown Bonus';
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in" 
            onClick={onClose}
            role="dialog" aria-modal="true" aria-labelledby="city-map-modal-title"
        >
            <div 
                className="bg-orange-50/95 backdrop-blur-md border border-orange-200 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-4xl m-4 max-h-[80vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center border-b border-orange-200 pb-4 mb-4">
                    <div className="flex items-center gap-4">
                        <MapIcon className="h-8 w-8 text-rose-600" />
                        <h2 id="city-map-modal-title" className="text-2xl font-bold text-rose-600">{locationName}: Turf War</h2>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-orange-600 text-3xl leading-none hover:text-orange-900 transition-colors"
                        aria-label="Close modal"
                    >&times;</button>
                </div>

                <div className="overflow-y-auto space-y-4 pr-2 -mr-4 flex-grow">
                    {territories.length > 0 ? (
                        territories.map(territory => {
                            const controllingFamily = families.find(f => f.id === territory.controllingFamilyId);
                            const playerFamily = families.find(f => f.name === player.familyName);
                            const isControlledByPlayerFamily = controllingFamily?.id === playerFamily?.id;
                            const canAttack = player.familyName && !isControlledByPlayerFamily && player.stamina >= 10;
                            
                            return (
                                <div key={territory.id} className="p-4 bg-orange-100/50 border border-orange-200 rounded-lg">
                                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-orange-950">{territory.name}</h3>
                                            {controllingFamily ? (
                                                <div className="flex items-center gap-2 text-sm text-amber-700">
                                                    <ShieldCheckIcon className="h-4 w-4" />
                                                    <span>Controlled by: <strong>The {controllingFamily.name} Family</strong></span>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500">Uncontrolled Territory</p>
                                            )}
                                        </div>
                                        <div className="w-full sm:w-1/3">
                                            <div className="flex justify-between text-sm font-semibold text-orange-800">
                                                <span>Influence</span>
                                                <span className="font-mono">{territory.influence.toLocaleString()} / {territory.maxInfluence.toLocaleString()}</span>
                                            </div>
                                            <InfluenceBar value={territory.influence} max={territory.maxInfluence} />
                                        </div>
                                    </div>
                                    <div className="mt-4 border-t border-orange-200 pt-3 flex flex-col sm:flex-row items-center justify-between">
                                        <div className="flex items-center gap-2 text-green-700 font-semibold">
                                            <PowerIcon className="h-5 w-5" />
                                            <span>Bonus: {getBonusText(territory.bonus)}</span>
                                        </div>
                                        <button
                                            onClick={() => onAttackTerritory(territory.id)}
                                            disabled={disabled || !canAttack}
                                            className="mt-3 sm:mt-0 w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-colors bg-red-600 text-white hover:bg-red-700 disabled:bg-orange-200 disabled:text-orange-500 disabled:cursor-not-allowed"
                                        >
                                            <DaggerIcon className="h-4 w-4" />
                                            <span>Attack (10 Stamina)</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center p-8 text-orange-600">
                            <p className="text-lg">There are no contested territories in this region.</p>
                            <p className="text-sm">The underworld here is either peaceful or completely lawless.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CityMapModal;

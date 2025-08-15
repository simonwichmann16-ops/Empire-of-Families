

import React, { useState } from 'react';
import { Player, WheelFortuneOutcome } from '../types';
import { WHEEL_REWARDS, DRUGS, VEHICLES } from '../constants';

interface WheelOfFortuneModalProps {
  player: Player;
  onSpin: () => Promise<WheelFortuneOutcome | null>;
  onClose: () => void;
  disabled: boolean;
}

const WheelOfFortuneModal: React.FC<WheelOfFortuneModalProps> = ({ player, onSpin, onClose, disabled }) => {
    const [rotation, setRotation] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const [resultText, setResultText] = useState('');

    const spinCost = 1000;
    const today = new Date().toISOString().split('T')[0];
    const spinsToday = player.lastWheelSpinDay === today ? player.dailyWheelSpins : 0;
    const spinsLeft = 3 - spinsToday;

    const hasCompedSkill = player.unlockedSkills.includes('grifter_2');
    const isFreeSpin = hasCompedSkill && spinsToday === 0;
    const canAfford = player.money >= spinCost;

    const numRewards = WHEEL_REWARDS.length;
    const segmentAngle = 360 / numRewards;

    const handleSpin = async () => {
        if (isSpinning || disabled || (!canAfford && !isFreeSpin) || spinsLeft <= 0) return;

        setIsSpinning(true);
        setResultText('');
        setRotation(prev => prev % 360); // Reset to current visual position before starting new spin

        const result = await onSpin();
        if (result) {
            let landingIndex = -1;
            
            switch (result.prizeType) {
                case 'money':
                    if (result.moneyGained === 1000) landingIndex = 0;
                    else if (result.moneyGained === 5000) landingIndex = 2;
                    break;
                case 'drug':
                    if (result.drugsGained?.drugId === 'weed') landingIndex = 1;
                    else if (result.drugsGained?.drugId === 'pills') landingIndex = 5;
                    break;
                case 'vehicle':
                    landingIndex = 3;
                    break;
                case 'xp':
                    landingIndex = 4;
                    break;
                case 'respect':
                    landingIndex = 6;
                    break;
                case 'nothing':
                    landingIndex = 7;
                    break;
            }

            if (landingIndex === -1) { // Fallback for safety
                landingIndex = 7; 
            }

            const fullRotations = 5;
            const targetSegmentMiddleAngle = (landingIndex * segmentAngle) + (segmentAngle / 2);
            const targetRotation = -targetSegmentMiddleAngle;
            
            const randomOffset = (Math.random() - 0.5) * (segmentAngle * 0.8);
            const finalRotation = rotation + (360 * fullRotations) + targetRotation + randomOffset;
            
            setRotation(finalRotation);

            setTimeout(() => {
                let rewardStr = 'Nothing';
                switch (result.prizeType) {
                    case 'money':
                        const moneyPrize = WHEEL_REWARDS.find(r => r.type === 'Money' && r.value.includes(result.moneyGained.toString()));
                        rewardStr = moneyPrize ? moneyPrize.value : `$${result.moneyGained}`;
                        break;
                    case 'drug':
                        if (result.drugsGained) {
                            const drugPrize = WHEEL_REWARDS.find(r => r.type === 'Drug' && r.value.toLowerCase().includes(result.drugsGained.drugId));
                            rewardStr = drugPrize ? drugPrize.value : `${result.drugsGained.quantity} ${result.drugsGained.drugId}`;
                        }
                        break;
                    case 'vehicle':
                         if (result.vehicleGained) {
                            const vehiclePrize = WHEEL_REWARDS.find(r => r.type === 'Vehicle');
                            rewardStr = vehiclePrize ? vehiclePrize.value : `a ${VEHICLES.find(v => v.id === result.vehicleGained?.vehicleId)?.name || 'Car'}`;
                         }
                        break;
                    case 'xp':
                        rewardStr = `${result.xpGained} XP`;
                        break;
                    case 'respect':
                        rewardStr = `${result.respectGained} Respect`;
                        break;
                }
                
                if (rewardStr !== 'Nothing') {
                    setResultText(`Congratulations, you got ${rewardStr}!`);
                } else {
                    setResultText('Better luck next time!');
                }
                setIsSpinning(false);
            }, 5000); // Corresponds to animation duration
        } else {
            setIsSpinning(false);
        }
    };

    const colors = WHEEL_REWARDS.map((_, index) => index % 2 === 0 ? '#fef3c7' : '#ffffff');
    const gradientStops = colors.map((color, index) => `${color} ${index * segmentAngle}deg, ${color} ${(index + 1) * segmentAngle}deg`).join(', ');
    const conicGradientBg = `conic-gradient(from ${-segmentAngle/2}deg, ${gradientStops})`;
    const borderGradient = `repeating-conic-gradient(from ${-segmentAngle/2}deg, #facc15 0 2px, transparent 2px ${segmentAngle}deg)`;

    return (
        <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in" 
            onClick={onClose}
            role="dialog" aria-modal="true" aria-labelledby="wof-modal-title"
        >
            <div 
                className="bg-orange-50/95 backdrop-blur-md border border-orange-200 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-lg m-4 flex flex-col gap-6 items-center text-center"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center border-b border-orange-200 pb-4 w-full">
                    <h2 id="wof-modal-title" className="text-2xl font-bold text-amber-600">Wheel of Fortune</h2>
                    <button 
                        onClick={onClose} 
                        className="text-orange-600 text-3xl leading-none hover:text-orange-900 transition-colors"
                        aria-label="Close modal"
                    >&times;</button>
                </div>
                
                <div className="relative w-80 h-80 sm:w-96 sm:h-96">
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-x-[12px] border-x-transparent border-b-[24px] border-b-red-600 z-20" style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.4))' }}/>
                    
                    <div 
                        className="relative w-full h-full transition-transform duration-[5000ms] ease-out"
                        style={{ transform: `rotate(${rotation}deg)` }}
                    >
                       <div 
                            className="w-full h-full rounded-full border-8 border-amber-500 shadow-xl overflow-hidden"
                            style={{ background: conicGradientBg }}
                        >
                            <div className="absolute inset-0" style={{ background: borderGradient }} />
                        </div>
                        
                        <div className="absolute inset-0">
                            {WHEEL_REWARDS.map((reward, index) => {
                                const angleRad = (index * segmentAngle) * (Math.PI / 180);
                                const radius = 0.35 * 384; // 35% of the container width (384px for sm:w-96)
                                const x = 50 + (radius / 384 * 100) * Math.sin(angleRad);
                                const y = 50 - (radius / 384 * 100) * Math.cos(angleRad);
                                
                                return (
                                    <div
                                        key={index}
                                        className="absolute text-amber-800 font-bold text-sm text-center -translate-x-1/2 -translate-y-1/2"
                                        style={{ top: `${y}%`, left: `${x}%`, transform: `translate(-50%, -50%) rotate(${index * segmentAngle}deg)` }}
                                    >
                                        {reward.value.split(' ').map((word, i) => <div key={i}>{word}</div>)}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-amber-200 rounded-full border-4 border-amber-500 shadow-inner" />
                    </div>
                </div>

                <div className="w-full text-center min-h-[40px]">
                    {resultText && (
                        <p className="font-bold text-lg text-green-600 animate-fade-in">{resultText}</p>
                    )}
                </div>
                
                <div className="w-full flex justify-between items-center">
                    <p className="font-bold text-lg text-orange-900">
                        Spins Left Today: <span className="font-mono text-amber-700">{spinsLeft}</span>
                    </p>
                    <p className="font-bold text-lg text-orange-900">
                        Cost: {isFreeSpin ? <span className="font-mono text-green-600">FREE</span> : <span className="font-mono text-green-600">${spinCost.toLocaleString()}</span>}
                    </p>
                </div>

                <button
                    onClick={handleSpin}
                    disabled={disabled || (!canAfford && !isFreeSpin) || isSpinning || spinsLeft <= 0}
                    className="w-full py-4 text-xl font-bold rounded-lg transition-colors bg-amber-500 text-white hover:bg-amber-600 disabled:bg-orange-100 disabled:text-orange-400"
                >
                    {isSpinning ? "Spinning..." : spinsLeft <= 0 ? "No Spins Left" : (!canAfford && !isFreeSpin) ? "Not Enough Money" : "Spin the Wheel!"}
                </button>
            </div>
        </div>
    );
};

export default WheelOfFortuneModal;

import React from 'react';
import { DiceIcon, CardIcon, StarIcon } from './Icon';

interface GamblingPanelProps {
  onOpenOddsOrEvens: () => void;
  onOpenHigherOrLower: () => void;
  onOpenWheelOfFortune: () => void;
  disabled: boolean;
}

const GamblingButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  colorClasses: string;
  onClick: () => void;
  disabled: boolean;
}> = ({ icon, label, colorClasses, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`group flex items-center gap-4 p-3 bg-amber-100/60 rounded-lg shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed border border-amber-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-amber-200 ${colorClasses}`}
  >
    <div className="p-2 bg-amber-200 rounded-md">
      {icon}
    </div>
    <span className="font-semibold text-amber-800">{label}</span>
  </button>
);


const GamblingPanel: React.FC<GamblingPanelProps> = ({ 
    onOpenOddsOrEvens,
    onOpenHigherOrLower,
    onOpenWheelOfFortune,
    disabled 
}) => {
  return (
    <div className="bg-amber-100/50 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-amber-300">
      <h2 className="text-xl font-bold text-amber-900 border-b border-amber-300 pb-3 mb-4">Casino Games</h2>
      <div className="flex flex-col gap-4">
        <GamblingButton
            icon={<DiceIcon className="h-6 w-6 text-indigo-600" />}
            label="Odds or Evens"
            colorClasses="hover:bg-indigo-100/80 hover:border-indigo-300 focus:ring-indigo-500"
            onClick={onOpenOddsOrEvens}
            disabled={disabled}
        />
        <GamblingButton
            icon={<CardIcon className="h-6 w-6 text-rose-600" />}
            label="Higher or Lower"
            colorClasses="hover:bg-rose-100/80 hover:border-rose-300 focus:ring-rose-500"
            onClick={onOpenHigherOrLower}
            disabled={disabled}
        />
        <GamblingButton
            icon={<StarIcon className="h-6 w-6 text-amber-600" />}
            label="Wheel of Fortune"
            colorClasses="hover:bg-amber-100/80 hover:border-amber-300 focus:ring-amber-500"
            onClick={onOpenWheelOfFortune}
            disabled={disabled}
        />
      </div>
    </div>
  );
};

export default GamblingPanel;

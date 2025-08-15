

import React from 'react';
import { DiceIcon, CardIcon, StarIcon } from './Icon';

interface CasinoPanelProps {
  onOpenOddsOrEvens: () => void;
  onOpenHigherOrLower: () => void;
  onOpenWheelOfFortune: () => void;
  disabled: boolean;
}

const ActionButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; disabled: boolean; iconColorClass?: string; }> = ({ icon, label, onClick, disabled, iconColorClass = 'bg-amber-200 text-amber-700' }) => (
    <button onClick={onClick} disabled={disabled} className="w-full flex items-center gap-4 p-3 bg-amber-100/60 hover:bg-amber-200/80 rounded-lg shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed border border-amber-300">
        <div className={`p-2 rounded-md ${iconColorClass}`}>{icon}</div>
        <span className="font-semibold text-amber-800">{label}</span>
    </button>
);

const CasinoPanel: React.FC<CasinoPanelProps> = (props) => {
  return (
    <div className="bg-amber-100/50 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-amber-300">
      <h2 className="text-xl font-bold text-amber-900 border-b border-amber-300 pb-3 mb-4">Casino</h2>
      <div className="flex flex-col gap-4">
        <ActionButton icon={<DiceIcon className="h-6 w-6" />} label="Odds or Evens" onClick={props.onOpenOddsOrEvens} disabled={props.disabled} iconColorClass="bg-indigo-200 text-indigo-700" />
        <ActionButton icon={<CardIcon className="h-6 w-6" />} label="Higher or Lower" onClick={props.onOpenHigherOrLower} disabled={props.disabled} iconColorClass="bg-rose-200 text-rose-700" />
        <ActionButton icon={<StarIcon className="h-6 w-6" />} label="Wheel of Fortune" onClick={props.onOpenWheelOfFortune} disabled={props.disabled} iconColorClass="bg-amber-200 text-amber-700" />
      </div>
    </div>
  );
};

export default CasinoPanel;
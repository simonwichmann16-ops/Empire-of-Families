


import React from 'react';
import { BuildingOfficeIcon, CogIcon, GarageIcon, HomeModernIcon, PillIcon } from './Icon';

interface OperationsPanelProps {
  onOpenBusiness: () => void;
  onOpenDrugsModal: () => void;
  onOpenProductionModal: () => void;
  onOpenGarageModal: () => void;
  onOpenPropertiesModal: () => void;
  disabled: boolean;
}

const ActionButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; disabled: boolean; iconColorClass?: string; }> = ({ icon, label, onClick, disabled, iconColorClass = 'bg-amber-200 text-amber-700' }) => (
    <button onClick={onClick} disabled={disabled} className="w-full flex items-center gap-4 p-3 bg-amber-100/60 hover:bg-amber-200/80 rounded-lg shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed border border-amber-300">
        <div className={`p-2 rounded-md ${iconColorClass}`}>{icon}</div>
        <span className="font-semibold text-amber-800">{label}</span>
    </button>
);

const OperationsPanel: React.FC<OperationsPanelProps> = (props) => {
  return (
    <div className="bg-amber-100/50 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-amber-300">
      <h2 className="text-xl font-bold text-amber-900 border-b border-amber-300 pb-3 mb-4">Operations</h2>
      <div className="flex flex-col gap-4">
        <ActionButton icon={<BuildingOfficeIcon className="h-6 w-6" />} label="Businesses" onClick={props.onOpenBusiness} disabled={props.disabled} iconColorClass="bg-green-200 text-green-700" />
        <ActionButton icon={<PillIcon className="h-6 w-6" />} label="Drugs & Smuggling" onClick={props.onOpenDrugsModal} disabled={props.disabled} iconColorClass="bg-purple-200 text-purple-700" />
        <ActionButton icon={<CogIcon className="h-6 w-6" />} label="Production" onClick={props.onOpenProductionModal} disabled={props.disabled} iconColorClass="bg-lime-200 text-lime-700" />
        <ActionButton icon={<GarageIcon className="h-6 w-6" />} label="Garage" onClick={props.onOpenGarageModal} disabled={props.disabled} iconColorClass="bg-stone-200 text-stone-700" />
        <ActionButton icon={<HomeModernIcon className="h-6 w-6" />} label="Properties" onClick={props.onOpenPropertiesModal} disabled={props.disabled} iconColorClass="bg-cyan-200 text-cyan-700" />
      </div>
    </div>
  );
};

export default OperationsPanel;
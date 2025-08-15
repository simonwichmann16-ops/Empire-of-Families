

import React from 'react';
import { StorefrontIcon, MapIcon, AirplaneIcon, HandcuffsIcon, HospitalIcon, BankIcon } from './Icon';

interface LocationsPanelProps {
  onOpenShop: () => void;
  onOpenCityMapModal: () => void;
  onOpenTravelModal: () => void;
  onOpenPrisonModal: () => void;
  onOpenHospitalModal: () => void;
  onOpenBankModal: () => void;
  disabled: boolean;
  isJailed: boolean;
}

const ActionButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; disabled: boolean; iconColorClass?: string; }> = ({ icon, label, onClick, disabled, iconColorClass = 'bg-amber-200 text-amber-700' }) => (
    <button onClick={onClick} disabled={disabled} className="w-full flex items-center gap-4 p-3 bg-amber-100/60 hover:bg-amber-200/80 rounded-lg shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed border border-amber-300">
        <div className={`p-2 rounded-md ${iconColorClass}`}>{icon}</div>
        <span className="font-semibold text-amber-800">{label}</span>
    </button>
);

const LocationsPanel: React.FC<LocationsPanelProps> = (props) => {
  return (
    <div className="bg-amber-100/50 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-amber-300">
      <h2 className="text-xl font-bold text-amber-900 border-b border-amber-300 pb-3 mb-4">Locations</h2>
      <div className="flex flex-col gap-4">
        <ActionButton icon={<StorefrontIcon className="h-6 w-6" />} label="Black Market" onClick={props.onOpenShop} disabled={props.disabled} iconColorClass="bg-slate-200 text-slate-700" />
        <ActionButton icon={<BankIcon className="h-6 w-6" />} label="Bank" onClick={props.onOpenBankModal} disabled={props.disabled} iconColorClass="bg-sky-200 text-sky-700" />
        <ActionButton icon={<MapIcon className="h-6 w-6" />} label="City Map" onClick={props.onOpenCityMapModal} disabled={props.disabled} iconColorClass="bg-teal-200 text-teal-700" />
        <ActionButton icon={<AirplaneIcon className="h-6 w-6" />} label="Travel" onClick={props.onOpenTravelModal} disabled={props.disabled} iconColorClass="bg-sky-200 text-sky-700" />
        <ActionButton icon={<HandcuffsIcon className="h-6 w-6" />} label="Prison" onClick={props.onOpenPrisonModal} disabled={props.disabled && !props.isJailed} iconColorClass="bg-gray-300 text-gray-800" />
        <ActionButton icon={<HospitalIcon className="h-6 w-6" />} label="Hospital" onClick={props.onOpenHospitalModal} disabled={props.disabled} iconColorClass="bg-emerald-200 text-emerald-700" />
      </div>
    </div>
  );
};

export default LocationsPanel;
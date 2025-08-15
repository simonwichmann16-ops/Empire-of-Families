
import React, { useState, useEffect } from 'react';
import { Player } from '../types';

interface ActivityPanelProps {
  player: Player;
  harvestableWeed: number;
  onOpenCrimeModal: () => void;
  onOpenVehicleCrimeModal: () => void;
  onOpenHeistModal: () => void;
  onOpenProductionModal: () => void;
  disabled: boolean;
}

const Countdown: React.FC<{ endTime: number | null | undefined }> = ({ endTime }) => {
    const [now, setNow] = useState(Date.now());
    const isCoolingDown = endTime && endTime > now;

    useEffect(() => {
        if (isCoolingDown) {
            const timer = setInterval(() => {
                const newNow = Date.now();
                if (newNow >= endTime) {
                    clearInterval(timer);
                }
                setNow(newNow);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isCoolingDown, endTime]);

    if (!isCoolingDown) {
        return <span className="font-mono text-green-700">Ready</span>;
    }

    const remaining = Math.ceil((endTime - now) / 1000);
    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    const seconds = remaining % 60;

    if (hours > 0) {
        return <span className="font-mono text-amber-700">{`${hours}h ${minutes}m`}</span>;
    }
    if (minutes > 0) {
        return <span className="font-mono text-amber-700">{`${minutes}m ${seconds}s`}</span>;
    }
    return <span className="font-mono text-amber-700">{`${remaining}s`}</span>;
};


const ActivityItem: React.FC<{
    label: string;
    onClick: () => void;
    cooldownEnd?: number | null;
    statusText?: string;
    disabled?: boolean;
}> = ({ label, onClick, cooldownEnd, statusText, disabled }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="w-full text-left p-3 rounded-md transition-colors hover:bg-amber-200/50 focus:outline-none focus:ring-2 focus:ring-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
            <div className="flex justify-between items-baseline">
                <span className="text-amber-800 text-base">{label}</span>
                <div className="flex-grow border-b border-dotted border-amber-400 mx-3"></div>
                <div className="flex-shrink-0 text-base">
                    {typeof cooldownEnd !== 'undefined' ? (
                        <Countdown endTime={cooldownEnd} />
                    ) : (
                        <span className="font-mono text-lime-700">{statusText}</span>
                    )}
                </div>
            </div>
        </button>
    );
};

const ActivityPanel: React.FC<ActivityPanelProps> = ({ player, harvestableWeed, onOpenCrimeModal, onOpenVehicleCrimeModal, onOpenHeistModal, onOpenProductionModal, disabled }) => {

  return (
    <div className="bg-amber-100/50 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-amber-300">
      <h2 className="text-xl font-bold text-amber-900 border-b border-amber-300 pb-3 mb-4">Activities</h2>
      <div className="space-y-2">
        <ActivityItem
            label="Commit a Crime"
            onClick={onOpenCrimeModal}
            cooldownEnd={player.generalCrimeCooldownEnd}
            disabled={disabled}
        />
        <ActivityItem
            label="Vehicle Theft"
            onClick={onOpenVehicleCrimeModal}
            cooldownEnd={player.vehicleCrimeCooldownEnd}
            disabled={disabled}
        />
        <ActivityItem
            label="Heists"
            onClick={onOpenHeistModal}
            cooldownEnd={player.heistCooldownEnd}
            disabled={disabled}
        />
        <ActivityItem
            label="Production"
            onClick={onOpenProductionModal}
            statusText={`${harvestableWeed.toLocaleString()} Weed Harvestable`}
            disabled={disabled}
        />
      </div>
    </div>
  );
};

export default ActivityPanel;
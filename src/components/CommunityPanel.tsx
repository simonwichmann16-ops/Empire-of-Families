

import React from 'react';
import { Player } from '../types';
import { FriendsEnemiesIcon, UserGroupIcon, BuildingLibraryIcon, ShieldCheckIcon, CrownIcon } from './Icon';

interface CommunityPanelProps {
  player: Player;
  onOpenFriendsModal: () => void;
  onOpenOnlineUsersModal: () => void;
  onOpenFamilyListModal: () => void;
  onOpenMyFamilyModal: () => void;
  onOpenCreateFamilyModal: () => void;
  disabled: boolean;
}

const ActionButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; disabled: boolean; sublabel?: string; iconColorClass?: string; }> = ({ icon, label, onClick, disabled, sublabel, iconColorClass = 'bg-amber-200 text-amber-700' }) => (
    <button onClick={onClick} disabled={disabled} className="w-full flex items-center gap-4 p-3 bg-amber-100/60 hover:bg-amber-200/80 rounded-lg shadow-md transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed border border-amber-300">
        <div className={`p-2 rounded-md ${iconColorClass}`}>{icon}</div>
        <div className="text-left">
            <span className="font-semibold text-amber-800">{label}</span>
            {sublabel && <p className="text-xs text-amber-700">{sublabel}</p>}
        </div>
    </button>
);

const CommunityPanel: React.FC<CommunityPanelProps> = ({ player, onOpenFriendsModal, onOpenOnlineUsersModal, onOpenFamilyListModal, onOpenMyFamilyModal, onOpenCreateFamilyModal, disabled }) => {
  return (
    <div className="bg-amber-100/50 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-amber-300">
      <h2 className="text-xl font-bold text-amber-900 border-b border-amber-300 pb-3 mb-4">Community</h2>
      <div className="flex flex-col gap-4">
        <ActionButton icon={<FriendsEnemiesIcon className="h-6 w-6" />} label="Friends & Enemies" onClick={onOpenFriendsModal} disabled={disabled} iconColorClass="bg-pink-200 text-pink-700" />
        <ActionButton icon={<UserGroupIcon className="h-6 w-6" />} label="Online Users" onClick={onOpenOnlineUsersModal} disabled={disabled} iconColorClass="bg-cyan-200 text-cyan-700" />
        <ActionButton icon={<BuildingLibraryIcon className="h-6 w-6" />} label="List of Families" onClick={onOpenFamilyListModal} disabled={disabled} iconColorClass="bg-purple-200 text-purple-700" />
        {player.familyName ? (
             <ActionButton icon={<ShieldCheckIcon className="h-6 w-6" />} label="My Family" sublabel={player.familyName} onClick={onOpenMyFamilyModal} disabled={disabled} iconColorClass="bg-amber-200 text-amber-700" />
        ) : (
             <ActionButton icon={<CrownIcon className="h-6 w-6" />} label="Create Family" onClick={onOpenCreateFamilyModal} disabled={disabled} iconColorClass="bg-amber-200 text-amber-700" />
        )}
      </div>
    </div>
  );
};

export default CommunityPanel;


import React, { useState } from 'react';
import { Player, StockState } from '../types';
import { RANKS, SHOP_ITEMS, BUSINESSES, LOCATIONS } from '../constants';
import { IdentificationIcon, LevelIcon, MoneyIcon, PowerIcon, RespectIcon, AirplaneIcon, MailIcon, ClipboardDocumentListIcon, HomeModernIcon } from './Icon';

interface ProfileModalProps {
  player: Player;
  stocks: StockState[];
  onClose: () => void;
  onOpenMail: () => void;
  onOpenMissions: () => void;
  onUpdateProfileDescription: (description: string) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ player, stocks, onClose, onOpenMail, onOpenMissions, onUpdateProfileDescription }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [description, setDescription] = useState(player.profileDescription);

    const currentRankIndex = RANKS.findIndex(r => r.name === player.rank);
    const nextRank = RANKS[currentRankIndex + 1];

    const inventoryValue = Object.entries(player.inventory).reduce((sum, [itemId, quantity]) => {
        const item = SHOP_ITEMS.find(i => i.id === itemId);
        return sum + ((item?.cost || 0) * quantity);
    }, 0);

    const businessValue = player.businesses.reduce((sum, businessId) => {
        const business = BUSINESSES.find(b => b.id === businessId);
        return sum + (business?.cost || 0);
    }, 0);
    
    const portfolioValue = Object.entries(player.portfolio).reduce((sum, [stockId, quantity]) => {
        const stock = stocks.find(s => s.id === stockId);
        return sum + ((stock?.price || 0) * quantity);
    }, 0);

    const netWorth = player.money + player.bank + inventoryValue + businessValue + portfolioValue;
    const currentLocationName = LOCATIONS.find(loc => loc.id === player.location)?.name || 'Unknown';
    const hasUnreadMail = player.mail.some(m => !m.isRead);
    const hasMissionToClaim = !!player.completedUnclaimedMissionId;
    const hasUnseenActiveMission = !!player.activeMissionId && !player.hasViewedActiveMission;
    const missionHasNotification = hasMissionToClaim || hasUnseenActiveMission;

  const StatItem: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
    <div className="flex items-center justify-between p-3 bg-orange-50/60 rounded-lg">
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-semibold text-orange-800">{label}</span>
      </div>
      <div className="flex-grow border-b border-dotted border-orange-300 mx-3"></div>
      <span className="font-mono text-lg text-orange-950 flex-shrink-0">{value}</span>
    </div>
  );
  
  const handleSaveDescription = () => {
    if (description.trim()) {
        onUpdateProfileDescription(description.trim());
        setIsEditing(false);
    }
  };

  return (
    <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-modal-title"
    >
      <div 
        className="bg-orange-50/95 backdrop-blur-md border border-orange-200 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-lg m-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-orange-200 pb-4 mb-4">
            <h2 id="profile-modal-title" className="text-2xl font-bold text-amber-600">Player Profile</h2>
            <div className="flex items-center gap-4">
                 <button onClick={onOpenMail} className="relative text-orange-600 hover:text-amber-600 transition-colors" aria-label="Open Mailbox">
                     <MailIcon className="h-7 w-7"/>
                     {hasUnreadMail && <div className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-orange-50"></div>}
                 </button>
                 <button onClick={onOpenMissions} className="relative text-orange-600 hover:text-sky-600 transition-colors" aria-label="Open Missions">
                    <ClipboardDocumentListIcon className="h-7 w-7"/>
                    {missionHasNotification && <div className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-orange-50"></div>}
                 </button>
                <button 
                    onClick={onClose} 
                    className="text-orange-600 text-3xl leading-none hover:text-orange-900 transition-colors"
                    aria-label="Close profile modal"
                >&times;</button>
            </div>
        </div>
        <div className="overflow-y-auto space-y-4 pr-2 -mr-4">
            <div className="p-4 bg-orange-100/50 border border-orange-200 rounded-lg flex items-start gap-4">
                <div className="p-3 bg-orange-50 rounded-md text-amber-500 flex-shrink-0">
                    <IdentificationIcon className="h-10 w-10" />
                </div>
                <div className="flex-grow">
                    <h3 className="text-2xl font-bold text-orange-950">You</h3>
                     {isEditing ? (
                        <div className="flex flex-col gap-2 mt-1">
                            <textarea 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full h-16 p-2 bg-white border border-orange-300 rounded-md text-orange-800 text-sm"
                                maxLength={100}
                                aria-label="Edit profile description"
                            />
                            <div className="flex justify-end gap-2">
                                <button onClick={() => { setIsEditing(false); setDescription(player.profileDescription); }} className="px-3 py-1 bg-gray-200 rounded-md text-sm hover:bg-gray-300">Cancel</button>
                                <button onClick={handleSaveDescription} className="px-3 py-1 bg-amber-600 text-white rounded-md text-sm hover:bg-amber-700">Save</button>
                            </div>
                        </div>
                    ) : (
                         <div className="flex justify-between items-start">
                            <p className="text-orange-700 italic flex-grow">{player.profileDescription}</p>
                            <button onClick={() => setIsEditing(true)} className="text-xs text-blue-600 hover:underline flex-shrink-0 ml-4 font-semibold">Edit</button>
                         </div>
                    )}
                </div>
            </div>
          
            <StatItem icon={<LevelIcon className="h-6 w-6 text-amber-500" />} label="Current Rank" value={player.rank} />
            <StatItem icon={<RespectIcon className="h-6 w-6 text-orange-500" />} label="Total Respect" value={player.respect.toLocaleString()} />
            <StatItem icon={<PowerIcon className="h-6 w-6 text-yellow-500" />} label="Power Level" value={player.power.toLocaleString()} />
            <StatItem icon={<AirplaneIcon className="h-6 w-6 text-sky-500" />} label="Current Location" value={currentLocationName} />

            <div className="pt-4 border-t border-orange-200">
                <h3 className="text-xl font-bold text-orange-900 mb-2">Assets</h3>
                <StatItem icon={<MoneyIcon className="h-6 w-6 text-green-600" />} label="Total Net Worth" value={`$${netWorth.toLocaleString()}`} />
                <StatItem icon={<HomeModernIcon className="h-6 w-6 text-cyan-600" />} label="Total Land Owned" value={`${player.landOwned.toLocaleString()} m³`} />
            </div>

             {nextRank && (
                 <div className="text-center text-sm text-orange-600 pt-4">
                     <p>Next Rank: <span className="font-bold text-orange-800">{nextRank.name}</span> at <span className="font-bold text-orange-800">{nextRank.xpThreshold.toLocaleString()}</span> XP.</p>
                 </div>
             )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
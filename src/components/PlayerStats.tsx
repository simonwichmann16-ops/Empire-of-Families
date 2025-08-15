import React from 'react';
import { Player } from '../types';
import { HeartIcon, MoneyIcon, RespectIcon, PowerIcon, LevelIcon, IdentificationIcon, BrainIcon, BatteryIcon, ArrowLeftStartOnRectangleIcon, MapIcon } from './Icon';
import { RANKS } from '../constants';

interface PlayerStatsProps {
  player: Player;
  effectiveMaxStamina: number;
  username: string | null;
  locationName: string;
  onRankClick: () => void;
  onOpenProfileModal: () => void;
  onOpenBankModal: () => void;
  onOpenSkillsModal: () => void;
  onOpenPowerModal: () => void;
  onLogout: () => void;
  justLoggedIn: boolean;
}

const StatBar: React.FC<{ value: number; max: number; color: string }> = ({ value, max, color }) => (
  <div className="w-full bg-amber-300/50 rounded-full h-2.5">
    <div className={`${color} h-2.5 rounded-full`} style={{ width: `${max > 0 ? (value / max) * 100 : 100}%`, transition: 'width 0.5s ease-in-out' }}></div>
  </div>
);

const PlayerStats: React.FC<PlayerStatsProps> = ({ player, effectiveMaxStamina, username, locationName, onRankClick, onOpenProfileModal, onOpenBankModal, onOpenSkillsModal, onOpenPowerModal, onLogout, justLoggedIn }) => {
  const StatDisplay: React.FC<{ 
    icon: React.ReactNode; 
    label: string; 
    value: React.ReactNode; 
    colorClass: string; 
    bar?: {current: number, max: number, color: string};
    onClick?: () => void;
  }> = ({ icon, label, value, colorClass, bar, onClick }) => {
    const content = (
        <>
            <div className="flex items-center">
                <div className="flex items-center gap-3 flex-shrink-0">
                    <div className={`p-2 bg-amber-200 rounded-md ${colorClass}`}>{icon}</div>
                    <span className="font-semibold text-amber-800">{label}</span>
                </div>
                <div className="flex-grow border-b border-dotted border-amber-400 mx-3"></div>
                <div className="flex-shrink-0">{value}</div>
            </div>
            {bar && <div className="mt-2"><StatBar value={bar.current} max={bar.max} color={bar.color} /></div>}
        </>
    );

    if (onClick) {
        return (
            <div
                onClick={onClick}
                className="py-1 rounded-lg cursor-pointer hover:bg-amber-200/60 transition-colors -mx-2 px-2"
                role="button"
                aria-label={`Open ${label}`}
            >
                {content}
            </div>
        );
    }
    
    return <div className="py-1">{content}</div>;
    };

  const currentRankIndex = RANKS.findIndex(r => r.name === player.rank);
  const currentRank = RANKS[currentRankIndex];
  const nextRank = RANKS[currentRankIndex + 1];
  
  const hasUnreadMail = player.mail.some(m => !m.isRead);
  const hasMissionToClaim = !!player.completedUnclaimedMissionId;
  const hasUnseenActiveMission = !!player.activeMissionId && !player.hasViewedActiveMission;
  const hasNotification = hasUnreadMail || hasMissionToClaim || hasUnseenActiveMission;

  let xpProgress = 0;
  let xpNeededForNextRank = 0;
  let progressText = '';

  if (nextRank) {
    const xpForCurrentRank = currentRank.xpThreshold;
    xpProgress = player.criminalXP - xpForCurrentRank;
    xpNeededForNextRank = nextRank.xpThreshold - xpForCurrentRank;
    progressText = `${xpProgress.toLocaleString()} / ${xpNeededForNextRank.toLocaleString()} XP`;
  } else {
    xpProgress = 1;
    xpNeededForNextRank = 1;
    progressText = 'MAX RANK';
  }
  
  return (
    <div className="bg-amber-100/50 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-amber-300 flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between items-start pb-4 border-b border-amber-300">
            {/* Left side: Profile and Skills */}
            <div className="flex flex-col gap-3">
                {/* Clickable Profile Area */}
                <div 
                    role="button"
                    aria-label="Open Profile"
                    onClick={onOpenProfileModal}
                    className={`relative group flex items-center gap-2 cursor-pointer p-2 -m-2 rounded-lg hover:bg-amber-300/60 transition-colors ${justLoggedIn && hasNotification ? 'animate-pulse-once' : ''}`}
                >
                    {hasNotification && (
                        <div className="absolute top-1 left-1 h-3 w-3 bg-red-500 rounded-full border-2 border-amber-200 group-hover:border-amber-300/60 transition-colors"></div>
                    )}
                    <IdentificationIcon className="h-8 w-8 text-amber-700 flex-shrink-0" />
                    <h2 className="text-lg font-light text-amber-900 group-hover:text-amber-950 transition-colors">{username}</h2>
                </div>
                
                {/* Skills Button */}
                <button
                    onClick={onOpenSkillsModal}
                    className="flex items-center gap-2 bg-amber-200 hover:bg-amber-300 text-amber-800 font-bold py-2 px-3 rounded-lg shadow-md transition-all duration-200 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 focus:ring-offset-amber-200"
                >
                    <BrainIcon className="h-5 w-5 text-purple-600" />
                    <span className="text-sm">Skills ({player.skillPoints})</span>
                </button>
            </div>
            
            {/* Right side: Logout Button */}
            <button
                onClick={onLogout}
                className="flex items-center gap-2 bg-amber-200 hover:bg-red-200 text-amber-800 hover:text-red-800 font-semibold py-2 px-3 rounded-lg shadow-md transition-all duration-200 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-amber-200 text-sm"
                aria-label="Log out"
            >
                <ArrowLeftStartOnRectangleIcon className="h-5 w-5" />
                <span>Log out</span>
            </button>
        </div>
        
        {/* Status sub-header */}
        <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wider -mt-2">Status</h3>

      <StatDisplay 
        icon={<HeartIcon className="h-6 w-6" />} 
        label="Health" 
        value={<div className="text-lg font-semibold">{`${player.hp} / 100`}</div>}
        colorClass="text-red-500"
      />
      <StatDisplay 
        icon={<BatteryIcon className="h-6 w-6" />} 
        label="Stamina" 
        value={<div className="text-lg font-semibold">{`${player.stamina} / ${effectiveMaxStamina}`}</div>}
        colorClass="text-sky-600"
      />
      
      <div className="h-px w-full bg-amber-300/60 my-2"></div>
      <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wider -mt-2">Assets & Influence</h3>

      <StatDisplay 
        icon={<MoneyIcon className="h-6 w-6" />} 
        label="Money"
        value={
          <div className="text-right">
            <div className="text-lg font-semibold">${player.money.toLocaleString()}</div>
            <p className="text-xs text-amber-700 font-mono">(Bank: ${player.bank.toLocaleString()})</p>
          </div>
        }
        colorClass="text-green-700"
        onClick={onOpenBankModal}
      />
      
      <div
        onClick={onRankClick}
        className="py-1 rounded-lg cursor-pointer hover:bg-amber-200/60 transition-colors -mx-2 px-2"
        role="button"
        aria-label="Open Ranks"
      >
        <div className="flex items-center">
            <div className="flex items-center gap-3 flex-shrink-0">
                <div className="p-2 bg-amber-200 rounded-md text-amber-700"><LevelIcon className="h-6 w-6" /></div>
                <span className="font-semibold text-amber-800">Rank</span>
            </div>
            <div className="flex-grow border-b border-dotted border-amber-400 mx-3"></div>
            <div className="text-lg font-semibold flex-shrink-0">{player.rank}</div>
        </div>
        <div className="mt-2 text-center text-xs text-amber-800">
            <StatBar value={xpProgress} max={xpNeededForNextRank > 0 ? xpNeededForNextRank : 1} color="bg-amber-600" />
            <p className="mt-1 font-mono">{progressText}</p>
        </div>
      </div>
      
      <StatDisplay 
        icon={<PowerIcon className="h-6 w-6" />} 
        label="Power" 
        value={<div className="text-lg font-semibold">{player.power.toLocaleString()}</div>}
        colorClass="text-yellow-600"
        onClick={onOpenPowerModal}
      />
      
      <StatDisplay 
        icon={<RespectIcon className="h-6 w-6" />} 
        label="Respect" 
        value={<div className="text-lg font-semibold">{player.respect.toLocaleString()}</div>}
        colorClass="text-amber-700"
      />

      <StatDisplay 
        icon={<MapIcon className="h-6 w-6" />} 
        label="Location" 
        value={<div className="text-lg font-semibold">{locationName}</div>}
        colorClass="text-teal-700"
      />
    </div>
  );
};

export default PlayerStats;
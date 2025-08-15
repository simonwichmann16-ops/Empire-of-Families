

import React, { useState, useEffect } from 'react';
import { MockUser, Player } from '../types';
import { IdentificationIcon, PowerIcon, RespectIcon, HandThumbUpIcon, ShieldCheckIcon, MoneyIcon, UserPlusIcon, HomeModernIcon } from './Icon';
import { getWealthTier } from '../utils/textFormatters';

interface UserProfileModalProps {
  user: MockUser | null;
  player: Player;
  currentUser: string | null;
  onClose: () => void;
  onRespect: (userId: string) => void;
  onFriendRequest: (userId: string) => void;
  onBanUser: (user: MockUser) => void;
  onUnbanUser: (userId: string, username: string) => void;
  respectCooldownEnd: number | undefined;
}

const CountdownTimer: React.FC<{ endTime: number }> = ({ endTime }) => {
    const [timeLeft, setTimeLeft] = useState(Math.max(0, endTime - Date.now()));

    useEffect(() => {
        const intervalId = setInterval(() => {
            const newTimeLeft = Math.max(0, endTime - Date.now());
            setTimeLeft(newTimeLeft);
            if (newTimeLeft <= 0) {
                clearInterval(intervalId);
            }
        }, 1000);
        return () => clearInterval(intervalId);
    }, [endTime]);

    if (timeLeft <= 0) return <span>Ready</span>;

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    if (hours > 0) return <span>{`${hours}h ${minutes}m left`}</span>;
    if (minutes > 0) return <span>{`${minutes}m ${seconds}s left`}</span>;

    return <span>{`${seconds}s left`}</span>;
};


const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, player, currentUser, onClose, onRespect, onFriendRequest, onBanUser, onUnbanUser, respectCooldownEnd }) => {
  if (!user) return null;

  const isRespectOnCooldown = respectCooldownEnd ? respectCooldownEnd > Date.now() : false;
  const isFriend = player.friends.includes(user.id);
  const isRequestSent = player.sentFriendRequests.includes(user.id);
  const hasIncomingRequest = player.friendRequests.some(req => req.fromUserId === user.id);
  const isDev = currentUser === 'Dev';
  const isBanned = user.banned?.isBanned;

  const StatItem: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
    <div className="flex items-center justify-between p-3 bg-orange-50/60 rounded-lg">
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-semibold text-orange-800">{label}</span>
      </div>
      <span className="font-mono text-lg text-orange-950">{value}</span>
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-profile-modal-title"
    >
      <div
        className="bg-orange-50/95 backdrop-blur-md border border-orange-200 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-md m-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-orange-200 pb-4 mb-4">
          <h2 id="user-profile-modal-title" className="text-2xl font-bold text-amber-600">User Profile</h2>
          <button
            onClick={onClose}
            className="text-orange-600 text-3xl leading-none hover:text-orange-900 transition-colors"
            aria-label="Close user profile"
          >&times;</button>
        </div>
        <div className="overflow-y-auto space-y-4 pr-2 -mr-4">
          <div className="p-4 bg-orange-100/50 border border-orange-200 rounded-lg flex items-center gap-4">
            <div className="p-3 bg-orange-50 rounded-full text-amber-500">
              <IdentificationIcon className="h-10 w-10" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-orange-950">{user.name}</h3>
              <p className="text-orange-700">A player in the criminal underworld.</p>
            </div>
          </div>
          
          <StatItem icon={<PowerIcon className="h-6 w-6 text-yellow-500" />} label="Power Level" value={user.power.toLocaleString()} />
          <StatItem icon={<RespectIcon className="h-6 w-6 text-orange-500" />} label="Respect" value={user.respect.toLocaleString()} />
          <StatItem icon={<MoneyIcon className="h-6 w-6 text-green-600" />} label="Financial Status" value={getWealthTier(user.money)} />
          <StatItem icon={<HomeModernIcon className="h-6 w-6 text-cyan-500" />} label="Land Owned" value={`${user.landOwned.toLocaleString()} m³`} />
          <StatItem icon={<ShieldCheckIcon className="h-6 w-6 text-blue-500" />} label="Family" value={user.familyName || 'Not in a family'} />
          
          <div className="pt-4 mt-4 border-t border-orange-200 grid grid-cols-2 gap-4">
             <button
                onClick={() => onRespect(user.id)}
                disabled={isRespectOnCooldown}
                className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-orange-100"
            >
                <HandThumbUpIcon className="h-5 w-5" />
                <span>{isRespectOnCooldown ? <CountdownTimer endTime={respectCooldownEnd!} /> : 'Respect'}</span>
            </button>
            <button
                onClick={() => onFriendRequest(user.id)}
                disabled={isFriend || isRequestSent || hasIncomingRequest}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-orange-100"
            >
                <UserPlusIcon className="h-5 w-5" />
                <span>{isFriend ? 'Friends' : isRequestSent ? 'Request Sent' : hasIncomingRequest ? 'Check Requests' : 'Add Friend'}</span>
            </button>
          </div>
          {isDev && user.name !== 'Dev' && (
            <div className="pt-4 mt-4 border-t-2 border-dashed border-red-300">
                <h3 className="text-center font-bold text-red-800 mb-2">Admin Actions</h3>
                {isBanned ? (
                    <div className="text-center">
                        <p className="text-sm text-red-600 mb-2">
                            Banned for: {user.banned.reason}
                        </p>
                        <button onClick={() => onUnbanUser(user.id, user.name)} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">
                            Unban User
                        </button>
                    </div>
                ) : (
                    <button onClick={() => onBanUser(user)} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
                        Ban User
                    </button>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
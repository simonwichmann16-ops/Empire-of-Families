

import React, { useState, useMemo } from 'react';
import { IdentificationIcon, PowerIcon, DaggerIcon, MailIcon, RespectIcon, MoneyIcon } from './Icon';
import { MockUser, Player } from '../types';
import { getWealthTier } from '../utils/textFormatters';


interface OnlineUsersModalProps {
  onlineUsers: MockUser[];
  player: Player;
  onClose: () => void;
  onOpenProfile: (user: MockUser) => void;
  onAttack: (user: MockUser) => void;
  onMessage: (user: MockUser) => void;
}

type SortKey = 'power' | 'respect' | 'money';
type FilterKey = 'online' | 'offline' | 'all';

const OnlineUsersModal: React.FC<OnlineUsersModalProps> = ({ onlineUsers, player, onClose, onOpenProfile, onAttack, onMessage }) => {
  const [sortBy, setSortBy] = useState<SortKey>('power');
  const [filterBy, setFilterBy] = useState<FilterKey>('online');

  const filteredUsers = useMemo(() => {
    const users = onlineUsers.filter(u => u.name !== 'Dev');
    if (filterBy === 'online') {
      return users.filter(u => u.isNpc);
    }
    if (filterBy === 'offline') {
      return users.filter(u => !u.isNpc);
    }
    return users; // 'all'
  }, [onlineUsers, filterBy]);

  const sortedUsers = React.useMemo(() => {
    const users = [...filteredUsers];
    return users.sort((a, b) => {
        if (sortBy === 'money') {
            return b.money - a.money;
        } else if (sortBy === 'respect') {
            return b.respect - a.respect;
        }
        return b.power - a.power; // default power
    });
  }, [filteredUsers, sortBy]);
  
  const SortTabButton: React.FC<{ label: string; sortKey: SortKey; icon: React.ReactNode }> = ({ label, sortKey, icon }) => (
    <button
        onClick={() => setSortBy(sortKey)}
        className={`flex items-center gap-2 px-4 py-2 font-bold text-sm rounded-t-md transition-colors ${
            sortBy === sortKey ? 'bg-orange-100/50 text-orange-800' : 'bg-transparent text-orange-600 hover:bg-orange-100/30'
        }`}
    >
        {icon}
        {label}
    </button>
  );
  
  const FilterTabButton: React.FC<{ label: string; filterKey: FilterKey; }> = ({ label, filterKey }) => (
    <button
        onClick={() => setFilterBy(filterKey)}
        className={`px-4 py-2 font-bold text-sm rounded-t-md transition-colors ${
            filterBy === filterKey ? 'bg-orange-100/50 text-orange-800' : 'bg-transparent text-orange-600 hover:bg-orange-100/30'
        }`}
    >
        {label}
    </button>
  );

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="online-users-modal-title"
    >
      <div
        className="bg-orange-50/95 backdrop-blur-md border border-orange-200 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-2xl m-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-orange-200 pb-4 mb-1">
          <h2 id="online-users-modal-title" className="text-2xl font-bold text-amber-600">User List</h2>
          <button
            onClick={onClose}
            className="text-orange-600 text-3xl leading-none hover:text-orange-900 transition-colors"
            aria-label="Close modal"
          >&times;</button>
        </div>

        <div className="flex justify-between border-b border-orange-200">
            <div className="flex">
                <SortTabButton label="Power" sortKey="power" icon={<PowerIcon className="h-4 w-4" />} />
                <SortTabButton label="Respect" sortKey="respect" icon={<RespectIcon className="h-4 w-4" />} />
                <SortTabButton label="Wealth" sortKey="money" icon={<MoneyIcon className="h-4 w-4" />} />
            </div>
            <div className="flex">
                <FilterTabButton label="Online" filterKey="online" />
                <FilterTabButton label="Offline" filterKey="offline" />
                <FilterTabButton label="All Players" filterKey="all" />
            </div>
        </div>

        <div className="overflow-y-auto space-y-3 pr-2 -mr-4 flex-grow pt-4">
          <ul className="space-y-3">
            {sortedUsers.map(user => {
              const canAttack = user.locationId === player.location;
              return (
                <li 
                  key={user.id} 
                  className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-orange-50/70 rounded-lg"
                >
                  <div 
                      className="flex items-center gap-4 cursor-pointer flex-grow"
                      onClick={() => onOpenProfile(user)}
                      role="button"
                      aria-label={`View profile for ${user.name}`}
                  >
                    <div className="p-2 bg-orange-100 rounded-full text-amber-500">
                      <IdentificationIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-900">{user.name}</h4>
                      <div className="flex items-center gap-4 text-xs text-orange-700">
                        <span>{user.rank}</span>
                        <div className="flex items-center gap-1.5 font-mono w-40">
                          {sortBy === 'power' && <><PowerIcon className="h-4 w-4 text-yellow-500" /><span>{user.power.toLocaleString()} Power</span></>}
                          {sortBy === 'respect' && <><RespectIcon className="h-4 w-4 text-orange-500" /><span>{user.respect.toLocaleString()} Respect</span></>}
                          {sortBy === 'money' && <><MoneyIcon className="h-4 w-4 text-green-500" /><span>{getWealthTier(user.money)}</span></>}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => onMessage(user)} className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-md transition-colors bg-sky-600 text-white hover:bg-sky-700">
                      <MailIcon className="h-4 w-4" />
                      <span>Message</span>
                    </button>
                    <button 
                      onClick={() => onAttack(user)} 
                      disabled={!canAttack}
                      title={!canAttack ? `You must be in the same country to attack.` : 'Attack user'}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-md transition-colors bg-red-600 text-white hover:bg-red-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                      <DaggerIcon className="h-4 w-4" />
                      <span>Attack</span>
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OnlineUsersModal;

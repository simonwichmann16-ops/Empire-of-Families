
import React, { useState, useMemo } from 'react';
import { Player, MockUser, FriendRequest, Family } from '../types';
import { FriendsEnemiesIcon, UserGroupIcon, InboxIcon, DaggerIcon, UserMinusIcon, UserPlusIcon, ShieldCheckIcon } from './Icon';

interface FriendsModalProps {
  player: Player;
  onlineUsers: MockUser[];
  families: Family[];
  onClose: () => void;
  onAcceptFriendRequest: (request: FriendRequest) => void;
  onDeclineFriendRequest: (request: FriendRequest) => void;
  onRemoveFriend: (userId: string) => void;
  onAddEnemy: (userId: string) => void;
  onRemoveEnemy: (userId: string) => void;
}

const FriendsModal: React.FC<FriendsModalProps> = ({ player, onlineUsers, families, onClose, onAcceptFriendRequest, onDeclineFriendRequest, onRemoveFriend, onAddEnemy, onRemoveEnemy }) => {
  const [activeTab, setActiveTab] = useState<'friends' | 'enemies' | 'requests'>('friends');
  const [addUserInput, setAddUserInput] = useState('');

  const friends = onlineUsers.filter(u => player.friends.includes(u.id));

  const effectiveEnemies = useMemo(() => {
    const enemyIds = new Set(player.enemies);
    
    const myFamily = families.find(f => f.name === player.familyName);
    if (myFamily && myFamily.rivals.length > 0) {
        const rivalFamilyIds = new Set(myFamily.rivals);
        const rivalMembers = onlineUsers.filter(u => u.familyName && families.find(f => f.name === u.familyName && rivalFamilyIds.has(f.id)));
        rivalMembers.forEach(member => enemyIds.add(member.id));
    }
    
    return Array.from(enemyIds);
  }, [player.enemies, player.familyName, families, onlineUsers]);

  const enemies = onlineUsers.filter(u => effectiveEnemies.includes(u.id));
  
  const handleAddEnemy = () => {
      const userToAdd = onlineUsers.find(u => u.name.toLowerCase() === addUserInput.toLowerCase());
      if (userToAdd) {
          onAddEnemy(userToAdd.id);
          setAddUserInput('');
      } else {
          alert('User not found.');
      }
  };

  const TabButton: React.FC<{ label: string; tabName: 'friends' | 'enemies' | 'requests'; count?: number }> = ({ label, tabName, count }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`relative flex items-center gap-2 px-4 py-2 font-bold text-lg rounded-t-md transition-colors ${
        activeTab === tabName ? 'bg-orange-50/50 text-amber-700' : 'bg-transparent text-orange-600 hover:bg-orange-100/50'
      }`}
    >
      {label}
      {count > 0 && (
        <div className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-orange-50/50" />
      )}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in" onClick={onClose} role="dialog">
      <div className="bg-orange-50/95 backdrop-blur-md border border-orange-200 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-2xl m-4 max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center border-b border-orange-200 pb-4 mb-1">
          <h2 className="text-2xl font-bold text-amber-600">Friends & Enemies</h2>
          <button onClick={onClose} className="text-orange-600 text-3xl leading-none hover:text-orange-900">&times;</button>
        </div>

        <div className="flex border-b border-orange-200 mb-4">
          <TabButton label="Friends" tabName="friends" />
          <TabButton label="Enemies" tabName="enemies" />
          <TabButton label="Requests" tabName="requests" count={player.friendRequests.length} />
        </div>

        <div className="overflow-y-auto pr-2 -mr-4 flex-grow">
          {activeTab === 'friends' && (
            <div>
              {friends.length > 0 ? (
                <ul className="space-y-2">
                  {friends.map(friend => (
                    <li key={friend.id} className="flex items-center justify-between p-2 bg-green-50/50 rounded-md">
                      <span className="font-semibold text-green-900">{friend.name}</span>
                      <button onClick={() => onRemoveFriend(friend.id)} className="p-1 text-red-600 hover:text-red-800"><UserMinusIcon className="w-5 h-5"/></button>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-center text-orange-600 py-4">You have no friends yet.</p>}
            </div>
          )}
          {activeTab === 'enemies' && (
            <div>
                 <div className="flex gap-2 mb-4">
                    <input type="text" value={addUserInput} onChange={(e) => setAddUserInput(e.target.value)} placeholder="Username to add as enemy..." className="flex-grow p-2 border border-orange-300 rounded-md"/>
                    <button onClick={handleAddEnemy} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Add</button>
                </div>
              {enemies.length > 0 ? (
                <ul className="space-y-2">
                  {enemies.map(enemy => {
                    const isFamilyRival = !player.enemies.includes(enemy.id);
                    return (
                        <li key={enemy.id} className="flex items-center justify-between p-2 bg-red-50/50 rounded-md">
                          <div className="flex items-center gap-2">
                            {isFamilyRival && <ShieldCheckIcon className="w-5 h-5 text-red-700" title="Family Rival"/>}
                            <span className="font-semibold text-red-900">{enemy.name}</span>
                          </div>
                          <button onClick={() => onRemoveEnemy(enemy.id)} disabled={isFamilyRival} className="p-1 text-gray-500 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed">
                              <UserMinusIcon className="w-5 h-5"/>
                          </button>
                        </li>
                    );
                  })}
                </ul>
              ) : <p className="text-center text-orange-600 py-4">You have no enemies.</p>}
            </div>
          )}
          {activeTab === 'requests' && (
            <div>
              {player.friendRequests.length > 0 ? (
                <ul className="space-y-2">
                  {player.friendRequests.map(req => (
                    <li key={req.fromUserId} className="flex items-center justify-between p-2 bg-yellow-50/50 rounded-md">
                      <span className="font-semibold text-yellow-900">{req.fromUserName}</span>
                      <div className="flex gap-2">
                         <button onClick={() => onAcceptFriendRequest(req)} className="p-1 text-green-600 hover:text-green-800"><UserPlusIcon className="w-6 h-6"/></button>
                         <button onClick={() => onDeclineFriendRequest(req)} className="p-1 text-red-600 hover:text-red-800"><UserMinusIcon className="w-6 h-6"/></button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <p className="text-center text-orange-600 py-4">You have no pending friend requests.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsModal;
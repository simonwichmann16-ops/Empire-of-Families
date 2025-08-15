


import React, { useState } from 'react';
import { Family, Player, MockUser } from '../types';
import { BuildingLibraryIcon, PowerIcon, CrownIcon, UserGroupIcon, IdentificationIcon, UserPlusIcon } from './Icon';

interface FamilyProfileModalProps {
  family: Family | null;
  onlineUsers: MockUser[];
  player: Player;
  onClose: () => void;
  onUpdateDescription: (familyId: string, description: string) => void;
  onJoinRequest: (familyId: string) => void;
}

const FamilyProfileModal: React.FC<FamilyProfileModalProps> = ({ family, onlineUsers, player, onClose, onUpdateDescription, onJoinRequest }) => {
  if (!family) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(family.description);

  const members = onlineUsers.filter(u => u.familyName === family.name);
  const totalPower = members.reduce((sum, member) => sum + member.power, 0);
  const don = members.find(m => m.id === family.donId) || { name: 'Unknown' };
  
  const isPlayerDon = player.familyName === family.name && player.familyRole === 'Don';
  const canRequestToJoin = !player.familyName;
  const hasSentRequest = player.sentFamilyJoinRequest === family.id;

  const handleSave = () => {
      onUpdateDescription(family.id, description);
      setIsEditing(false);
  }

  return (
    <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="family-profile-modal-title"
    >
      <div 
        className="bg-orange-50/95 backdrop-blur-md border border-orange-200 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-2xl m-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-orange-200 pb-4 mb-4">
          <h2 id="family-profile-modal-title" className="text-2xl font-bold text-amber-600">The {family.name} Family</h2>
          <button 
            onClick={onClose} 
            className="text-orange-600 text-3xl leading-none hover:text-orange-900 transition-colors"
            aria-label="Close modal"
          >&times;</button>
        </div>
        
        <div className="overflow-y-auto space-y-4 pr-2 -mr-4 flex-grow">
          {/* Header */}
          <div className="p-4 bg-orange-100/50 border border-orange-200 rounded-lg">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-lg text-orange-800">
                    <CrownIcon className="h-6 w-6 text-yellow-600"/>
                    <span className="font-semibold">Don:</span>
                    <span>{don.name}</span>
                </div>
                <div className="flex items-center gap-2 text-lg text-orange-800">
                    <UserGroupIcon className="h-6 w-6 text-blue-600"/>
                    <span className="font-semibold">Members:</span>
                    <span>{members.length}</span>
                </div>
                <div className="flex items-center gap-2 text-lg text-orange-800">
                    <PowerIcon className="h-6 w-6 text-red-600"/>
                    <span className="font-semibold">Total Power:</span>
                    <span>{totalPower.toLocaleString()}</span>
                </div>
            </div>
          </div>
          
          {/* Description */}
          <div className="p-4 bg-orange-100/50 border border-orange-200 rounded-lg">
            <h3 className="font-bold text-lg text-orange-900 mb-2">Family Description</h3>
            {isEditing ? (
                <div className="flex flex-col gap-2">
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full h-24 p-2 bg-white border border-orange-300 rounded-md text-orange-800"
                        maxLength={200}
                    />
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setIsEditing(false)} className="px-3 py-1 bg-gray-200 rounded-md text-sm">Cancel</button>
                        <button onClick={handleSave} className="px-3 py-1 bg-amber-600 text-white rounded-md text-sm">Save</button>
                    </div>
                </div>
            ) : (
                 <div className="flex justify-between items-start">
                    <p className="text-orange-700 italic">{family.description}</p>
                    {isPlayerDon && (
                        <button onClick={() => setIsEditing(true)} className="text-xs text-blue-600 hover:underline flex-shrink-0 ml-4">Edit</button>
                    )}
                 </div>
            )}
          </div>

          {/* Members List */}
          <div className="p-4 bg-orange-100/50 border border-orange-200 rounded-lg">
            <h3 className="font-bold text-lg text-orange-900 mb-2">Members</h3>
            <ul className="space-y-2">
                {members.sort((a,b) => b.power - a.power).map(member => (
                    <li key={member.id} className="flex justify-between items-center p-2 bg-orange-50/50 rounded-md">
                        <div className="flex items-center gap-3">
                           <IdentificationIcon className="h-5 w-5 text-orange-600"/>
                           <span className="font-semibold text-orange-900">{member.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <PowerIcon className="h-4 w-4 text-yellow-500" />
                            <span className="font-mono text-sm text-orange-800">{member.power.toLocaleString()}</span>
                        </div>
                    </li>
                ))}
            </ul>
          </div>

          {canRequestToJoin && (
            <div className="mt-4 pt-4 border-t border-orange-200">
                <button
                    onClick={() => onJoinRequest(family.id)}
                    disabled={hasSentRequest}
                    className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <UserPlusIcon className="h-6 w-6" />
                    <span>{hasSentRequest ? 'Request Sent' : 'Request to Join Family'}</span>
                </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default FamilyProfileModal;
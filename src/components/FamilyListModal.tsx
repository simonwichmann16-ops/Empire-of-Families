
import React from 'react';
import { Family, MockUser } from '../types';
import { BuildingLibraryIcon, PowerIcon, CrownIcon, UserGroupIcon } from './Icon';

interface FamilyListModalProps {
  families: Family[];
  onlineUsers: MockUser[];
  onClose: () => void;
  onOpenFamilyProfile: (family: Family) => void;
}

const FamilyListModal: React.FC<FamilyListModalProps> = ({ families, onlineUsers, onClose, onOpenFamilyProfile }) => {

  const getFamilyDetails = (family: Family) => {
    const members = onlineUsers.filter(u => u.familyName === family.name);
    const totalPower = members.reduce((sum, member) => sum + member.power, 0);
    const don = members.find(m => m.id === family.donId) || { name: 'Unknown Don' };

    return {
      members,
      totalPower,
      donName: don.name,
    };
  };

  return (
    <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="family-list-modal-title"
    >
      <div 
        className="bg-orange-50/95 backdrop-blur-md border border-orange-200 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-2xl m-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-orange-200 pb-4 mb-4">
          <h2 id="family-list-modal-title" className="text-2xl font-bold text-amber-600">Established Families</h2>
          <button 
            onClick={onClose} 
            className="text-orange-600 text-3xl leading-none hover:text-orange-900 transition-colors"
            aria-label="Close modal"
          >&times;</button>
        </div>
        
        <div className="overflow-y-auto space-y-3 pr-2 -mr-4 flex-grow">
          {families.length > 0 ? (
            <ul className="space-y-4">
              {families.sort((a,b) => getFamilyDetails(b).totalPower - getFamilyDetails(a).totalPower).map(family => {
                const { members, totalPower, donName } = getFamilyDetails(family);
                return (
                  <li 
                    key={family.id} 
                    className="flex flex-col gap-3 p-4 bg-orange-50/70 rounded-lg transition-colors hover:bg-orange-100/80 cursor-pointer"
                    onClick={() => onOpenFamilyProfile(family)}
                    role="button"
                    aria-label={`View profile for The ${family.name} Family`}
                    >
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-orange-100 rounded-md text-amber-600">
                                <BuildingLibraryIcon className="h-8 w-8" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-xl text-orange-900">{family.name}</h4>
                                <div className="flex items-center gap-2 text-sm text-orange-700">
                                    <CrownIcon className="h-4 w-4" />
                                    <span>Don: {donName}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-right">
                           <div className="flex items-center gap-2">
                             <UserGroupIcon className="h-5 w-5 text-orange-600" />
                             <span className="font-mono text-lg text-orange-900">{members.length}</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <PowerIcon className="h-5 w-5 text-yellow-600" />
                             <span className="font-mono text-lg text-orange-900">{totalPower.toLocaleString()}</span>
                           </div>
                        </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
             <div className="text-center p-8 text-orange-600">
                <p>There are no established families yet.</p>
                <p className="text-sm">Be the first to create one and build your dynasty!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FamilyListModal;
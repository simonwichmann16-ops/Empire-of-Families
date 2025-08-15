

import React, { useState } from 'react';
import { Family, Player, MockUser, ShopItem, FamilyRole, MembershipRequest } from '../types';
import { FAMILY_SHOP_ITEMS } from '../constants';
import { BuildingLibraryIcon, PowerIcon, CrownIcon, UserGroupIcon, IdentificationIcon, MoneyIcon, BriefcaseIcon, InboxIcon, ShieldCheckIcon, DaggerIcon } from './Icon';

interface MyFamilyModalProps {
  family: Family;
  player: Player;
  onlineUsers: MockUser[];
  families: Family[];
  onClose: () => void;
  onUpdateDescription: (familyId: string, description: string) => void;
  onDonate: (familyId: string, amount: number) => void;
  onBuyFamilyShopItem: (item: ShopItem) => void;
  onUpdateMemberRole: (memberId: string, newRole: FamilyRole) => void;
  onAcceptJoinRequest: (request: MembershipRequest) => void;
  onDeclineJoinRequest: (request: MembershipRequest) => void;
  onSetFamilyRelation: (targetFamilyName: string, relation: 'ally' | 'rival' | 'neutral') => void;
}

const FamilyShopItemCard: React.FC<{
    item: ShopItem;
    player: Player;
    onBuy: (item: ShopItem) => void;
}> = ({ item, player, onBuy }) => {
    const canAfford = player.money >= item.cost;
    const ownedQuantity = player.inventory[item.id] || 0;
    
    return (
        <li className="flex flex-col gap-3 p-4 bg-orange-50/70 rounded-lg">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-md text-amber-500">
                        <BriefcaseIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-orange-900">{item.name} <span className="text-xs font-normal text-orange-600">(Owned: {ownedQuantity})</span></h4>
                        <p className="text-sm text-orange-700">{item.description}</p>
                    </div>
                </div>
                <div className="text-right flex-shrink-0">
                    <p className="font-mono text-lg text-green-700">${item.cost.toLocaleString()}</p>
                    <p className="text-xs text-orange-600">+{item.power.toLocaleString()} Power</p>
                </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-orange-200/80 pt-3">
                <button
                    onClick={() => onBuy(item)}
                    disabled={!canAfford}
                    className="px-4 py-2 text-sm font-semibold rounded-md transition-colors w-32 text-center bg-amber-600 text-white hover:bg-amber-700 disabled:bg-orange-100 disabled:text-orange-400 disabled:cursor-not-allowed"
                >
                    {canAfford ? 'Purchase' : 'Not Enough Cash'}
                </button>
            </div>
        </li>
    );
};

const ROLES: FamilyRole[] = ['Don', 'Consigliere', 'Caporegime', 'Soldato'];

const MyFamilyModal: React.FC<MyFamilyModalProps> = ({ family, player, onlineUsers, families, onClose, onUpdateDescription, onDonate, onBuyFamilyShopItem, onUpdateMemberRole, onAcceptJoinRequest, onDeclineJoinRequest, onSetFamilyRelation }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'bank' | 'shop' | 'hierarchy' | 'requests' | 'diplomacy'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(family.description);
  const [donationAmount, setDonationAmount] = useState<number | string>('');
  const [relationInput, setRelationInput] = useState('');

  const members = onlineUsers.filter(u => u.familyName === family.name);
  const don = members.find(m => m.role === 'Don') || { name: 'Unknown' };
  
  const isPlayerDon = player.familyRole === 'Don';
  
  const otherFamilies = families.filter(f => f.id !== family.id);
  const allies = families.filter(f => family.allies.includes(f.id));
  const rivals = families.filter(f => family.rivals.includes(f.id));


  const handleSaveDescription = () => {
    onUpdateDescription(family.id, description);
    setIsEditing(false);
  };
  
  const handleDonation = () => {
      const amount = Number(donationAmount);
      if(amount > 0 && amount <= player.money){
          onDonate(family.id, amount);
          setDonationAmount('');
      }
  };
  
  const TabButton: React.FC<{ label: string; tabName: typeof activeTab; requestCount?: number}> = ({ label, tabName, requestCount }) => {
    const isActive = activeTab === tabName;
    return (
      <button
        onClick={() => setActiveTab(tabName)}
        className={`relative px-4 py-2 font-bold text-lg rounded-t-md transition-colors ${
          isActive ? 'bg-orange-50/50 text-amber-700' : 'bg-transparent text-orange-600 hover:bg-orange-100/50'
        }`}
      >
        {label}
        {requestCount > 0 && (
            <div className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-orange-50/50"></div>
        )}
      </button>
    );
  };

  return (
    <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="my-family-modal-title"
    >
      <div 
        className="bg-orange-50/95 backdrop-blur-md border border-orange-200 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-3xl m-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-orange-200 pb-4 mb-1">
          <h2 id="my-family-modal-title" className="text-2xl font-bold text-amber-600">The {family.name} Family</h2>
          <button 
            onClick={onClose} 
            className="text-orange-600 text-3xl leading-none hover:text-orange-900 transition-colors"
            aria-label="Close modal"
          >&times;</button>
        </div>

        <div className="flex border-b border-orange-200 mb-4">
            <TabButton label="Overview" tabName="overview" />
            <TabButton label="Bank" tabName="bank" />
            <TabButton label="Shop" tabName="shop" />
            <TabButton label="Hierarchy" tabName="hierarchy" />
            {isPlayerDon && <TabButton label="Requests" tabName="requests" requestCount={family.membershipRequests.length} />}
            {isPlayerDon && <TabButton label="Diplomacy" tabName="diplomacy" />}
        </div>
        
        <div className="overflow-y-auto space-y-4 pr-2 -mr-4 flex-grow">
        {activeTab === 'overview' && (
             <>
                 <div className="p-4 bg-orange-100/50 border border-orange-200 rounded-lg">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                        <div className="flex flex-col items-center"><CrownIcon className="h-6 w-6 text-yellow-600 mb-1"/><span className="font-semibold text-orange-800">Don: {don.name}</span></div>
                        <div className="flex flex-col items-center"><UserGroupIcon className="h-6 w-6 text-blue-600 mb-1"/><span className="font-semibold text-orange-800">{members.length + 1} Members</span></div>
                        <div className="flex flex-col items-center"><PowerIcon className="h-6 w-6 text-red-600 mb-1"/><span className="font-semibold text-orange-800">{family.totalPower.toLocaleString()} Power</span></div>
                    </div>
                </div>
          
                <div className="p-4 bg-orange-100/50 border border-orange-200 rounded-lg">
                    <h3 className="font-bold text-lg text-orange-900 mb-2">Family Description</h3>
                    {isEditing ? (
                        <div className="flex flex-col gap-2">
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full h-24 p-2 bg-white border border-orange-300 rounded-md text-orange-800" maxLength={200}/>
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setIsEditing(false)} className="px-3 py-1 bg-gray-200 rounded-md text-sm">Cancel</button>
                                <button onClick={handleSaveDescription} className="px-3 py-1 bg-amber-600 text-white rounded-md text-sm">Save</button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-between items-start">
                            <p className="text-orange-700 italic">{description}</p>
                            {isPlayerDon && <button onClick={() => setIsEditing(true)} className="text-xs text-blue-600 hover:underline flex-shrink-0 ml-4">Edit</button>}
                        </div>
                    )}
                </div>

                <div className="p-4 bg-orange-100/50 border border-orange-200 rounded-lg">
                    <h3 className="font-bold text-lg text-orange-900 mb-2">Members</h3>
                    <ul className="space-y-2">
                        <li className="flex justify-between items-center p-2 bg-amber-50/50 rounded-md font-bold">
                            <div className="flex items-center gap-3"><IdentificationIcon className="h-5 w-5 text-amber-600"/><span className="text-amber-900">You ({player.familyRole})</span></div>
                            <div className="flex items-center gap-2"><PowerIcon className="h-4 w-4 text-yellow-500" /><span className="font-mono text-sm text-amber-800">{player.power.toLocaleString()}</span></div>
                        </li>
                        {members.sort((a,b) => b.power - a.power).map(member => (
                            <li key={member.id} className="flex justify-between items-center p-2 bg-orange-50/50 rounded-md">
                                <div className="flex items-center gap-3"><IdentificationIcon className="h-5 w-5 text-orange-600"/><span className="font-semibold text-orange-900">{member.name} ({member.role})</span></div>
                                <div className="flex items-center gap-2"><PowerIcon className="h-4 w-4 text-yellow-500" /><span className="font-mono text-sm text-orange-800">{member.power.toLocaleString()}</span></div>
                            </li>
                        ))}
                    </ul>
                </div>
             </>
        )}
        {activeTab === 'bank' && (
            <div className="p-4 bg-orange-100/50 border border-orange-200 rounded-lg">
                <h3 className="font-bold text-lg text-orange-900 mb-2">Family Bank</h3>
                <div className="p-4 mb-4 bg-green-100/50 border border-green-200 rounded-lg flex items-center justify-between">
                    <h3 className="font-bold text-lg text-green-900">Current Treasury</h3>
                    <span className="font-mono text-2xl text-green-700">${family.bank.toLocaleString()}</span>
                </div>
                <p className="text-sm text-orange-700 mb-2">Donate to the family war chest. Funds can be used for family-wide events and upgrades.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                    <input type="number" min="0" value={donationAmount} onChange={(e) => setDonationAmount(e.target.value)} placeholder="Amount to donate" className="w-full bg-white border border-orange-300 rounded-md p-2 font-mono focus:ring-2 focus:ring-green-500 focus:outline-none"/>
                    <button onClick={handleDonation} disabled={Number(donationAmount) <= 0 || Number(donationAmount) > player.money} className="px-6 py-2 font-semibold rounded-md transition-colors bg-green-600 text-white hover:bg-green-700 disabled:bg-orange-100 disabled:text-orange-400">Donate</button>
                </div>
           </div>
        )}
        {activeTab === 'shop' && (
            <div className="p-4 bg-orange-100/50 border border-orange-200 rounded-lg">
                <h3 className="font-bold text-lg text-orange-900 mb-2">Family Armory</h3>
                <p className="text-sm text-orange-700 mb-4">Exclusive equipment available only to loyal family members. Purchases use your personal funds.</p>
                <ul className="space-y-3">
                    {FAMILY_SHOP_ITEMS.map(item => (
                        <FamilyShopItemCard 
                            key={item.id}
                            item={item}
                            player={player}
                            onBuy={onBuyFamilyShopItem}
                        />
                    ))}
                </ul>
            </div>
        )}
        {activeTab === 'hierarchy' && (
            <div className="p-4 bg-orange-100/50 border border-orange-200 rounded-lg">
                <h3 className="font-bold text-lg text-orange-900 mb-2">Family Hierarchy</h3>
                <ul className="space-y-2">
                     <li className="flex justify-between items-center p-2 bg-amber-50/50 rounded-md font-bold">
                        <div className="flex items-center gap-3"><CrownIcon className="h-5 w-5 text-amber-600"/><span className="text-amber-900">You</span></div>
                        <span className="font-mono text-sm text-amber-800">{player.familyRole}</span>
                    </li>
                    {members.map(member => (
                        <li key={member.id} className="flex justify-between items-center p-2 bg-orange-50/50 rounded-md">
                            <div className="flex items-center gap-3"><IdentificationIcon className="h-5 w-5 text-orange-600"/><span className="font-semibold text-orange-900">{member.name}</span></div>
                            {isPlayerDon ? (
                                <select 
                                    value={member.role || ''} 
                                    onChange={(e) => onUpdateMemberRole(member.id, e.target.value as FamilyRole)}
                                    className="bg-white border border-orange-300 rounded p-1 text-sm"
                                >
                                    {ROLES.map(r => <option key={r} value={r} disabled={r === 'Don'}>{r}</option>)}
                                </select>
                            ) : (
                                <span className="font-mono text-sm text-orange-800">{member.role}</span>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        )}
        {activeTab === 'requests' && isPlayerDon && (
            <div className="p-4 bg-orange-100/50 border border-orange-200 rounded-lg">
                <h3 className="font-bold text-lg text-orange-900 mb-2">Membership Requests</h3>
                {family.membershipRequests.length > 0 ? (
                    <ul className="space-y-2">
                        {family.membershipRequests.map(req => (
                            <li key={req.fromUserId} className="flex items-center justify-between p-2 bg-orange-50/50 rounded-md">
                                <div>
                                    <p className="font-semibold text-orange-900">{req.fromUserName}</p>
                                    <p className="text-xs text-orange-700 font-mono">{req.fromUserPower.toLocaleString()} Power</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => onAcceptJoinRequest(req)} className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">Accept</button>
                                    <button onClick={() => onDeclineJoinRequest(req)} className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">Decline</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-orange-600 py-4">No pending membership requests.</p>
                )}
            </div>
        )}
        {activeTab === 'diplomacy' && isPlayerDon && (
          <div className="space-y-4">
              <div className="p-4 bg-orange-100/50 border border-orange-200 rounded-lg">
                  <h3 className="font-bold text-lg text-orange-900 mb-2">Declare Relations</h3>
                   <div className="flex flex-col sm:flex-row gap-2">
                      <input type="text" list="family-names" value={relationInput} onChange={e => setRelationInput(e.target.value)} placeholder="Enter family name..." className="flex-grow p-2 border border-orange-300 rounded-md" />
                      <datalist id="family-names">
                        {otherFamilies.map(f => <option key={f.id} value={f.name} />)}
                      </datalist>
                      <button onClick={() => onSetFamilyRelation(relationInput, 'rival')} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Declare Rival</button>
                      <button onClick={() => onSetFamilyRelation(relationInput, 'ally')} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Form Alliance</button>
                  </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50/50 border border-green-200 rounded-lg">
                      <h3 className="font-bold text-lg text-green-900 mb-2">Allies</h3>
                      {allies.length > 0 ? <ul className="space-y-1">{allies.map(ally => <li key={ally.id} className="flex justify-between items-center text-sm p-1"><span>{ally.name}</span><button onClick={() => onSetFamilyRelation(ally.name, 'neutral')} className="text-xs text-gray-500 hover:underline">Remove</button></li>)}</ul> : <p className="text-sm text-green-800">No allies.</p>}
                  </div>
                   <div className="p-4 bg-red-50/50 border border-red-200 rounded-lg">
                      <h3 className="font-bold text-lg text-red-900 mb-2">Rivals</h3>
                      {rivals.length > 0 ? <ul className="space-y-1">{rivals.map(rival => <li key={rival.id} className="flex justify-between items-center text-sm p-1"><span>{rival.name}</span><button onClick={() => onSetFamilyRelation(rival.name, 'neutral')} className="text-xs text-gray-500 hover:underline">Remove</button></li>)}</ul> : <p className="text-sm text-red-800">No rivals.</p>}
                  </div>
              </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default MyFamilyModal;

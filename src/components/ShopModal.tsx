import React, { useState } from 'react';
import { ShopItem, MockUser } from '../types';
import { 
    DaggerIcon, ShieldCheckIcon, StarIcon, TruckIcon, HomeModernIcon, BriefcaseIcon, CrownIcon, BankIcon, HandThumbUpIcon, HandgunIcon, KeyIcon
} from './Icon';
import { INVESTIGATOR_COST } from '../constants';


const getIconForItem = (item: ShopItem): React.ReactNode => {
    switch (item.id) {
        // Specials
        case 'armored_car': return <TruckIcon className="h-6 w-6" />;
        case 'safehouse_network': return <HomeModernIcon className="h-6 w-6" />;
        case 'corrupt_politician': return <BriefcaseIcon className="h-6 w-6" />;
        case 'dons_ring': return <CrownIcon className="h-6 w-6" />;
        case 'offshore_accounts': return <BankIcon className="h-6 w-6" />;

        // Weapons
        case 'brass_knuckles': return <HandThumbUpIcon className="h-6 w-6" />;
        case 'pistol_9mm':
        case 'silenced_pistol':
        case 'gold_revolver': return <HandgunIcon className="h-6 w-6" />;
        case 'shotgun':
        case 'tommy_gun':
        case 'sniper_rifle': return <HandgunIcon className="h-6 w-6" />;
        
        // Explosives
        case 'molotov':
        case 'grenade':
        case 'rpg': return <BankIcon className="h-6 w-6" />;
        
        // Armor
        case 'leather_jacket':
        case 'kevlar_vest':
        case 'body_armor': return <ShieldCheckIcon className="h-6 w-6" />;

        // Fallback for other weapons
        case 'switchblade':
        case 'lead_pipe': return <DaggerIcon className="h-6 w-6" />;
        
        // Generic Fallback by type
        default:
            switch (item.type) {
                case 'Weapon': return <DaggerIcon className="h-6 w-6" />;
                case 'Armor': return <ShieldCheckIcon className="h-6 w-6" />;
                case 'Special': return <StarIcon className="h-6 w-6" />;
                case 'Explosive': return <BankIcon className="h-6 w-6" />;
                default: return <DaggerIcon className="h-6 w-6" />;
            }
    }
};

const ShopItemCard: React.FC<{
    item: ShopItem;
    onBuyItem: (item: ShopItem) => void;
    canAfford: boolean;
    ownedQuantity: number;
    isDisabled: boolean;
}> = ({ item, onBuyItem, canAfford, ownedQuantity, isDisabled }) => {
    
    const effectiveDisabled = isDisabled || !canAfford;

    return (
        <li className="flex items-center justify-between gap-4 p-3 bg-amber-200/70 rounded-lg">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-md text-amber-700">
                    {getIconForItem(item)}
                </div>
                <div>
                    <h4 className="font-semibold text-amber-900">{item.name}</h4>
                    <p className="text-xs text-amber-800">
                        +{item.power} Power {ownedQuantity > 0 && `(Owned: ${ownedQuantity})`}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-green-700 font-mono text-sm">
                    <span>${item.cost.toLocaleString()}</span>
                </div>
                <button
                    onClick={() => onBuyItem(item)}
                    disabled={effectiveDisabled}
                    className="px-4 py-1.5 text-sm font-semibold rounded-md transition-colors w-24 text-center
                               bg-amber-700 text-white hover:bg-amber-800
                               disabled:bg-amber-200 disabled:text-amber-500 disabled:cursor-not-allowed"
                >
                    Buy
                </button>
            </div>
        </li>
    );
};

interface ShopModalProps {
  items: ShopItem[];
  playerMoney: number;
  playerInventory: { [itemId: string]: number };
  onlineUsers: MockUser[];
  onBuyItem: (item: ShopItem) => void;
  onHireInvestigator: (targetUserName: string) => void;
  disabled: boolean;
  onClose: () => void;
}

const ShopModal: React.FC<ShopModalProps> = ({ items, playerMoney, playerInventory, onlineUsers, onBuyItem, onHireInvestigator, disabled, onClose }) => {
  const [activeTab, setActiveTab] = useState<'items' | 'pi'>('items');
  const [targetUser, setTargetUser] = useState('');
  const [hireError, setHireError] = useState('');

  const handleHire = () => {
      setHireError('');
      if (!targetUser.trim()) {
          setHireError('Please enter a username.');
          return;
      }
      const userExists = onlineUsers.some(u => u.name.toLowerCase() === targetUser.trim().toLowerCase());
      if (!userExists) {
          setHireError(`User "${targetUser.trim()}" not found.`);
          return;
      }
      onHireInvestigator(targetUser.trim());
      setTargetUser(''); // Clear input on success
  };

  const TabButton: React.FC<{ label: string; tabName: 'items' | 'pi' }> = ({ label, tabName }) => (
    <button
        onClick={() => setActiveTab(tabName)}
        className={`px-4 py-2 font-bold text-lg rounded-t-md transition-colors ${
            activeTab === tabName ? 'bg-amber-100/50 text-amber-800' : 'bg-transparent text-amber-700 hover:bg-amber-200/50'
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
        aria-labelledby="shop-modal-title"
    >
      <div 
        className="bg-amber-100/95 backdrop-blur-md border border-amber-300 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-2xl m-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-amber-300 pb-4 mb-1">
          <h2 id="shop-modal-title" className="text-2xl font-bold text-amber-800">The Black Market</h2>
          <button 
            onClick={onClose} 
            className="text-amber-700 text-3xl leading-none hover:text-amber-900 transition-colors"
            aria-label="Close shop modal"
          >&times;</button>
        </div>
        
        <div className="flex border-b border-amber-300">
            <TabButton label="Items" tabName="items" />
            <TabButton label="Private Investigator" tabName="pi" />
        </div>

        <div className="overflow-y-auto flex-grow">
            {activeTab === 'items' && (
                <ul className="space-y-3 pr-2 -mr-4 pt-4">
                  {items.map(item => (
                    <ShopItemCard 
                        key={item.id}
                        item={item}
                        onBuyItem={onBuyItem}
                        canAfford={playerMoney >= item.cost}
                        ownedQuantity={playerInventory[item.id] || 0}
                        isDisabled={disabled}
                    />
                  ))}
                </ul>
            )}
            {activeTab === 'pi' && (
                <div className="pt-4 flex flex-col items-center gap-4 text-center">
                    <div className="p-3 bg-slate-200 rounded-full text-slate-600">
                        <KeyIcon className="h-10 w-10" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Hire a Private Investigator</h3>
                    <p className="text-slate-600">Need to find someone? For a price, our PI can locate any player in the world. A report will be sent to your inbox within 2-4 hours revealing their current country.</p>
                    
                    <div className="p-4 w-full bg-slate-200/50 border border-slate-300 rounded-lg">
                        <p className="font-bold text-lg text-slate-900">Cost: <span className="font-mono text-green-700">${INVESTIGATOR_COST.toLocaleString()}</span></p>
                    </div>
                    
                    {hireError && <p className="text-red-600 font-semibold">{hireError}</p>}
                    
                    <div className="w-full flex flex-col sm:flex-row gap-2">
                        <input 
                            type="text" 
                            value={targetUser}
                            onChange={(e) => setTargetUser(e.target.value)}
                            placeholder="Enter target username..."
                            className="flex-grow p-3 bg-white border border-slate-400 rounded-md font-sans text-center"
                            disabled={disabled}
                        />
                        <button
                            onClick={handleHire}
                            disabled={disabled || playerMoney < INVESTIGATOR_COST}
                            className="px-6 py-3 font-semibold rounded-md transition-colors bg-slate-700 text-white hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed"
                        >
                            Hire Investigator
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ShopModal;

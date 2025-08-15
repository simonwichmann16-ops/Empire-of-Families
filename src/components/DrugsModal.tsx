
import React, { useState, useMemo } from 'react';
import { Drug, Player, Location, SmugglingMethod } from '../types';
import { PillIcon, LeafIcon, NoseIcon, SpoonIcon, TruckIcon } from './Icon';
import { SMUGGLING_METHODS } from '../constants';

const drugIcons: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
    weed: LeafIcon,
    pills: PillIcon,
    cocaine: NoseIcon,
    heroin: SpoonIcon
};

const DrugItemCard: React.FC<{
    drug: Drug;
    player: Player;
    price: number;
    onBuy: (drug: Drug, quantity: number) => void;
    onSell: (drug: Drug, quantity: number) => void;
    isDisabled: boolean;
}> = ({ drug, player, price, onBuy, onSell, isDisabled }) => {
    const [quantity, setQuantity] = useState(1);
    const owned = player.drugs[player.location]?.[drug.id] || 0;
    const totalCost = price * quantity;
    const DrugIcon = drugIcons[drug.id] || PillIcon;
    
    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value, 10);
        if (val > 0) {
            setQuantity(val);
        } else if (e.target.value === '') {
            setQuantity(1);
        }
    };

    return (
        <li className="flex flex-col gap-3 p-4 bg-orange-50/70 rounded-lg">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-md text-teal-500"><DrugIcon className="h-6 w-6" /></div>
                    <div>
                        <h4 className="font-semibold text-orange-900">{drug.name}</h4>
                        <p className="text-xs text-orange-700">Owned in {player.location.toUpperCase()}: {owned.toLocaleString()}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-mono text-lg text-green-700">${price.toLocaleString()}</p>
                    <p className="text-xs text-orange-600">per unit</p>
                </div>
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-orange-200/80 pt-3">
                <input 
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-20 bg-white border border-orange-300 rounded-md p-2 text-center font-mono focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    disabled={isDisabled}
                />
                <div className="flex gap-2">
                    <button 
                        onClick={() => onBuy(drug, quantity)}
                        disabled={isDisabled || player.money < totalCost}
                        className="px-4 py-2 text-sm font-semibold rounded-md transition-colors w-24 text-center bg-teal-600 text-white hover:bg-teal-700 disabled:bg-orange-100 disabled:text-orange-400 disabled:cursor-not-allowed"
                    >
                        Buy
                    </button>
                    <button 
                        onClick={() => onSell(drug, quantity)}
                        disabled={isDisabled || owned < quantity}
                        className="px-4 py-2 text-sm font-semibold rounded-md transition-colors w-24 text-center bg-orange-600 text-white hover:bg-orange-700 disabled:bg-orange-100 disabled:text-orange-400 disabled:cursor-not-allowed"
                    >
                        Sell
                    </button>
                </div>
            </div>
        </li>
    );
};

const SmugglingCard: React.FC<{
    drug: Drug;
    player: Player;
    ownedQuantity: number;
    locations: Location[];
    onSmuggle: (drug: Drug, quantity: number, destinationId: string, method: SmugglingMethod) => void;
    isDisabled: boolean;
}> = ({ drug, player, ownedQuantity, locations, onSmuggle, isDisabled }) => {
    const [quantity, setQuantity] = useState(1);
    const [destinationId, setDestinationId] = useState('');
    const [methodId, setMethodId] = useState(SMUGGLING_METHODS[0].id);
    const DrugIcon = drugIcons[drug.id] || PillIcon;

    const destinationLocations = locations.filter(l => l.id !== player.location);
    const selectedMethod = SMUGGLING_METHODS.find(m => m.id === methodId)!;

    const smugglingCost = Math.round(drug.basePrice * quantity * selectedMethod.costMultiplier);

    const successChance = useMemo(() => {
        if (!destinationId) return 0;
        const destination = locations.find(l => l.id === destinationId);
        if (!destination) return 0;
        
        const distancePenalty = (destination.airTravelDuration || 0) * 0.75;
        const powerBonus = Math.min(25, player.power / 1000);
        
        const baseSuccessChance = 80;
        const totalSuccessChance = baseSuccessChance - distancePenalty + powerBonus + selectedMethod.successBonus;

        return Math.floor(Math.max(5, Math.min(95, totalSuccessChance)));
    }, [destinationId, locations, player.power, selectedMethod]);

    const getSuccessChanceColor = (chance: number) => chance >= 75 ? 'text-lime-600' : chance >= 50 ? 'text-amber-600' : 'text-red-600';

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = parseInt(e.target.value, 10);
        if (isNaN(val) || val < 1) {
            val = 1;
        } else if (val > ownedQuantity) {
            val = ownedQuantity;
        }
        setQuantity(val);
    };
    
    const handleSmuggleClick = () => {
        if (!destinationId) {
            alert("Please select a destination.");
            return;
        }
        onSmuggle(drug, quantity, destinationId, selectedMethod);
    };

    return (
        <li className="flex flex-col gap-3 p-4 bg-orange-50/70 rounded-lg">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-md text-purple-500"><DrugIcon className="h-6 w-6" /></div>
                    <div>
                        <h4 className="font-semibold text-orange-900">{drug.name}</h4>
                        <p className="text-xs text-orange-700">Available to Smuggle: {ownedQuantity.toLocaleString()}</p>
                    </div>
                </div>
                 <div className="text-right">
                    <p className={`font-mono text-lg ${getSuccessChanceColor(successChance)}`}>Success Chance: {successChance > 0 ? `${successChance}%` : 'N/A'}</p>
                    <p className="font-mono text-lg text-red-700">Fee: ${smugglingCost.toLocaleString()}</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3 border-t border-orange-200/80">
                {SMUGGLING_METHODS.map(method => (
                     <button
                        key={method.id}
                        onClick={() => setMethodId(method.id)}
                        disabled={isDisabled}
                        title={method.description}
                        className={`p-2 rounded-md border-2 text-center transition-colors disabled:cursor-not-allowed ${
                            methodId === method.id 
                            ? 'bg-purple-200 border-purple-500 text-purple-900' 
                            : 'bg-orange-100 border-orange-200 hover:border-purple-300'
                        }`}
                     >
                        <p className="font-bold text-sm">{method.name}</p>
                        <p className="text-xs">+{method.successBonus}% Success</p>
                    </button>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-orange-200/80 pt-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input 
                        type="number"
                        min="1"
                        max={ownedQuantity}
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="w-20 bg-white border border-orange-300 rounded-md p-2 text-center font-mono focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        disabled={isDisabled}
                    />
                    <select
                        value={destinationId}
                        onChange={(e) => setDestinationId(e.target.value)}
                        className="flex-grow bg-white border border-orange-300 rounded-md p-2 text-orange-950 font-sans focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        disabled={isDisabled}
                    >
                        <option value="">Select Destination...</option>
                        {destinationLocations.map(loc => (
                            <option key={loc.id} value={loc.id}>{loc.name}</option>
                        ))}
                    </select>
                </div>
                <button 
                    onClick={handleSmuggleClick}
                    disabled={isDisabled || !destinationId || quantity <= 0 || player.money < smugglingCost}
                    className="px-4 py-2 text-sm font-semibold rounded-md transition-colors w-full sm:w-auto text-center bg-purple-600 text-white hover:bg-purple-700 disabled:bg-orange-100 disabled:text-orange-400 disabled:cursor-not-allowed"
                >
                    {player.money < smugglingCost ? 'Insufficient Funds' : 'Smuggle'}
                </button>
            </div>
        </li>
    );
};


interface DrugsModalProps {
  drugs: Drug[];
  player: Player;
  locations: Location[];
  onBuy: (drug: Drug, quantity: number) => void;
  onSell: (drug: Drug, quantity: number) => void;
  onSmuggle: (drug: Drug, quantity: number, destinationId: string, method: SmugglingMethod) => void;
  disabled: boolean;
  onClose: () => void;
}

const DrugsModal: React.FC<DrugsModalProps> = ({ drugs, player, locations, onBuy, onSell, onSmuggle, disabled, onClose }) => {
  const [activeTab, setActiveTab] = useState<'market' | 'smuggle' | 'globalPrices' | 'globalStash'>('market');
  const currentLocation = locations.find(l => l.id === player.location);
  if (!currentLocation) return null;

  const ownedDrugsInLocation = drugs.filter(d => (player.drugs[player.location]?.[d.id] || 0) > 0);

  const globalPrices = useMemo(() => {
    return drugs.map(drug => {
      const prices = locations.map(location => ({
        locationId: location.id,
        price: Math.round(drug.basePrice * (location.drugPriceModifiers[drug.id] || 1))
      }));
      const minPrice = Math.min(...prices.map(p => p.price));
      const maxPrice = Math.max(...prices.map(p => p.price));
      return {
        drugId: drug.id,
        drugName: drug.name,
        prices,
        minPrice,
        maxPrice,
      };
    });
  }, [drugs, locations]);

  const TabButton: React.FC<{
    label: string;
    tabName: 'market' | 'smuggle' | 'globalPrices' | 'globalStash';
  }> = ({ label, tabName }) => {
    const isActive = activeTab === tabName;
    return (
      <button
        onClick={() => setActiveTab(tabName)}
        className={`px-4 py-2 font-bold text-lg rounded-t-md transition-colors ${
          isActive
            ? 'bg-orange-50/50 text-teal-700'
            : 'bg-transparent text-orange-600 hover:bg-orange-100/50'
        }`}
      >
        {label}
      </button>
    );
  };
  
  return (
    <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drugs-modal-title"
    >
      <div 
        className="bg-orange-50/95 backdrop-blur-md border border-orange-200 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-4xl m-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-orange-200 pb-4 mb-1">
          <h2 id="drugs-modal-title" className="text-2xl font-bold text-teal-600">Drugs & Smuggling</h2>
          <button 
            onClick={onClose} 
            className="text-orange-600 text-3xl leading-none hover:text-orange-900 transition-colors"
            aria-label="Close drugs modal"
          >&times;</button>
        </div>

        <div className="flex border-b border-orange-200 mb-4">
            <TabButton label="Local Market" tabName="market" />
            <TabButton label="Smuggling" tabName="smuggle" />
            <TabButton label="Global Prices" tabName="globalPrices" />
            <TabButton label="Global Stash" tabName="globalStash" />
        </div>

        <div className="overflow-y-auto space-y-3 pr-2 -mr-4 flex-grow">
        {activeTab === 'market' && (
             <ul className="space-y-3">
             {drugs.map(drug => {
                 const price = Math.round(drug.basePrice * (currentLocation.drugPriceModifiers[drug.id] || 1));
                 return (
                   <DrugItemCard 
                       key={drug.id}
                       drug={drug}
                       player={player}
                       price={price}
                       onBuy={onBuy}
                       onSell={onSell}
                       isDisabled={disabled}
                   />
               )
             })}
           </ul>
        )}
        {activeTab === 'smuggle' && (
            <>
                {ownedDrugsInLocation.length > 0 ? (
                    <ul className="space-y-3">
                        {ownedDrugsInLocation.map(drug => (
                            <SmugglingCard
                                key={drug.id}
                                drug={drug}
                                player={player}
                                ownedQuantity={player.drugs[player.location][drug.id]}
                                locations={locations}
                                onSmuggle={onSmuggle}
                                isDisabled={disabled}
                            />
                        ))}
                    </ul>
                ) : (
                    <div className="text-center p-8 text-orange-600">
                        <p>You have no drugs to smuggle in {currentLocation.name}.</p>
                        <p className="text-sm">Visit the Local Market to acquire some goods.</p>
                    </div>
                )}
            </>
        )}
        {activeTab === 'globalPrices' && (
          <div className="bg-orange-50/70 p-4 rounded-lg">
            <h3 className="text-lg font-bold text-orange-900 mb-2">Global Drug Price Report</h3>
            <p className="text-sm text-orange-700 mb-4">Use this intel to find profitable smuggling routes. <span className="text-green-600 font-semibold">Green</span> indicates the best place to buy, <span className="text-red-600 font-semibold">red</span> the best place to sell.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-orange-800 uppercase bg-orange-100/50">
                  <tr>
                    <th scope="col" className="px-4 py-3 sticky left-0 bg-orange-100/50 z-10">Drug</th>
                    {locations.map(loc => (
                      <th key={loc.id} scope="col" className={`px-4 py-3 text-center ${loc.id === player.location ? 'font-black text-orange-950' : ''}`}>
                        {loc.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {globalPrices.map(drugRow => (
                    <tr key={drugRow.drugId} className="border-b border-orange-200/50 hover:bg-orange-100/30">
                      <th scope="row" className="px-4 py-4 font-semibold text-orange-900 whitespace-nowrap sticky left-0 bg-orange-50/70 z-10">
                        {drugRow.drugName}
                      </th>
                      {drugRow.prices.map(({ locationId, price }) => {
                        let cellClassName = "px-4 py-4 text-center font-mono";
                        if (price === drugRow.minPrice && drugRow.minPrice !== drugRow.maxPrice) {
                          cellClassName += " text-green-600 font-extrabold";
                        } else if (price === drugRow.maxPrice && drugRow.minPrice !== drugRow.maxPrice) {
                          cellClassName += " text-red-600 font-extrabold";
                        } else {
                          cellClassName += " text-black";
                        }
                        if (locationId === player.location) {
                          cellClassName += " bg-orange-200/50";
                        }
                        return (
                          <td key={`${drugRow.drugId}-${locationId}`} className={cellClassName}>
                            ${price.toLocaleString()}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
         {activeTab === 'globalStash' && (
          <div className="bg-orange-50/70 p-4 rounded-lg">
            <h3 className="text-lg font-bold text-orange-900 mb-4">Global Stash Overview</h3>
             <ul className="space-y-4">
                {Object.entries(player.drugs).map(([locationId, stash]) => {
                    const location = locations.find(l => l.id === locationId);
                    if (!location || Object.keys(stash).length === 0) return null;
                    return (
                        <li key={locationId} className="p-4 bg-orange-100/50 border border-orange-200 rounded-lg">
                            <h4 className="font-bold text-xl text-orange-800 border-b border-orange-200 pb-2 mb-2">{location.name}</h4>
                            <ul className="space-y-1">
                                {Object.entries(stash).map(([drugId, quantity]) => {
                                    const drug = drugs.find(d => d.id === drugId);
                                    if (!drug || quantity === 0) return null;
                                    const DrugIcon = drugIcons[drug.id] || TruckIcon;
                                    return (
                                        <li key={drugId} className="flex justify-between items-center text-orange-900">
                                            <span className="flex items-center gap-2"><DrugIcon className="h-4 w-4" />{drug.name}</span>
                                            <span className="font-mono">{quantity.toLocaleString()} units</span>
                                        </li>
                                    )
                                })}
                            </ul>
                        </li>
                    )
                })}
                {Object.keys(player.drugs).every(locId => Object.keys(player.drugs[locId]).length === 0) && (
                    <div className="text-center p-8 text-orange-600">
                        <p>All your stashes are empty.</p>
                        <p className="text-sm">Buy drugs on the Local Market to get started.</p>
                    </div>
                )}
             </ul>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default DrugsModal;

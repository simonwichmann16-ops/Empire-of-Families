import React, { useState } from 'react';
import { Business } from '../types';
import { BuildingOfficeIcon, MoneyIcon } from './Icon';

const BusinessItemCard: React.FC<{
    business: Business;
    onBuyBusiness: (business: Business) => void;
    canAfford: boolean;
    isOwned: boolean;
    isDisabled: boolean;
}> = ({ business, onBuyBusiness, canAfford, isOwned, isDisabled }) => {
    
    const buttonText = isOwned ? 'Owned' : 'Buy';
    const effectiveDisabled = isDisabled || isOwned || !canAfford;

    return (
        <li className="flex flex-col gap-3 p-4 bg-amber-200/70 rounded-lg">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-md text-amber-700">
                        <BuildingOfficeIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-amber-900">{business.name}</h4>
                        <p className="text-xs text-amber-800">
                            +${business.incomePerHour.toLocaleString()} / hour
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-green-700 font-mono text-sm">
                        <span>${business.cost.toLocaleString()}</span>
                    </div>
                    <button
                        onClick={() => onBuyBusiness(business)}
                        disabled={effectiveDisabled}
                        className="px-4 py-1.5 text-sm font-semibold rounded-md transition-colors w-24 text-center
                                   bg-yellow-600 text-white hover:bg-yellow-700
                                   disabled:bg-amber-200 disabled:text-amber-500 disabled:cursor-not-allowed"
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
            <p className="text-sm text-amber-800 pl-12">{business.description}</p>
        </li>
    );
};

const OwnedBusinessCard: React.FC<{ business: Business }> = ({ business }) => (
    <li className="flex items-center justify-between gap-4 p-3 bg-amber-200/80 rounded-lg">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-md text-amber-700">
                <BuildingOfficeIcon className="h-6 w-6" />
            </div>
            <div>
                <h4 className="font-semibold text-amber-900">{business.name}</h4>
                <p className="text-xs text-amber-800 max-w-md">{business.description}</p>
            </div>
        </div>
        <div className="text-right flex-shrink-0">
            <p className="font-mono text-lg text-green-700">
                +${business.incomePerHour.toLocaleString()}
            </p>
            <p className="text-xs text-amber-700">per hour</p>
        </div>
    </li>
);


interface BusinessModalProps {
  businesses: Business[];
  playerMoney: number;
  playerBusinesses: string[];
  onBuyBusiness: (business: Business) => void;
  disabled: boolean;
  onClose: () => void;
}

const BusinessModal: React.FC<BusinessModalProps> = ({ businesses, playerMoney, playerBusinesses, onBuyBusiness, disabled, onClose }) => {
  const [activeTab, setActiveTab] = useState<'buy' | 'owned'>('buy');
  
  const ownedBusinesses = businesses.filter(b => playerBusinesses.includes(b.id));
  const totalIncome = ownedBusinesses.reduce((sum, b) => sum + b.incomePerHour, 0);

  const TabButton: React.FC<{
    label: string;
    tabName: 'buy' | 'owned';
  }> = ({ label, tabName }) => {
    const isActive = activeTab === tabName;
    return (
      <button
        onClick={() => setActiveTab(tabName)}
        className={`px-4 py-2 font-bold text-lg rounded-t-md transition-colors ${
          isActive
            ? 'bg-amber-100/50 text-amber-900'
            : 'bg-transparent text-amber-700 hover:bg-amber-200/50'
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
        aria-labelledby="business-modal-title"
    >
      <div 
        className="bg-amber-100/95 backdrop-blur-md border border-amber-300 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-3xl m-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="flex justify-between items-center border-b border-amber-300 pb-4 mb-1">
          <h2 id="business-modal-title" className="text-2xl font-bold text-amber-800">Business Ventures</h2>
          <button 
            onClick={onClose} 
            className="text-amber-700 text-3xl leading-none hover:text-amber-900 transition-colors"
            aria-label="Close business modal"
          >&times;</button>
        </div>

        <div className="flex border-b border-amber-300 mb-4">
            <TabButton label="Buy Businesses" tabName="buy" />
            <TabButton label="Your Portfolio" tabName="owned" />
        </div>
        
        <div className="overflow-y-auto space-y-3 pr-2 -mr-4 flex-grow">
          {activeTab === 'buy' && (
            <ul className="space-y-3">
              {businesses.map(business => (
                <BusinessItemCard 
                    key={business.id}
                    business={business}
                    onBuyBusiness={onBuyBusiness}
                    canAfford={playerMoney >= business.cost}
                    isOwned={playerBusinesses.includes(business.id)}
                    isDisabled={disabled}
                />
              ))}
            </ul>
          )}
          {activeTab === 'owned' && (
            <div>
              <div className="p-4 mb-4 bg-amber-200/50 border border-amber-300 rounded-lg flex items-center justify-between">
                <h3 className="font-bold text-lg text-amber-900">Total Passive Income</h3>
                <span className="font-mono text-2xl text-green-700">+${totalIncome.toLocaleString()}/hr</span>
              </div>
              {ownedBusinesses.length > 0 ? (
                <ul className="space-y-3">
                    {ownedBusinesses.map(business => (
                        <OwnedBusinessCard key={business.id} business={business} />
                    ))}
                </ul>
              ) : (
                <div className="text-center p-8 text-amber-700">
                    <p>You do not own any businesses yet.</p>
                    <p className="text-sm">Visit the "Buy Businesses" tab to get started.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessModal;


import React from 'react';
import { Player } from '../types';
import { SHOP_ITEMS } from '../constants';
import { PowerIcon } from './Icon';

interface PowerModalProps {
  player: Player;
  onClose: () => void;
}

const PowerModal: React.FC<PowerModalProps> = ({ player, onClose }) => {
  const ownedItems = Object.entries(player.inventory)
    .map(([itemId, quantity]) => {
      const itemData = SHOP_ITEMS.find(i => i.id === itemId);
      if (!itemData || quantity === 0) return null;
      return {
        ...itemData,
        quantity,
        totalPower: itemData.power * quantity,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => b.totalPower - a.totalPower);

  return (
    <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="power-modal-title"
    >
      <div 
        className="bg-orange-50/95 backdrop-blur-md border border-orange-200 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-lg m-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-orange-200 pb-4 mb-4">
          <h2 id="power-modal-title" className="text-2xl font-bold text-amber-600">Power Details</h2>
          <button 
            onClick={onClose} 
            className="text-orange-600 text-3xl leading-none hover:text-orange-900 transition-colors"
            aria-label="Close power details modal"
          >&times;</button>
        </div>
        
        <div className="p-4 mb-4 bg-orange-100/50 border border-orange-200 rounded-lg flex items-center justify-between">
            <h3 className="font-bold text-lg text-orange-900">Total Power</h3>
            <span className="font-mono text-2xl text-amber-700">{player.power.toLocaleString()}</span>
        </div>

        <div className="overflow-y-auto space-y-3 pr-2 -mr-4 flex-grow">
          {ownedItems.length > 0 ? (
            <ul className="space-y-3">
              {ownedItems.map(item => (
                <li key={item.id} className="flex items-center justify-between gap-4 p-3 bg-orange-50/70 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-md text-amber-500">
                            <PowerIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-orange-900">{item.name}</h4>
                            <p className="text-xs text-orange-700">
                                {item.quantity} x {item.power} Power
                            </p>
                        </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <p className="font-mono text-lg text-amber-700">
                            {item.totalPower.toLocaleString()}
                        </p>
                        <p className="text-xs text-orange-600">Total Power</p>
                    </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center p-8 text-orange-600">
                <p>You do not own any items that contribute to your power.</p>
                <p className="text-sm">Visit the Black Market to arm yourself.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PowerModal;

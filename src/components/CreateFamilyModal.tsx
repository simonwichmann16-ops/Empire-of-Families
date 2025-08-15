import React, { useState } from 'react';
import { Player, Family } from '../types';
import { FAMILY_CREATION_COST } from '../constants';

interface CreateFamilyModalProps {
  player: Player;
  families: Family[];
  onCreate: (name: string) => void;
  onClose: () => void;
  disabled: boolean;
}

const CreateFamilyModal: React.FC<CreateFamilyModalProps> = ({ player, families, onCreate, onClose, disabled }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const canAfford = player.money >= FAMILY_CREATION_COST;
  const isNameTaken = families.some(f => f.name.toLowerCase() === name.trim().toLowerCase());
  
  const handleCreate = () => {
    if (name.trim().length < 3) {
      setError('Family name must be at least 3 characters.');
      return;
    }
    if (isNameTaken) {
      setError('This family name is already taken.');
      return;
    }
    if (!canAfford) {
      setError('You cannot afford to start a family.');
      return;
    }
    setError('');
    onCreate(name.trim());
  };

  return (
    <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-family-modal-title"
    >
      <div 
        className="bg-orange-50/95 backdrop-blur-md border border-orange-200 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-md m-4 flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-orange-200 pb-4">
          <h2 id="create-family-modal-title" className="text-2xl font-bold text-amber-600">Found a New Family</h2>
          <button 
            onClick={onClose} 
            className="text-orange-600 text-3xl leading-none hover:text-orange-900 transition-colors"
            aria-label="Close modal"
          >&times;</button>
        </div>
        
        <p className="text-orange-700 text-center">Establish your legacy. A family provides power, protection, and a path to true influence. But greatness comes at a price.</p>
        
        <div className="space-y-3">
            <label htmlFor="familyName" className="font-bold text-lg text-orange-900 text-center block">Family Name</label>
            <input 
                id="familyName"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                className="w-full bg-white border border-orange-300 rounded-md p-3 text-center font-mono text-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="e.g. The Corleones"
                disabled={disabled}
            />
        </div>
        
        <div className="text-center font-bold text-lg text-orange-900">
            Creation Cost: <span className={`font-mono ${canAfford ? 'text-green-600' : 'text-red-600'}`}>${FAMILY_CREATION_COST.toLocaleString()}</span>
        </div>
        
        {error && <p className="text-red-600 text-center font-bold -my-2">{error}</p>}

        <button
            onClick={handleCreate}
            disabled={disabled || !name.trim() || !canAfford || isNameTaken}
            className="py-4 text-lg font-bold rounded-lg transition-colors bg-amber-600 text-white hover:bg-amber-700 disabled:bg-orange-100 disabled:text-orange-400"
        >
            Found Family
        </button>
      </div>
    </div>
  );
};

export default CreateFamilyModal;

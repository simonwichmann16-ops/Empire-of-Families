
import React from 'react';

interface DebugPanelProps {
    onAddMoney: () => void;
    onAddXp: () => void;
    onAddDrugs: () => void;
    onResetCooldowns: () => void;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ onAddMoney, onAddXp, onAddDrugs, onResetCooldowns }) => {
    return (
        <div className="absolute top-14 right-0 bg-purple-100 border-2 border-purple-300 rounded-lg shadow-xl p-4 w-64 space-y-2 animate-fade-in">
            <h3 className="font-bold text-purple-800 text-center text-lg">Debug Menu</h3>
            <button onClick={onAddMoney} className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                + $100,000
            </button>
            <button onClick={onAddXp} className="w-full p-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors">
                + 5,000 XP
            </button>
            <button onClick={onAddDrugs} className="w-full p-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors">
                + 10 Cocaine
            </button>
            <button onClick={onResetCooldowns} className="w-full p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                Reset Cooldowns
            </button>
        </div>
    );
};

export default DebugPanel;

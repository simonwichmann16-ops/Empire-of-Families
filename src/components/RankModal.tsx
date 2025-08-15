import React from 'react';

interface RankModalProps {
  ranks: { name: string; xpThreshold: number }[];
  currentRank: string;
  onClose: () => void;
}

const RankModal: React.FC<RankModalProps> = ({ ranks, currentRank, onClose }) => {
  return (
    <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rank-modal-title"
    >
      <div 
        className="bg-amber-100/95 backdrop-blur-md border border-amber-300 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-md m-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="flex justify-between items-center border-b border-amber-300 pb-4 mb-4">
          <h2 id="rank-modal-title" className="text-2xl font-bold text-amber-800">Empire Ranks</h2>
          <button 
            onClick={onClose} 
            className="text-amber-700 text-3xl leading-none hover:text-amber-900 transition-colors"
            aria-label="Close rank modal"
          >&times;</button>
        </div>
        <ul className="overflow-y-auto space-y-3 pr-2">
          {ranks.map((rank, index) => {
            const isCurrent = rank.name === currentRank;
            const isAchieved = ranks.findIndex(r => r.name === currentRank) >= index;

            return (
              <li
                key={rank.name}
                className={`p-4 rounded-md flex justify-between items-center transition-all ${
                  isCurrent ? 'bg-amber-200/50 border-l-4 border-amber-600' : 'bg-amber-200/50'
                } ${isAchieved ? 'opacity-100' : 'opacity-60'}`}
              >
                <div className="flex flex-col">
                  <span className={`font-bold ${isCurrent ? 'text-amber-950' : 'text-amber-800'}`}>{rank.name}</span>
                  <span className="text-xs text-amber-700">XP Needed: {rank.xpThreshold.toLocaleString()}</span>
                </div>
                {isCurrent && <span className="text-xs font-bold text-amber-700 tracking-wider">CURRENT</span>}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default RankModal;

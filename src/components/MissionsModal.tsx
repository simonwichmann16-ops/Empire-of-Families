


import React from 'react';
import { Player, Mission } from '../types';
import { ClipboardDocumentListIcon } from './Icon';

interface MissionsModalProps {
  player: Player;
  missions: Mission[];
  onClose: () => void;
  onClaimReward: () => void;
}

const MissionsModal: React.FC<MissionsModalProps> = ({ player, missions, onClose, onClaimReward }) => {
  const claimableMission = missions.find(m => m.id === player.completedUnclaimedMissionId);
  const activeMission = missions.find(m => m.id === player.activeMissionId);

  const renderContent = () => {
    if (claimableMission) {
      return (
        <div className="p-4 bg-yellow-100/50 border-2 border-dashed border-yellow-400 rounded-lg flex flex-col gap-4 text-center items-center">
          <h3 className="text-2xl font-bold text-yellow-800">Objective Complete!</h3>
          <p className="text-xl font-semibold text-orange-950">{claimableMission.title}</p>
          <p className="text-orange-800 leading-relaxed">You've successfully completed your assignment. Collect your reward to receive your payment and get your next task.</p>
          <div className="mt-4 p-4 bg-green-100/60 rounded-md border border-green-200 w-full">
            <h4 className="font-semibold text-lg text-green-900 mb-2">Reward Waiting:</h4>
            <div className="flex justify-center items-center text-orange-800">
              <span className="font-mono font-bold text-2xl text-green-700">
                {`$${claimableMission.reward.money.toLocaleString()} & ${claimableMission.reward.xp.toLocaleString()} XP`}
              </span>
            </div>
          </div>
          <button
            onClick={onClaimReward}
            className="w-full mt-4 py-3 text-lg font-bold rounded-lg transition-colors bg-green-600 text-white hover:bg-green-700 disabled:bg-orange-100 disabled:text-orange-400"
          >
            Claim Reward
          </button>
        </div>
      );
    }

    if (activeMission) {
      return (
        <div className="p-4 bg-orange-100/50 border border-orange-200 rounded-lg flex flex-col gap-4">
          <h3 className="text-xl font-bold text-orange-950">{activeMission.title}</h3>
          <p className="text-orange-800 leading-relaxed">{activeMission.description}</p>
          
          <div className="border-t border-orange-200 pt-4">
            <h4 className="font-semibold text-lg text-orange-900 mb-2">Objective</h4>
            <div className="flex items-center gap-3 bg-orange-50/70 p-3 rounded-md">
              <div className="w-5 h-5 border-2 border-orange-400 rounded"></div>
              <p className="text-orange-800">{activeMission.objective}</p>
            </div>
          </div>

          <div className="border-t border-orange-200 pt-4">
            <h4 className="font-semibold text-lg text-orange-900 mb-2">Rewards</h4>
            <div className="bg-green-100/60 p-4 rounded-md border border-green-200">
                <div className="flex justify-between items-center text-orange-800">
                    <span className="font-semibold">On Completion:</span>
                    <span className="font-mono font-bold text-green-700">
                        {`$${activeMission.reward.money.toLocaleString()} & ${activeMission.reward.xp.toLocaleString()} XP`}
                    </span>
                </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center p-8 text-orange-600">
        <p className="text-lg">No active missions.</p>
        <p className="text-sm">You've either completed all available jobs or need to advance your career to unlock more.</p>
      </div>
    );
  };

  return (
    <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="missions-modal-title"
    >
      <div 
        className="bg-orange-50/95 backdrop-blur-md border border-orange-200 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-2xl m-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-orange-200 pb-4 mb-4">
          <div className="flex items-center gap-4">
            <ClipboardDocumentListIcon className="h-8 w-8 text-sky-600" />
            <h2 id="missions-modal-title" className="text-2xl font-bold text-sky-600">Your Assignment</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-orange-600 text-3xl leading-none hover:text-orange-900 transition-colors"
            aria-label="Close missions modal"
          >&times;</button>
        </div>
        
        <div className="overflow-y-auto pr-2 -mr-4 flex-grow">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default MissionsModal;
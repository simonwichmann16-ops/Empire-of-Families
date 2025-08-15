
import React, { useState } from 'react';
import { Player, SkillBranch, Skill } from '../types';
import { BrainIcon } from './Icon';

interface SkillsModalProps {
  player: Player;
  skillTree: SkillBranch[];
  onUnlockSkill: (skill: Skill) => void;
  onClose: () => void;
  disabled: boolean;
}

const SkillCard: React.FC<{
  skill: Skill;
  player: Player;
  onUnlock: (skill: Skill) => void;
  isUnlocked: boolean;
  canUnlock: boolean;
  disabled: boolean;
}> = ({ skill, player, onUnlock, isUnlocked, canUnlock, disabled }) => {
  return (
    <div className={`p-4 rounded-lg bg-orange-100/50 border ${isUnlocked ? 'border-purple-300' : 'border-orange-200'} ${!isUnlocked && !canUnlock ? 'opacity-50' : ''}`}>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <div>
          <h4 className="font-bold text-orange-900">{skill.name}</h4>
          <p className="text-sm text-orange-700">{skill.description}</p>
        </div>
        <div className="flex-shrink-0 mt-2 sm:mt-0">
          {isUnlocked ? (
            <div className="text-sm font-bold px-3 py-1 rounded-full bg-purple-200 text-purple-800">
              Unlocked
            </div>
          ) : (
            <button
              onClick={() => onUnlock(skill)}
              disabled={disabled || !canUnlock}
              className="px-4 py-2 text-sm font-semibold rounded-md transition-colors text-center bg-purple-600 text-white hover:bg-purple-700 disabled:bg-orange-200 disabled:text-orange-500 disabled:cursor-not-allowed"
            >
              Unlock ({skill.cost} SP)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const SkillsModal: React.FC<SkillsModalProps> = ({ player, skillTree, onUnlockSkill, onClose, disabled }) => {
  const [activeTab, setActiveTab] = useState<SkillBranch['id']>(skillTree[0].id);

  const activeBranch = skillTree.find(branch => branch.id === activeTab);

  const TabButton: React.FC<{ branch: SkillBranch }> = ({ branch }) => (
    <button
      onClick={() => setActiveTab(branch.id)}
      className={`px-4 py-2 font-bold text-lg rounded-t-md transition-colors ${activeTab === branch.id ? 'bg-orange-50/50 text-purple-700' : 'bg-transparent text-orange-600 hover:bg-orange-100/50'}`}
    >
      {branch.name}
    </button>
  );

  return (
    <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="skills-modal-title"
    >
      <div 
        className="bg-orange-50/95 backdrop-blur-md border border-orange-200 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-3xl m-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-orange-200 pb-4 mb-1">
          <div className="flex items-center gap-4">
            <BrainIcon className="h-8 w-8 text-purple-600" />
            <h2 id="skills-modal-title" className="text-2xl font-bold text-purple-600">Skills & Specialization</h2>
          </div>
          <button 
            onClick={onClose} 
            className="text-orange-600 text-3xl leading-none hover:text-orange-900 transition-colors"
            aria-label="Close skills modal"
          >&times;</button>
        </div>

        <div className="flex items-end justify-between mb-4">
            <div className="flex border-b border-orange-200">
                {skillTree.map(branch => <TabButton key={branch.id} branch={branch} />)}
            </div>
            <div className="pb-1 text-lg font-bold text-orange-800">
                Skill Points: <span className="font-mono text-purple-600">{player.skillPoints}</span>
            </div>
        </div>
        
        <div className="overflow-y-auto space-y-4 pr-2 -mr-4 flex-grow">
          {activeBranch && (
            <>
              <p className="text-center text-orange-700 italic">{activeBranch.description}</p>
              <ul className="space-y-3">
                {activeBranch.skills.map(skill => {
                  const isUnlocked = player.unlockedSkills.includes(skill.id);
                  const dependenciesMet = skill.dependencies.every(depId => player.unlockedSkills.includes(depId));
                  const canAfford = player.skillPoints >= skill.cost;
                  const canUnlock = dependenciesMet && canAfford;

                  return (
                    <SkillCard 
                      key={skill.id}
                      skill={skill}
                      player={player}
                      onUnlock={onUnlockSkill}
                      isUnlocked={isUnlocked}
                      canUnlock={canUnlock}
                      disabled={disabled}
                    />
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillsModal;

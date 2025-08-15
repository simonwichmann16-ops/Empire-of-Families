import React from 'react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
      <h3 className="text-2xl font-bold text-amber-800 border-b-2 border-amber-300 pb-2 mb-3">{title}</h3>
      <div className="space-y-3 text-amber-900 leading-relaxed">
        {children}
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rules-modal-title"
    >
      <div
        className="bg-amber-100/95 backdrop-blur-md border border-amber-300 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-3xl m-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-amber-300 pb-4 mb-4 flex-shrink-0">
          <h2 id="rules-modal-title" className="text-3xl font-bold text-amber-700">Game Rules</h2>
          <button
            onClick={onClose}
            className="text-amber-700 text-3xl leading-none hover:text-amber-900 transition-colors"
            aria-label="Close Rules modal"
          >&times;</button>
        </div>
        <div className="overflow-y-auto pr-4 -mr-4">
            <Section title="1. Respect Fellow Players">
                <p>Harassment, hate speech, personal attacks, or any form of discriminatory behavior will not be tolerated. Keep all interactions civil and respectful. This is a game about crime, but that's no excuse for poor sportsmanship.</p>
            </Section>
            
            <Section title="2. No Cheating or Exploiting">
                <p>The use of third-party software, bots, scripts, or any form of automation to play the game is strictly forbidden. Discovering and intentionally abusing a game bug for an unfair advantage is also considered cheating. Play the game as intended.</p>
            </Section>

            <Section title="3. Account Security & Integrity">
                 <p>Do not share your account details with anyone. You are solely responsible for all actions taken on your account. Creating multiple accounts to gain an advantage (e.g., to feed resources to your main account) is prohibited.</p>
            </Section>
            
            <Section title="4. No Real World Trading (RWT)">
                <p>You may not buy, sell, or trade any in-game items, currency, or accounts for real-world money or any other out-of-game compensation. All assets belong within the game's economy.</p>
            </Section>
            
            <Section title="5. Report Bugs, Don't Abuse Them">
                <p>If you discover a bug or an exploit, it is your responsibility to report it immediately through the proper channels. Continuing to use an exploit for personal gain will result in severe penalties.</p>
            </Section>

            <Section title="6. Fair Play & Community">
                <p>Do not engage in activities that disrupt the game for others, such as excessive spamming, scamming, or intentionally trying to crash game systems. Help us build a strong, competitive, and enjoyable community.</p>
                <p className="font-bold mt-4">Violation of these rules may result in temporary suspension or a permanent ban from the game, at the discretion of the administration.</p>
            </Section>
        </div>
      </div>
    </div>
  );
};

export default RulesModal;

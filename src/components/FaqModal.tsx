import React from 'react';

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FaqModal: React.FC<FaqModalProps> = ({ isOpen, onClose }) => {
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
      aria-labelledby="faq-modal-title"
    >
      <div
        className="bg-amber-100/95 backdrop-blur-md border border-amber-300 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-3xl m-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-amber-300 pb-4 mb-4 flex-shrink-0">
          <h2 id="faq-modal-title" className="text-3xl font-bold text-amber-700">Frequently Asked Questions</h2>
          <button
            onClick={onClose}
            className="text-amber-700 text-3xl leading-none hover:text-amber-900 transition-colors"
            aria-label="Close FAQ modal"
          >&times;</button>
        </div>
        <div className="overflow-y-auto pr-4 -mr-4">
            <Section title="What's the Goal?">
                <p>Welcome to the family. Your goal is simple: rise from a nobody on the streets to the most respected and feared crime lord in the world. You'll do this by committing crimes, building your wealth, gaining power, and earning respect. Your journey is measured by your <strong>Rank</strong>. Earn enough <strong>Criminal XP</strong> from your activities, and you'll climb the ladder, unlocking new opportunities and skills along the way.</p>
            </Section>
            
            <Section title="Key Stats Explained">
                <p><strong>Health (HP):</strong> This is your life. Risky actions can get you hurt. If your HP drops too low, you'll be knocked out and wake up at the hospital with lighter pockets. You can pay to heal at any hospital.</p>
                <p><strong>Stamina:</strong> Your energy for strenuous activities, primarily for attacking other players. It regenerates slowly over time. Certain skills can boost your max stamina and regeneration rate.</p>
                <p><strong>Money:</strong> Cash is king. You need it for everything from buying weapons to starting businesses. Keep your cash safe by depositing it in the <strong>Bank</strong>. Money on hand can be stolen if you're attacked and lose.</p>
                <p><strong>Power:</strong> This represents your overall strength and influence. It's the sum of your base power plus the power from all the items you own. Higher power increases your success chance in crimes and helps you win fights against other players.</p>
                <p><strong>Respect:</strong> Your reputation on the streets. Some actions, like winning at the Wheel of Fortune or being respected by other players, will increase this stat.</p>
            </Section>

            <Section title="How to Make Money">
                 <p><strong>Crimes:</strong> The bread and butter of any aspiring criminal. Start with petty theft and work your way up to major felonies and operations. The bigger the crime, the bigger the payout, but also the bigger the risk.</p>
                 <p><strong>Vehicle Theft:</strong> Stealing cars is a specialized crime. You can sell the cars you steal for a quick buck or keep them in your garage. Some vehicles even provide bonuses for heists!</p>
                 <p><strong>Businesses:</strong> A steady, reliable source of income. Purchase businesses in different locations, and they'll generate passive income for you every hour.</p>
                 <p><strong>Drug Trafficking:</strong> The riskiest, but most profitable venture. Buy drugs where they're cheap, travel or smuggle them to another country where prices are high, and sell for a massive profit. Watch out for customs!</p>
                 <p><strong>Heists:</strong> These are complex, multi-stage jobs that require planning and investment. The potential rewards are enormous, but so are the dangers.</p>
                 <p><strong>Casino:</strong> Feeling lucky? The casino offers games of chance where you can win big or lose it all.</p>
            </Section>
            
            <Section title="What are Families?">
                <p>You can't rule the world alone. A <strong>Family</strong> is a group of players working together. You can either create your own family (for a hefty price) or request to join an existing one.</p>
                <p>Being in a family allows you to communicate in a private chat, and more importantly, engage in <strong>Turf Wars</strong>. Families can attack and take control of territories on the City Map. Controlling a territory grants powerful bonuses to all family members in that location, like increased crime success or business income.</p>
            </Section>
            
            <Section title="Skills & Travel">
                <p><strong>Skills:</strong> As you rank up, you'll earn <strong>Skill Points (SP)</strong>. Spend these in the Skills panel to unlock permanent upgrades for your character, like better business income, higher crime success chances, or improved stamina.</p>
                <p><strong>Travel:</strong> The world is your oyster. You can travel between different countries via plane or train. Each location has different opportunities, drug prices, and businesses. Traveling takes time, and you can't perform any actions while in transit.</p>
            </Section>
        </div>
      </div>
    </div>
  );
};

export default FaqModal;

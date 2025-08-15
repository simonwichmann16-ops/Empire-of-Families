import React, { useState, useEffect, useMemo } from 'react';
import { Player } from '../types';

interface Card {
  suit: '♠' | '♥' | '♦' | '♣';
  rank: string;
  value: number;
}

interface HigherOrLowerModalProps {
  player: Player;
  onGameEnd: (bet: number, payout: number, isWin: boolean) => void;
  onClose: () => void;
  disabled: boolean;
}

const SUITS = { '♠': 'text-gray-800', '♥': 'text-red-600', '♦': 'text-red-600', '♣': 'text-gray-800' };
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const createDeck = (): Card[] => {
  const deck: Card[] = [];
  for (const suit of (Object.keys(SUITS) as Array<keyof typeof SUITS>)) {
    for (let i = 0; i < RANKS.length; i++) {
      deck.push({ suit, rank: RANKS[i], value: i + 2 });
    }
  }
  return deck;
};

const CardDisplay: React.FC<{ card: Card | null; isHidden?: boolean }> = ({ card, isHidden }) => (
  <div className={`w-32 h-44 sm:w-40 sm:h-56 rounded-lg shadow-lg flex items-center justify-center transition-all duration-500 transform-style-3d ${isHidden ? 'bg-blue-600' : 'bg-white'}`}>
    {card && !isHidden && (
      <div className={`text-center ${SUITS[card.suit]}`}>
        <div className="text-5xl sm:text-6xl font-bold">{card.rank}</div>
        <div className="text-3xl sm:text-4xl">{card.suit}</div>
      </div>
    )}
  </div>
);

const HigherOrLowerModal: React.FC<HigherOrLowerModalProps> = ({ player, onGameEnd, onClose, disabled }) => {
  const [bet, setBet] = useState(100);
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'result'>('betting');
  const [deck, setDeck] = useState<Card[]>([]);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [nextCard, setNextCard] = useState<Card | null>(null);
  const [streak, setStreak] = useState(0);
  const [message, setMessage] = useState('');
  
  const potentialPayout = useMemo(() => bet * Math.pow(2, streak), [bet, streak]);

  const shuffleAndStart = () => {
    if (bet > player.money) {
        setMessage("You can't afford this bet.");
        return;
    }
    const newDeck = [...createDeck()].sort(() => Math.random() - 0.5);
    setCurrentCard(newDeck.pop()!);
    setDeck(newDeck);
    setGameState('playing');
    setStreak(0);
    setMessage('');
  };

  const handleGuess = (guess: 'higher' | 'lower') => {
    if (!currentCard || deck.length === 0) return;
    
    const drawnCard = deck.pop()!;
    setNextCard(drawnCard);
    setGameState('result');
    
    let isCorrect = false;
    if (guess === 'higher' && drawnCard.value > currentCard.value) isCorrect = true;
    if (guess === 'lower' && drawnCard.value < currentCard.value) isCorrect = true;
    if (drawnCard.value === currentCard.value) {
        // Push is a win
        isCorrect = true;
        setMessage('Push! The card is the same. You continue.');
    }

    setTimeout(() => {
        if (isCorrect) {
            setStreak(prev => prev + 1);
            setCurrentCard(drawnCard);
            setNextCard(null);
            setGameState('playing');
            if (message === 'Push! The card is the same. You continue.') {
              setTimeout(() => setMessage(''), 1500)
            };
        } else {
            setMessage(`Wrong! You lost $${bet.toLocaleString()}.`);
            setTimeout(() => {
                onGameEnd(bet, 0, false);
                onClose();
            }, 2000);
        }
    }, 2000);
  };

  const handleCashOut = () => {
    onGameEnd(bet, potentialPayout, true);
    onClose();
  };

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
        setBet(Math.min(numValue, player.money));
    } else if (value === '') {
        setBet(0);
    }
  };


  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="bg-orange-50/95 backdrop-blur-md border border-orange-200 rounded-lg shadow-2xl p-4 sm:p-6 w-full max-w-lg m-4 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center border-b border-orange-200 pb-3">
            <h2 id="hol-modal-title" className="text-2xl font-bold text-rose-600">Higher or Lower</h2>
            <button onClick={onClose} className="text-orange-600 text-3xl leading-none hover:text-orange-900">&times;</button>
        </div>
        
        {gameState === 'betting' && (
            <div className="flex flex-col gap-4 items-center">
                <p className="text-orange-700">Place your bet. Correctly guess if the next card is higher or lower. Double your money with each correct guess, but lose it all if you're wrong!</p>
                <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400">$</span>
                    <input type="number" value={bet} onChange={handleBetChange} className="w-full bg-white border border-orange-300 rounded-md p-3 pl-6 text-center font-mono text-xl" />
                </div>
                 <button onClick={shuffleAndStart} disabled={disabled || bet <= 0 || bet > player.money} className="w-full py-3 bg-rose-600 text-white font-bold rounded-lg disabled:bg-orange-200">
                    Start Game
                 </button>
                 {message && <p className="text-red-500 font-bold">{message}</p>}
            </div>
        )}
        
        {gameState !== 'betting' && (
            <div className="flex flex-col items-center gap-4">
                <div className="flex justify-around w-full">
                    <div className="text-center">
                        <p className="font-bold text-orange-800">Streak</p>
                        <p className="text-2xl font-mono text-rose-600">{streak}</p>
                    </div>
                    <div className="text-center">
                        <p className="font-bold text-orange-800">Payout</p>
                        <p className="text-2xl font-mono text-green-600">${potentialPayout.toLocaleString()}</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <CardDisplay card={currentCard} />
                    <CardDisplay card={nextCard} isHidden={gameState !== 'result'} />
                </div>
                
                {message && <p className="text-lg font-bold text-rose-600 h-7">{message}</p>}

                <div className="w-full grid grid-cols-2 gap-4">
                    <button onClick={() => handleGuess('lower')} disabled={gameState !== 'playing'} className="py-3 bg-blue-500 text-white font-bold rounded-lg disabled:opacity-50">
                        Lower
                    </button>
                    <button onClick={() => handleGuess('higher')} disabled={gameState !== 'playing'} className="py-3 bg-red-500 text-white font-bold rounded-lg disabled:opacity-50">
                        Higher
                    </button>
                </div>
                 <button onClick={handleCashOut} disabled={gameState !== 'playing' || streak === 0} className="w-full py-3 bg-green-600 text-white font-bold rounded-lg disabled:opacity-50">
                    Cash Out
                 </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default HigherOrLowerModal;

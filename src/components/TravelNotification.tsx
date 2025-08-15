

import React, { useState, useEffect } from 'react';
import { Player } from '../types';
import { AirplaneIcon, TrainIcon } from './Icon';
import { LOCATIONS } from '../constants';

interface TravelNotificationProps {
  player: Player;
  onCancelTravel: () => void;
  onInstantTravel: () => void;
  currentUser: string | null;
}

const TravelNotification: React.FC<TravelNotificationProps> = ({ player, onCancelTravel, onInstantTravel, currentUser }) => {
  const { travelingUntil, travelDestination, travelMode } = player;
  
  const [timeLeft, setTimeLeft] = useState(
    travelingUntil ? Math.round((travelingUntil - Date.now()) / 1000) : 0
  );

  useEffect(() => {
    if (!travelingUntil) return;
    const timer = setInterval(() => {
      const remaining = Math.round((travelingUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        clearInterval(timer);
      }
      setTimeLeft(remaining);
    }, 1000);
    return () => clearInterval(timer);
  }, [travelingUntil]);

  if (timeLeft <= 0 || !travelDestination || !travelMode) return null;
  
  const destinationName = LOCATIONS.find(l => l.id === travelDestination)?.name || 'Unknown';
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="fixed top-0 left-0 right-0 bg-sky-600 text-white py-3 px-6 z-50 shadow-lg flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {travelMode === 'air' ? <AirplaneIcon className="h-6 w-6" /> : <TrainIcon className="h-6 w-6" />}
        <p className="font-bold text-lg">
          Traveling to {destinationName}... Arrival in: <span className="font-mono text-xl">{formattedTime}</span>
        </p>
      </div>
      <div className="flex items-center gap-2">
        {currentUser === 'Dev' && (
          <button 
            onClick={onInstantTravel}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded-md text-sm transition-colors"
            aria-label="Instant travel"
          >
            Instant Travel
          </button>
        )}
        <button 
          onClick={onCancelTravel}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded-md text-sm transition-colors"
          aria-label="Cancel trip"
        >
          Cancel Trip
        </button>
      </div>
    </div>
  );
};

export default TravelNotification;

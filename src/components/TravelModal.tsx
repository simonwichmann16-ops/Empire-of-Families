import React, { useState, useEffect } from 'react';
import { Location, Player } from '../types';
import { AirplaneIcon, TrainIcon } from './Icon';

const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const LocationItemCard: React.FC<{
    location: Location;
    onTravel: (location: Location, mode: 'air' | 'train') => void;
    canAfford: boolean;
    isDisabled: boolean;
    mode: 'air' | 'train';
    nextDeparture: Date;
    eta: Date;
}> = ({ location, onTravel, canAfford, isDisabled, mode, nextDeparture, eta }) => {
    const cost = mode === 'air' ? location.airTravelCost : location.trainTravelCost;
    
    return (
        <li className="flex flex-col gap-3 p-4 bg-amber-200/70 rounded-lg">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-md text-amber-700">
                        {mode === 'air' ? <AirplaneIcon className="h-6 w-6" /> : <TrainIcon className="h-6 w-6" />}
                    </div>
                    <div>
                        <h4 className="font-semibold text-amber-900">{location.name}</h4>
                        <p className="text-sm text-amber-800">{location.description}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-green-700 font-mono text-sm">
                        <span>${cost.toLocaleString()}</span>
                    </div>
                    <button
                        onClick={() => onTravel(location, mode)}
                        disabled={isDisabled || !canAfford}
                        className="px-4 py-1.5 text-sm font-semibold rounded-md transition-colors w-28 text-center
                                   bg-amber-700 text-white hover:bg-amber-800
                                   disabled:bg-amber-200 disabled:text-amber-500 disabled:cursor-not-allowed"
                    >
                        Book Trip
                    </button>
                </div>
            </div>
            <div className="text-xs text-amber-800 pl-12 flex justify-between font-mono">
                <span>Departs: {formatTime(nextDeparture)}</span>
                <span>Arrives: {formatTime(eta)}</span>
            </div>
        </li>
    );
};

interface TravelModalProps {
  locations: Location[];
  player: Player;
  onTravel: (location: Location, mode: 'air' | 'train') => void;
  disabled: boolean;
  onClose: () => void;
}

const TravelModal: React.FC<TravelModalProps> = ({ locations, player, onTravel, disabled, onClose }) => {
  const [activeTab, setActiveTab] = useState<'air' | 'train'>('air');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateTravelTimes = (location: Location, mode: 'air' | 'train') => {
    let departureTime = new Date(currentTime);
    let travelDurationMinutes = 0;

    if (mode === 'air') {
        travelDurationMinutes = location.airTravelDuration;
        const minutes = currentTime.getMinutes();
        let nextDepartureMinute = Math.ceil((minutes + 0.1) / 15) * 15;
        departureTime.setSeconds(0, 0);
        if (nextDepartureMinute >= 60) {
            departureTime.setHours(departureTime.getHours() + 1);
            departureTime.setMinutes(0);
        } else {
            departureTime.setMinutes(nextDepartureMinute);
        }

    } else { // train
        travelDurationMinutes = location.trainTravelDuration;
        departureTime.setMinutes(0, 0, 0);
        if (currentTime.getMinutes() > 0 || currentTime.getSeconds() > 0) {
           departureTime.setHours(departureTime.getHours() + 1);
        }
    }
    
    const eta = new Date(departureTime.getTime() + travelDurationMinutes * 60000);

    return { nextDeparture: departureTime, eta };
  };

  const TabButton: React.FC<{
    label: string;
    tabName: 'air' | 'train';
  }> = ({ label, tabName }) => {
    const isActive = activeTab === tabName;
    return (
      <button
        onClick={() => setActiveTab(tabName)}
        className={`px-4 py-2 font-bold text-lg rounded-t-md transition-colors ${
          isActive
            ? 'bg-amber-100/50 text-amber-800'
            : 'bg-transparent text-amber-700 hover:bg-amber-200/50'
        }`}
      >
        {label}
      </button>
    );
  };
  
  const relevantLocations = locations.filter(l => l.id !== player.location);

  return (
    <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="travel-modal-title"
    >
      <div 
        className="bg-amber-100/95 backdrop-blur-md border border-amber-300 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-2xl m-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-amber-300 pb-4 mb-1">
          <h2 id="travel-modal-title" className="text-2xl font-bold text-amber-800">Travel Destinations</h2>
          <button 
            onClick={onClose} 
            className="text-amber-700 text-3xl leading-none hover:text-amber-900 transition-colors"
            aria-label="Close travel modal"
          >&times;</button>
        </div>
        <div className="flex border-b border-amber-300 mb-4">
            <TabButton label="Air Travel" tabName="air" />
            <TabButton label="Train Travel" tabName="train" />
        </div>
        <ul className="overflow-y-auto space-y-3 pr-2 -mr-4">
          {relevantLocations.map(location => {
            const { nextDeparture, eta } = calculateTravelTimes(location, activeTab);
            const cost = activeTab === 'air' ? location.airTravelCost : location.trainTravelCost;
            return (
                <LocationItemCard 
                    key={location.id}
                    location={location}
                    onTravel={onTravel}
                    canAfford={player.money >= cost}
                    isDisabled={disabled}
                    mode={activeTab}
                    nextDeparture={nextDeparture}
                    eta={eta}
                />
            )
          })}
        </ul>
      </div>
    </div>
  );
};

export default TravelModal;

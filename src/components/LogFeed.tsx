import React from 'react';
import { GameEvent } from '../types';

const LogFeed: React.FC<{ events: GameEvent[] }> = ({ events }) => {

  const getTextColorClass = (event: GameEvent): string => {
    if (event.type === 'crime' || event.type === 'heist') {
      return event.outcome === 'success' ? 'text-green-700' : 'text-red-700';
    }
    return 'text-amber-800';
  };

  return (
    <div className="bg-amber-100/50 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-amber-300 resize-y overflow-auto h-60 min-h-[10rem] flex flex-col">
      <h2 className="text-xl font-bold text-amber-900 border-b border-amber-300 pb-3 mb-4 flex-shrink-0">Event Log</h2>
      <div className="overflow-y-auto flex-grow pr-2">
        <ul className="flex flex-col gap-3">
          {events.map((event) => (
            <li key={event.id} className={`p-3 rounded-md text-sm animate-fade-in ${event.outcome === 'success' ? 'bg-green-100/50' : event.outcome === 'failure' ? 'bg-red-100/50' : 'bg-amber-200/50'}`}>
              <p className={`font-mono leading-relaxed ${getTextColorClass(event)}`}>{event.message}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LogFeed;

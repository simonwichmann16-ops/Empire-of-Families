import React from 'react';

interface ArrivalNotificationProps {
  locationName: string;
}

const ArrivalNotification: React.FC<ArrivalNotificationProps> = ({ locationName }) => {
  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md p-4 z-[80]">
      <div className="flex items-center justify-center gap-4 px-6 py-4 bg-gradient-to-br from-sky-500 to-indigo-600 text-white rounded-lg shadow-2xl border-2 border-white/50 animate-slide-in-out-top">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 0 1-9-9V7.5a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v4.5a9 9 0 0 1-9 9Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 0 0-9-9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 0 0-9-9" />
        </svg>
        <h2 className="text-xl font-bold tracking-wider">Welcome to {locationName}</h2>
      </div>
    </div>
  );
};

export default ArrivalNotification;

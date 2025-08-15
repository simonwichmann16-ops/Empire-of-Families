import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black/70 z-[70] flex items-center justify-center backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6">
        {/* Cute Thief SVG */}
        <div className="animate-sway">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(10, 0)">
              {/* Legs */}
              <rect x="35" y="95" width="8" height="25" rx="4" fill="#4a5568" />
              <rect x="55" y="95" width="8" height="25" rx="4" fill="#4a5568" />
              {/* Body */}
              <rect x="25" y="50" width="50" height="50" rx="10" fill="#2d3748" />
              {/* White stripe on shirt */}
              <rect x="25" y="68" width="50" height="12" fill="#e2e8f0" />
              {/* Head with beanie */}
              <path d="M50 0C66.5685 0 80 13.4315 80 30V40H20V30C20 13.4315 33.4315 0 50 0Z" fill="#1a202c"/>
              <rect x="20" y="35" width="60" height="15" rx="5" fill="#f7fafc" />
              {/* Eyes that look around */}
              <g className="animate-look-around">
                <circle cx="40" cy="42.5" r="4" fill="#1a202c"/>
                <circle cx="60" cy="42.5" r="4" fill="#1a202c"/>
              </g>
              {/* Loot bag */}
              <g transform="translate(75 70) rotate(10)">
                <path d="M0 10C0 4.47715 4.47715 0 10 0H20C25.5228 0 30 4.47715 30 10V20C30 25.5228 25.5228 30 20 30H10C4.47715 30 0 25.5228 0 20V10Z" fill="#c79b63"/>
                <text x="9" y="21" fontFamily="monospace" fontSize="18" fill="#f7fafc" fontWeight="bold">$</text>
              </g>
            </g>
          </svg>
        </div>
        <p className="text-amber-200 text-lg font-semibold tracking-wider">PLOTTING THE HEIST...</p>
      </div>
    </div>
  );
};

export default Loader;

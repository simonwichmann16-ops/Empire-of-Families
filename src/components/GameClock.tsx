import React, { useState, useEffect } from 'react';

const GameClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-amber-200/80 backdrop-blur-sm border-t border-amber-300 py-2 px-4 z-40">
      <div className="max-w-screen-xl mx-auto text-center">
        <p className="text-sm font-mono text-amber-800 tracking-wider">
          Game Time: <span className="font-bold text-amber-900">{formatTime(time)}</span>
        </p>
      </div>
    </div>
  );
};

export default GameClock;
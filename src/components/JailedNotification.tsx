
import React, { useState, useEffect } from 'react';
import { HandcuffsIcon } from './Icon';

interface JailedNotificationProps {
  jailedUntil: number;
}

const JailedNotification: React.FC<JailedNotificationProps> = ({ jailedUntil }) => {
  const [timeLeft, setTimeLeft] = useState(Math.round((jailedUntil - Date.now()) / 1000));

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = Math.round((jailedUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        clearInterval(timer);
      }
      setTimeLeft(remaining);
    }, 1000);
    return () => clearInterval(timer);
  }, [jailedUntil]);

  if (timeLeft <= 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-3 z-50 shadow-lg flex items-center justify-center gap-4">
      <HandcuffsIcon className="h-6 w-6" />
      <p className="font-bold text-lg">
        JAILED! You can't perform any actions for <span className="font-mono text-xl">{timeLeft}</span> seconds.
      </p>
    </div>
  );
};

export default JailedNotification;

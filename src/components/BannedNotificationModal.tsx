import React from 'react';
import { HandcuffsIcon } from './Icon';

interface BannedNotificationModalProps {
  isOpen: boolean;
  reason: string;
  onClose: () => void;
}

const BannedNotificationModal: React.FC<BannedNotificationModalProps> = ({ isOpen, reason, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="banned-title"
    >
      <div
        className="bg-red-100/95 backdrop-blur-md border border-red-300 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-md m-4 flex flex-col gap-4 items-center text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <HandcuffsIcon className="h-12 w-12 text-red-600" />
        <h2 id="banned-title" className="text-3xl font-bold text-red-800">Account Banned</h2>
        <p className="text-red-900">
          Your account has been banned by an administrator.
        </p>
        <div className="w-full p-4 bg-red-200/50 border border-red-300 rounded-lg">
            <p className="text-sm text-red-700 font-semibold mb-1">Reason:</p>
            <p className="text-red-900 italic">"{reason}"</p>
        </div>
        <button
          onClick={onClose}
          className="mt-2 px-6 py-2 font-semibold rounded-md transition-colors bg-red-600 text-white hover:bg-red-700"
        >
          Acknowledge
        </button>
      </div>
    </div>
  );
};

export default BannedNotificationModal;

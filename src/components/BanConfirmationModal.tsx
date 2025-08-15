import React, { useState } from 'react';

interface BanConfirmationModalProps {
  isOpen: boolean;
  username: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

const BanConfirmationModal: React.FC<BanConfirmationModalProps> = ({ isOpen, username, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (reason.trim()) {
      onConfirm(reason.trim());
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ban-confirm-title"
    >
      <div
        className="bg-red-50/95 backdrop-blur-md border border-red-200 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-md m-4 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="ban-confirm-title" className="text-2xl font-bold text-red-800">Confirm Ban</h2>
        <p className="text-red-900">
          You are about to ban the user <strong className="font-mono">{username}</strong>. Please provide a clear reason for this action. This reason will be shown to the user if they attempt to log in.
        </p>
        <div>
          <label htmlFor="ban-reason" className="block text-sm font-bold text-red-900 mb-2">
            Reason for Ban
          </label>
          <textarea
            id="ban-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full h-24 p-2 bg-white border border-red-300 rounded-md text-red-800 focus:ring-2 focus:ring-red-500 focus:outline-none"
            placeholder="e.g., Exploiting game mechanics, harassment..."
            required
            aria-label="Reason for ban"
          />
        </div>
        <div className="flex justify-end gap-3 mt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold rounded-md transition-colors bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!reason.trim()}
            className="px-4 py-2 font-semibold rounded-md transition-colors bg-red-600 text-white hover:bg-red-700 disabled:bg-red-200 disabled:cursor-not-allowed"
          >
            Confirm Ban
          </button>
        </div>
      </div>
    </div>
  );
};

export default BanConfirmationModal;

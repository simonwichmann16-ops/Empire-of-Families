
import React, { useState } from 'react';
import { MockUser } from '../types';
import { MailIcon } from './Icon';

interface MessageModalProps {
  recipient: MockUser | null;
  onClose: () => void;
  onSend: (subject: string, body: string) => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ recipient, onClose, onSend }) => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  if (!recipient) return null;

  const handleSend = () => {
    if (subject.trim() && body.trim()) {
      onSend(subject, body);
    }
  };

  return (
    <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in" 
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="message-modal-title"
    >
      <div 
        className="bg-orange-50/95 backdrop-blur-md border border-orange-200 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-2xl m-4 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-orange-200 pb-4">
          <h2 id="message-modal-title" className="text-2xl font-bold text-sky-600">Send Message</h2>
          <button 
            onClick={onClose} 
            className="text-orange-600 text-3xl leading-none hover:text-orange-900 transition-colors"
            aria-label="Close message modal"
          >&times;</button>
        </div>
        
        <div>
          <label className="block text-sm font-bold text-orange-800 mb-1">To:</label>
          <p className="p-2 bg-orange-100/50 rounded-md text-orange-900 font-semibold">{recipient.name}</p>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-bold text-orange-800 mb-1">Subject:</label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-white border border-orange-300 rounded-md p-2 font-sans focus:ring-2 focus:ring-sky-500 focus:outline-none"
            maxLength={100}
          />
        </div>

        <div>
          <label htmlFor="body" className="block text-sm font-bold text-orange-800 mb-1">Body:</label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full h-40 bg-white border border-orange-300 rounded-md p-2 font-sans focus:ring-2 focus:ring-sky-500 focus:outline-none resize-y"
            maxLength={1000}
          />
        </div>

        <button
          onClick={handleSend}
          disabled={!subject.trim() || !body.trim()}
          className="w-full flex items-center justify-center gap-2 py-3 text-lg font-bold rounded-lg transition-colors bg-sky-600 text-white hover:bg-sky-700 disabled:bg-orange-100 disabled:text-orange-400"
        >
          <MailIcon className="h-6 w-6" />
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageModal;

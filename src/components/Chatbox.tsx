import React, { useState, useLayoutEffect, useRef } from 'react';
import { Player, ChatMessage, MockUser } from '../types';
import { MegaphoneIcon } from './Icon';

interface ChatboxProps {
  player: Player;
  messages: ChatMessage[];
  onSendMessage: (message: string, channel: 'global' | 'local' | 'family') => void;
  onlineUsers: MockUser[];
  onOpenProfile: (user: MockUser) => void;
}

const Chatbox: React.FC<ChatboxProps> = ({ player, messages, onSendMessage, onlineUsers, onOpenProfile }) => {
  const [activeTab, setActiveTab] = useState<'global' | 'local' | 'family'>('global');
  const [messageInput, setMessageInput] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const scrollNode = scrollContainerRef.current;
    if (scrollNode) {
      // Check if the user was scrolled close to the bottom before new messages were rendered.
      // We compare the previous scroll state (scrollTop) with the new scrollHeight.
      const wasScrolledNearBottom = scrollNode.scrollHeight - scrollNode.clientHeight <= scrollNode.scrollTop + 100;

      if (wasScrolledNearBottom) {
        // If so, auto-scroll to the new bottom.
        // Setting scrollTop directly is more reliable than scrollIntoView() and avoids page jumps.
        scrollNode.scrollTop = scrollNode.scrollHeight;
      }
    }
  }, [messages, activeTab]);

  const filteredMessages = messages.filter(msg => {
    if (activeTab === 'global') return msg.channel === 'global';
    if (activeTab === 'local') return msg.channel === 'local' && msg.locationId === player.location;
    if (activeTab === 'family') return msg.channel === 'family' && msg.familyName === player.familyName;
    return false;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      onSendMessage(messageInput.trim(), activeTab);
      setMessageInput('');
    }
  };

  const TabButton: React.FC<{ label: string; tabName: 'global' | 'local' | 'family'; }> = ({ label, tabName }) => {
    const isActive = activeTab === tabName;
    return (
      <button
        onClick={() => setActiveTab(tabName)}
        className={`px-4 py-2 font-bold text-sm rounded-t-md transition-colors ${
          isActive ? 'bg-amber-200/50 text-amber-800' : 'bg-transparent text-amber-700 hover:bg-amber-200/30'
        }`}
      >
        {label}
      </button>
    );
  };
  
  const handleOpenSenderProfile = (senderId: string) => {
    const user = onlineUsers.find(u => u.id === senderId);
    if (user) {
        onOpenProfile(user);
    }
  };

  return (
    <div className="bg-amber-100/50 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-amber-300 h-96 flex flex-col">
      <div className="flex justify-between items-center border-b border-amber-300 pb-3 mb-2 flex-shrink-0">
        <div className="flex items-center gap-3">
            <MegaphoneIcon className="h-6 w-6 text-amber-700" />
            <h2 className="text-xl font-bold text-amber-900">Chat</h2>
        </div>
        <div className="flex border-b-0">
          <TabButton label="Global" tabName="global" />
          <TabButton label="Local" tabName="local" />
          {player.familyName && <TabButton label="Family" tabName="family" />}
        </div>
      </div>

      <div ref={scrollContainerRef} className="overflow-y-auto flex-grow pr-2 space-y-3 py-2">
        {filteredMessages.map(msg => (
          <div key={msg.id} className={`flex flex-col ${msg.senderId === 'player' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[80%] p-2 rounded-lg ${
                msg.isSystemMessage
                ? 'bg-amber-100/80 italic w-full text-center'
                : msg.senderId === 'player' 
                ? 'bg-blue-200/80' 
                : 'bg-white/80'
            }`}>
              {!msg.isSystemMessage && msg.senderId !== 'player' && (
                <button
                    onClick={() => handleOpenSenderProfile(msg.senderId)}
                    className="font-bold text-xs text-amber-800 hover:underline text-left disabled:no-underline disabled:cursor-default"
                    disabled={!onlineUsers.some(u => u.id === msg.senderId)}
                >
                    {msg.senderName}
                </button>
              )}
              <p className={`text-sm break-words ${msg.isSystemMessage ? 'text-amber-800' : 'text-amber-950'}`}>
                {msg.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-2 pt-3 border-t border-amber-300 flex-shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder={`Message in ${activeTab}...`}
            className="w-full bg-white border border-amber-400 rounded-md p-2 font-sans focus:ring-2 focus:ring-amber-600 focus:outline-none"
            disabled={activeTab === 'family' && !player.familyName}
          />
          <button type="submit" className="px-4 py-2 font-semibold rounded-md transition-colors bg-amber-700 text-white hover:bg-amber-800 disabled:bg-amber-200">
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbox;

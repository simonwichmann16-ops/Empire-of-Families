
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { MailMessage, MockUser } from '../types';
import { MailIcon } from './Icon';

interface MailModalProps {
  messages: MailMessage[];
  currentUser: string | null;
  onlineUsers: MockUser[];
  onClose: () => void;
  onDelete: (messageId: string) => void;
  onMarkAsRead: (messageId: string) => void;
  onSendMessage: (recipientName: string, subject: string, body: string) => void;
}

const MailModal: React.FC<MailModalProps> = ({ messages, currentUser, onlineUsers, onClose, onDelete, onMarkAsRead, onSendMessage }) => {
    const [selectedConvo, setSelectedConvo] = useState<string | null>(null);
    const [isComposing, setIsComposing] = useState(false);

    const [composeRecipient, setComposeRecipient] = useState('');
    const [composeSubject, setComposeSubject] = useState('');
    const [composeBody, setComposeBody] = useState('');
    const [replyBody, setReplyBody] = useState('');

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const conversations = useMemo(() => {
        const convos: { [key: string]: MailMessage[] } = {};
        messages.forEach(msg => {
            const otherPerson = msg.sender === 'You' ? msg.recipient : msg.sender;
            if (otherPerson) {
                if (!convos[otherPerson]) {
                    convos[otherPerson] = [];
                }
                convos[otherPerson].push(msg);
            }
        });
        Object.values(convos).forEach(msgs => msgs.sort((a, b) => a.timestamp - b.timestamp));
        return convos;
    }, [messages]);

    const sortedConversationKeys = useMemo(() => {
        return Object.keys(conversations).sort((a, b) => {
            const lastMsgA = conversations[a][conversations[a].length - 1];
            const lastMsgB = conversations[b][conversations[b].length - 1];
            return lastMsgB.timestamp - lastMsgA.timestamp;
        });
    }, [conversations]);
    
    useEffect(() => {
        if (!selectedConvo && sortedConversationKeys.length > 0 && !isComposing) {
            setSelectedConvo(sortedConversationKeys[0]);
        }
    }, [sortedConversationKeys, isComposing, selectedConvo]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [selectedConvo, conversations, isComposing, replyBody]);
    
    const handleSelectConvo = (convoKey: string) => {
        setSelectedConvo(convoKey);
        setIsComposing(false);
        const unread = conversations[convoKey].filter(m => !m.isRead && m.sender !== 'You');
        unread.forEach(m => onMarkAsRead(m.id));
    };

    const handleStartCompose = () => {
        setIsComposing(true);
        setSelectedConvo(null);
        setComposeRecipient('');
        setComposeSubject('');
        setComposeBody('');
    };

    const handleSend = () => {
        if (composeRecipient.trim() && composeSubject.trim() && composeBody.trim()) {
            onSendMessage(composeRecipient, composeSubject, composeBody);
            // Clear fields for next message
            setComposeRecipient('');
            setComposeSubject('');
            setComposeBody('');
            setIsComposing(false);
        }
    };
    
    const currentMessages = selectedConvo ? conversations[selectedConvo] : [];

    const handleSendReply = () => {
        if (!selectedConvo || !replyBody.trim()) return;
    
        const lastMessage = currentMessages.length > 0 ? currentMessages[currentMessages.length - 1] : null;
        let replySubject = 'Re: New Message'; // fallback
        if (lastMessage) {
            replySubject = lastMessage.subject.startsWith('Re: ') ? lastMessage.subject : `Re: ${lastMessage.subject}`;
        }
    
        onSendMessage(selectedConvo, replySubject, replyBody);
        setReplyBody('');
    };


    return (
        <div 
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm animate-fade-in" 
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mail-modal-title"
        >
          <div 
            className="bg-orange-50/95 backdrop-blur-md border border-orange-200 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-4xl m-4 h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-orange-200 pb-4 mb-4 flex-shrink-0">
              <h2 id="mail-modal-title" className="text-2xl font-bold text-sky-600">Inbox</h2>
              <button 
                onClick={onClose} 
                className="text-orange-600 text-3xl leading-none hover:text-orange-900 transition-colors"
                aria-label="Close mail modal"
              >&times;</button>
            </div>
            
            <div className="flex-grow flex gap-4 overflow-hidden">
              {/* Conversation List */}
              <div className="w-1/3 border-r border-orange-200 pr-4 flex flex-col">
                <div className="overflow-y-auto flex-grow">
                    <ul className="space-y-2">
                    {sortedConversationKeys.map(convoKey => {
                        const convoMessages = conversations[convoKey];
                        const lastMessage = convoMessages[convoMessages.length - 1];
                        const hasUnread = convoMessages.some(m => !m.isRead && m.sender !== 'You');
                        
                        return (
                            <li 
                            key={convoKey} 
                            onClick={() => handleSelectConvo(convoKey)}
                            className={`p-3 rounded-lg cursor-pointer ${selectedConvo === convoKey && !isComposing ? 'bg-orange-200/80' : 'hover:bg-orange-100/50'}`}
                            >
                            <div className="flex justify-between items-center">
                                <p className={`font-bold text-orange-900 truncate ${hasUnread ? 'font-extrabold' : ''}`}>{convoKey}</p>
                                {hasUnread && <div className="h-2.5 w-2.5 bg-blue-500 rounded-full flex-shrink-0"></div>}
                            </div>
                            <p className="text-sm text-orange-700 truncate">{lastMessage.subject}</p>
                            <p className="text-xs text-orange-500 mt-1">{new Date(lastMessage.timestamp).toLocaleString()}</p>
                            </li>
                        )
                    })}
                    </ul>
                </div>
                 <div className="mt-4 pt-4 border-t border-orange-200 flex-shrink-0">
                  <button
                    onClick={handleStartCompose}
                    className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-md transition-colors bg-sky-600 text-white hover:bg-sky-700"
                  >
                    Compose New Message
                  </button>
                </div>
              </div>

              {/* Message Content */}
              <div className="w-2/3 flex flex-col">
                {isComposing ? (
                    <div className="flex-grow flex flex-col gap-3">
                        <h3 className="text-xl font-bold text-orange-950">New Message</h3>
                        <input type="text" list="user-names" value={composeRecipient} onChange={e => setComposeRecipient(e.target.value)} placeholder="Recipient" className="w-full bg-white border border-orange-300 rounded-md p-2 font-sans focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                        <datalist id="user-names">
                            {onlineUsers.filter(u => !u.isNpc).map(u => <option key={u.id} value={u.name} />)}
                        </datalist>
                        <input type="text" value={composeSubject} onChange={e => setComposeSubject(e.target.value)} placeholder="Subject" className="w-full bg-white border border-orange-300 rounded-md p-2 font-sans focus:ring-2 focus:ring-sky-500 focus:outline-none" />
                        <textarea value={composeBody} onChange={e => setComposeBody(e.target.value)} placeholder="Your message..." className="w-full flex-grow bg-white border border-orange-300 rounded-md p-2 font-sans resize-none" />
                        <button onClick={handleSend} disabled={!composeRecipient.trim() || !composeSubject.trim() || !composeBody.trim()} className="w-full flex items-center justify-center gap-2 py-3 font-semibold rounded-md transition-colors bg-sky-600 text-white hover:bg-sky-700 disabled:bg-orange-200 disabled:text-orange-500">
                           <MailIcon className="h-5 w-5"/> Send Message
                        </button>
                    </div>
                ) : selectedConvo ? (
                    <div className="flex-grow flex flex-col overflow-hidden">
                        <h3 className="text-xl font-bold text-orange-950 flex-shrink-0 border-b border-orange-200 pb-2 mb-2">Conversation with {selectedConvo}</h3>
                        <div className="overflow-y-auto flex-grow pr-2 space-y-3 py-2">
                            {currentMessages.map(msg => (
                                <div key={msg.id} className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-lg ${msg.sender === 'You' ? 'bg-blue-200/80' : 'bg-white/80'}`}>
                                        <p className="font-bold text-xs text-orange-800">{msg.subject}</p>
                                        <p className="text-sm break-words text-orange-950 whitespace-pre-wrap">{msg.body}</p>
                                        <p className="text-xs text-orange-500 text-right mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="mt-2 pt-3 border-t border-orange-200 flex-shrink-0">
                            <form onSubmit={(e) => { e.preventDefault(); handleSendReply(); }}>
                                <div className="flex flex-col gap-2">
                                    <textarea
                                        value={replyBody}
                                        onChange={(e) => setReplyBody(e.target.value)}
                                        placeholder={`Reply to ${selectedConvo}...`}
                                        className="w-full h-20 bg-white border border-orange-300 rounded-md p-2 font-sans resize-y focus:ring-2 focus:ring-sky-500 focus:outline-none"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!replyBody.trim()}
                                        className="w-full flex items-center justify-center gap-2 py-2 font-semibold rounded-md transition-colors bg-sky-600 text-white hover:bg-sky-700 disabled:bg-orange-200 disabled:text-orange-500"
                                    >
                                        <MailIcon className="h-5 w-5"/> Send Reply
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-orange-500">
                        <p>Select a conversation or compose a new message.</p>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
    );
};

export default MailModal;

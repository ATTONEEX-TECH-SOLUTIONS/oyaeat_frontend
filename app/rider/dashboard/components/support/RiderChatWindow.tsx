'use client';

import React from 'react';
import { HelpCircle, Loader2, Send, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { type Thread, type Message } from '@/lib/types/chat';

interface RiderChatWindowProps {
  isCreating: boolean;
  activeThreadId: string | null;
  activeThread: Thread | undefined;
  loadingMessages: boolean;
  messages: Message[];
  replyText: string;
  setReplyText: (val: string) => void;
  sending: boolean;
  newSubject: string;
  setNewSubject: (val: string) => void;
  setIsCreating: (val: boolean) => void;
  handleCreateTicket: (e: React.FormEvent) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
}

export function RiderChatWindow({
  isCreating,
  activeThreadId,
  activeThread,
  loadingMessages,
  messages,
  replyText,
  setReplyText,
  sending,
  newSubject,
  setNewSubject,
  setIsCreating,
  handleCreateTicket,
  handleSendMessage,
  chatEndRef
}: RiderChatWindowProps) {
  return (
    <div className="flex-1 flex flex-col bg-white h-full">
      {isCreating ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-3 border border-green-100">
            <MessageSquare className="w-6 h-6 text-green-700" />
          </div>
          <h3 className="text-base font-extrabold text-gray-900 mb-1">Create Complaint Ticket</h3>
          <p className="text-xs text-gray-500 mb-6 max-w-xs font-medium leading-relaxed">
            Submit your ticket parameters here. An administration officer will be linked into the room channel.
          </p>
          <form onSubmit={handleCreateTicket} className="w-full max-w-sm space-y-3">
            <input
              type="text"
              placeholder="Describe your inquiry topic heading..."
              value={newSubject}
              onChange={e => setNewSubject(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-green-600 outline-none font-bold text-gray-900 text-xs shadow-sm transition-all"
              maxLength={60}
              required
            />
            <button
              type="submit"
              disabled={sending || !newSubject.trim()}
              className="w-full h-11 rounded-xl bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-1.5"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              Dispatch Help Request
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="w-full text-center text-[11px] font-bold text-slate-400 hover:text-slate-600 pt-1"
            >
              Cancel
            </button>
          </form>
        </div>
      ) : activeThreadId ? (
        <>
          <div className="p-4 border-b border-gray-100 bg-white flex items-center gap-2 flex-shrink-0 text-left">
            <HelpCircle className="w-4 h-4 text-green-600" />
            <span className="text-xs font-black text-gray-900">{activeThread?.subject}</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
            {loadingMessages ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin text-green-600" />
              </div>
            ) : (
              messages.map((msg: any, i) => {
                // 🚀 CASE-INSENSITIVE EVALUATION: Resolves right/left alignment styling bugs
                const isMe = msg.senderRole?.toLowerCase() === "rider";
                
                const senderName = msg.sender 
                  ? `${msg.sender.firstName || ''} ${msg.sender.lastName || ''}`.trim() || msg.senderRole
                  : "Support Panel";

                const threadParticipants = msg.thread?.participants || [];
                const destinationParty = threadParticipants.find((p: any) => p.id !== msg.senderId);
                const receiverName = destinationParty 
                  ? `${destinationParty.firstName || ''} ${destinationParty.lastName || ''}`.trim()
                  : "You";

                return (
                  <div key={msg.id || i} className={`flex flex-col ${isMe ? "items-end" : "items-start"} w-full group text-left`}>
                    <div className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      isMe ? "bg-green-700 text-white rounded-tr-none" : "bg-white border border-gray-100 text-gray-900 rounded-tl-none"
                    }`}>
                      <p className="font-bold mb-1 text-[9px] opacity-75 uppercase tracking-wide">
                        {isMe ? "You (Rider)" : `${senderName} (Support)`}
                      </p>
                      <p className="font-medium">{msg.content}</p>
                    </div>
                    
                    <span className="text-[9px] text-gray-400 font-extrabold px-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider">
                      {isMe ? `You ➔ ${receiverName}` : `${senderName} ➔ You`}
                      {msg.createdAt && ` • ${formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}`}
                    </span>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 flex gap-2 flex-shrink-0 bg-white">
            <input
              type="text"
              placeholder="Type your reply message..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 text-xs focus:outline-none focus:border-green-600 text-gray-900 font-semibold"
            />
            <button 
              type="submit" 
              disabled={sending || !replyText.trim()} 
              className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl transition-all disabled:opacity-40 flex items-center justify-center shrink-0 w-11 h-11"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400 text-xs font-bold bg-slate-50/20">
          Select a support ticket to review active messaging dialogue channels.
        </div>
      )}
    </div>
  );
}

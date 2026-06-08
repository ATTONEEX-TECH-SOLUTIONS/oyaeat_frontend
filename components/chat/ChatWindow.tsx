'use client';

import React from 'react';
import { MessageSquare, Loader2, MessageCircle, Send } from 'lucide-react';
import { MessageItem } from './MessageItem';
import { type Thread, type Message } from '@/lib/types/chat';

interface ChatWindowProps {
  role: 'customer' | 'admin' | 'vendor' | 'rider';
  currentUserId?: string;
  isCreating: boolean;
  activeThreadId: string | null;
  threads: Thread[];
  loadingMessages: boolean;
  messages: Message[];
  inputText: string;
  sending: boolean;
  newSubject: string;
  setNewSubject: (val: string) => void;
  setInputText: (val: string) => void;
  setIsCreating: (val: boolean) => void;
  setActiveThreadId: (val: string | null) => void;
  handleCreateThread: (e: React.FormEvent) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export function ChatWindow({
  role,
  currentUserId,
  isCreating,
  activeThreadId,
  threads,
  loadingMessages,
  messages,
  inputText,
  sending,
  newSubject,
  setNewSubject,
  setInputText,
  setIsCreating,
  setActiveThreadId,
  handleCreateThread,
  handleSendMessage,
  messagesEndRef
}: ChatWindowProps) {
  return (
    <div className="flex-1 flex flex-col bg-white relative">
      {isCreating ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 bg-[#e8f5e9] rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="w-8 h-8 text-[#1a5c2a]" />
          </div>
          <h2 className="text-xl font-extrabold text-gray-900 mb-2">Start a New Conversation</h2>
          <p className="text-sm text-gray-500 mb-8 max-w-sm font-semibold">Create a support ticket. Our team will respond shortly.</p>
          <form onSubmit={handleCreateThread} className="w-full max-w-md">
            <input
              type="text"
              placeholder="Subject of your inquiry..."
              value={newSubject}
              onChange={e => setNewSubject(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#1a5c2a] outline-none font-bold text-gray-900 shadow-sm transition-all mb-4"
              maxLength={60}
              required
            />
            <button
              type="submit"
              disabled={sending || !newSubject.trim()}
              className="w-full py-3 rounded-xl bg-[#1a5c2a] text-white font-extrabold shadow-md hover:bg-[#14491f] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Create Ticket
            </button>
            <button
              type="button"
              onClick={() => { setIsCreating(false); if(threads.length > 0) setActiveThreadId(threads[0].id); }}
              className="w-full mt-3 py-3 rounded-xl text-gray-500 font-bold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </form>
        </div>
      ) : !activeThreadId ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/10">
          <MessageCircle className="w-16 h-16 mb-4 opacity-10" />
          <p className="font-bold text-sm">Select a conversation</p>
        </div>
      ) : (
        <>
          <div className="px-6 py-4 border-b border-gray-100 flex items-center shadow-sm z-10 bg-white">
            <h2 className="font-extrabold text-gray-900 text-sm tracking-tight">
              {threads.find(t => t.id === activeThreadId)?.subject || 'Chat'}
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
            {loadingMessages ? (
              <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-[#1a5c2a]" /></div>
            ) : messages.length === 0 ? (
              <div className="text-center text-sm font-bold text-gray-400 py-10">No messages yet. Say hello!</div>
            ) : (
              messages.map((msg, i) => (
                <MessageItem
                  key={msg.id || i}
                  msg={msg}
                  currentRole={role}
                  currentUserId={currentUserId}
                  showAvatar={!i || messages[i - 1].senderId !== msg.senderId}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-gray-100">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                className="flex-1 bg-gray-50 border-transparent focus:border-[#1a5c2a]/30 focus:bg-white focus:ring-0 outline-none px-4 py-3 rounded-full text-sm font-semibold transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || sending}
                className="w-12 h-12 flex flex-shrink-0 items-center justify-center rounded-full bg-[#1a5c2a] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#14491f] hover:-translate-y-0.5 hover:shadow-md transition-all"
              >
                {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4 translate-x-0.5" />}
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

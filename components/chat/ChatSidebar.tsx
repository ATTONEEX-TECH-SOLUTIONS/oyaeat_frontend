'use client';

import React from 'react';
import { MessageSquare, Plus, Loader2, Search, MessageCircle } from 'lucide-react';
import { ThreadListItem } from './ThreadListItem';
import { type Thread } from '@/lib/types/chat';

interface ChatSidebarProps {
  role: 'customer' | 'admin' | 'vendor' | 'rider';
  currentUserId?: string;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  loadingThreads: boolean;
  filteredThreads: Thread[];
  activeThreadId: string | null;
  isCreating: boolean;
  setIsCreating: (val: boolean) => void;
  setActiveThreadId: (val: string | null) => void;
  onRefresh: () => void; // 🚀 ADDED HERE
}

export function ChatSidebar({
  role,
  currentUserId,
  searchQuery,
  setSearchQuery,
  loadingThreads,
  filteredThreads,
  activeThreadId,
  isCreating,
  setIsCreating,
  setActiveThreadId,
  onRefresh // 🚀 ADDED HERE
}: ChatSidebarProps) {
  return (
    <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/50 shrink-0">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-card shrink-0">
        <h2 className="font-extrabold text-lg text-gray-900 tracking-tight flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-[#1a5c2a]" /> Messages
        </h2>
        {role !== 'admin' && (
          <button 
            onClick={() => setIsCreating(true)}
            className="p-2 rounded-xl bg-[#e8f5e9] text-[#1a5c2a] hover:bg-[#1a5c2a] hover:text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="p-3 border-b border-gray-100 bg-white shrink-0">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, role or topic..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-xl border border-transparent focus:border-[#1a5c2a]/30 focus:bg-white focus:ring-0 outline-none text-xs font-semibold text-gray-800 shadow-inner placeholder-gray-400 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {loadingThreads ? (
          <div className="flex justify-center p-5"><Loader2 className="w-5 h-5 animate-spin text-[#1a5c2a]" /></div>
        ) : filteredThreads.length === 0 ? (
          <div className="text-center py-12 text-gray-400 font-bold text-xs">
            <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-20" />
            {searchQuery ? "No matches found" : "No active conversations"}
          </div>
        ) : (
          filteredThreads.map(thread => (
            <ThreadListItem
              key={thread.id}
              thread={thread}
              isActive={activeThreadId === thread.id && !isCreating}
              currentRole={role}
              onClick={() => { setIsCreating(false); setActiveThreadId(thread.id); }}
              onRefresh={onRefresh} // 🚀 FIXED: Pointing directly to prop instead of undefined local var
              setActiveThreadId={setActiveThreadId} 
            />
          ))
        )}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { Plus, MessageSquare } from 'lucide-react';
import { type Thread } from '@/lib/types/chat';

interface RiderChatSidebarProps {
  threads: Thread[];
  activeThreadId: string | null;
  isCreating: boolean;
  setIsCreating: (val: boolean) => void;
  setActiveThreadId: (id: string | null) => void;
}

export function RiderChatSidebar({
  threads,
  activeThreadId,
  isCreating,
  setIsCreating,
  setActiveThreadId
}: RiderChatSidebarProps) {
  return (
    <div className="w-full md:w-64 border-r border-gray-100 flex flex-col bg-gray-50/30 overflow-y-auto shrink-0">
      <div className="p-3 bg-white border-b border-gray-100 flex justify-between items-center shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Complaints Desk</span>
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="p-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-600 hover:text-white transition-colors border border-green-100"
          title="Create Complaint Ticket"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {threads.map((t) => {
        // Safe context search isolates the admin participant to show their name as the heading
        const otherParty = t.participants?.find(p => p.role.toLowerCase() !== 'rider');
        const displayName = otherParty 
          ? `${otherParty.firstName || ''} ${otherParty.lastName || ''}`.trim() || "System Support"
          : t.subject;

        return (
          <div
            key={t.id}
            onClick={() => { setIsCreating(false); setActiveThreadId(t.id); }}
            className={`p-4 border-b border-gray-100 cursor-pointer transition-colors text-left relative ${
              activeThreadId === t.id && !isCreating ? "bg-green-50/30 border-l-4 border-l-green-600 font-bold" : "hover:bg-gray-50"
            }`}
          >
            <div className="flex justify-between items-start mb-1 gap-1">
              <h4 className="font-bold text-gray-900 text-xs truncate max-w-[130px]">{displayName}</h4>
              <span className="text-[8px] font-bold px-1 py-0.5 rounded uppercase bg-gray-200 text-gray-600 tracking-wide shrink-0">
                {t.status}
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-medium block truncate">Topic: {t.subject}</span>
            <p className="text-[11px] text-gray-500 truncate font-semibold mt-1.5">{t.lastMessage || "New thread"}</p>
          </div>
        );
      })}
      {threads.length === 0 && (
        <div className="p-8 text-center text-xs font-bold text-slate-400">No active support channels.</div>
      )}
    </div>
  );
}

'use client';

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { User2 } from 'lucide-react';
import { type Thread } from '@/lib/types/chat';

interface ThreadListItemProps {
  thread: Thread;
  isActive: boolean;
  currentRole: string; // 🚀 Added to help filter out current user name
  onClick: () => void;
}

export function ThreadListItem({ thread, isActive, currentRole, onClick }: ThreadListItemProps) {
  // 🚀 RECONFIGURED: Locate the OTHER user in this conversation to show their name
  const otherParticipant = thread.participants?.find(p => p.role.toLowerCase() !== currentRole.toLowerCase());
  
  // Format the name nicely, or fallback to the conversation subject line if no participant is found
  const dynamicDisplayTitle = otherParticipant 
    ? `${otherParticipant.firstName || ''} ${otherParticipant.lastName || ''}`.trim() || `${otherParticipant.role.toUpperCase()} Client`
    : thread.subject || 'Support Ticket';

  const participantSubRole = otherParticipant ? otherParticipant.role : 'Admin';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-3 rounded-xl transition-all border block relative ${
        isActive
          ? 'bg-white border-[#1a5c2a]/20 shadow-sm ring-1 ring-[#1a5c2a]/20'
          : 'bg-transparent border-transparent hover:bg-gray-100'
      }`}
    >
      <div className="flex justify-between items-start mb-1 gap-1">
        <div className="flex flex-col truncate pr-1">
          {/* 🚀 Displays the actual full name of the sender/receiver here */}
          <h3 className="font-extrabold text-gray-900 text-xs truncate flex items-center gap-1">
            <span className="truncate">{dynamicDisplayTitle}</span>
            {otherParticipant && (
              <span className="text-[9px] bg-gray-100 text-gray-500 px-1 rounded font-normal capitalize">
                {participantSubRole}
              </span>
            )}
          </h3>
          {/* Keeps the underlying conversation subject line visible as a smaller label */}
          <span className="text-[10px] text-gray-400 font-semibold truncate mt-0.5">
            Topic: {thread.subject}
          </span>
        </div>
        
        <span className="text-[9px] text-gray-400 font-bold whitespace-nowrap uppercase tracking-wider mt-0.5">
          {thread.updatedAt
            ? formatDistanceToNow(new Date(thread.updatedAt), { addSuffix: false }).replace('about ', '')
            : ''}
        </span>
      </div>
      <p className="text-xs text-gray-500 truncate font-medium mt-1 border-t pt-1 border-gray-100/50">
        {thread.lastMessage || 'New inquiry thread...'}
      </p>
    </button>
  );
}

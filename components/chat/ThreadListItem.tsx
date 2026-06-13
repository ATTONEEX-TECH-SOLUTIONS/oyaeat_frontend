'use client';

import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MoreVertical, Lock, Unlock, Trash2 } from 'lucide-react';
import { chatApi } from '@/lib/api/chat';
import { type Thread } from '@/lib/types/chat';

interface ThreadListItemProps {
  thread: Thread;
  isActive: boolean;
  currentRole: string;
  onClick: () => void;
  onRefresh: () => void;
  setActiveThreadId: (id: string | null) => void;
}

export function ThreadListItem({ 
  thread, 
  isActive, 
  currentRole, 
  onClick, 
  onRefresh,
  setActiveThreadId 
}: ThreadListItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  const otherParticipant = thread.participants?.find(p => p.role.toLowerCase() !== currentRole.toLowerCase());
  
  const dynamicDisplayTitle = otherParticipant 
    ? `${otherParticipant.firstName || ''} ${otherParticipant.lastName || ''}`.trim() || `${otherParticipant.role.toUpperCase()} Client`
    : thread.subject || 'Support Ticket';

  const participantSubRole = otherParticipant ? otherParticipant.role : 'Admin';
  const hasUnread = thread.unreadCount > 0;
  const isClosed = thread.status === 'closed';

  const handleToggleStatus = async (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setLoadingAction(true);
    try {
      const targetStatus = isClosed ? 'open' : 'closed';
      await chatApi.toggleThreadStatus(currentRole as any, thread.id, targetStatus);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(false);
      setShowMenu(false);
    }
  };

  const handleDeleteThread = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you absolutely sure you want to delete this thread?")) return;
    setLoadingAction(true);
    try {
      await chatApi.deleteThread(currentRole as any, thread.id);
      if (isActive) setActiveThreadId(null); 
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAction(false);
      setShowMenu(false);
    }
  };

  return (
    <div className="relative group/row">
      <button
        type="button"
        onClick={onClick}
        disabled={loadingAction}
        className={`w-full text-left p-3 rounded-xl transition-all border block relative ${
          isActive
            ? 'bg-white border-[#1a5c2a]/20 shadow-sm ring-1 ring-[#1a5c2a]/20'
            : 'bg-transparent border-transparent hover:bg-gray-100'
        } ${isClosed ? 'opacity-65' : ''}`}
      >
        <div className="flex justify-between items-start mb-1 gap-1">
          <div className="flex flex-col truncate pr-6 flex-1">
            <h3 className={`font-extrabold text-xs truncate flex items-center gap-1.5 ${
              hasUnread && !isActive ? 'text-gray-950 font-black' : 'text-gray-900'
            }`}>
              <span className="truncate">{dynamicDisplayTitle}</span>
              {otherParticipant && (
                <span className="text-[9px] bg-gray-100 text-gray-500 px-1 rounded font-normal capitalize">
                  {participantSubRole}
                </span>
              )}
              <span className={`text-[8px] px-1 rounded font-bold uppercase tracking-wide ${
                isClosed ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
              }`}>
                {thread.status || 'open'}
              </span>
            </h3>
            
            <span className="text-[10px] text-gray-400 font-semibold truncate mt-0.5">
              Topic: {thread.subject}
            </span>
          </div>
          
          <div className="flex flex-col items-end gap-1.5 shrink-0 mt-0.5">
            <span className="text-[9px] text-gray-400 font-bold whitespace-nowrap uppercase tracking-wider">
              {thread.updatedAt
                ? formatDistanceToNow(new Date(thread.updatedAt), { addSuffix: false }).replace('about ', '')
                : ''}
            </span>
            
            {hasUnread && (
              <span className="bg-[#1a5c2a] text-white text-[9px] font-black h-4 min-w-4 px-1 rounded-full flex items-center justify-center animate-pulse shadow-sm">
                {thread.unreadCount}
              </span>
            )}
          </div>
        </div>

        <p className={`text-xs truncate font-medium mt-1 border-t pt-1 border-gray-100/50 ${
          hasUnread && !isActive ? 'text-gray-950 font-bold' : 'text-gray-500'
        }`}>
          {thread.lastSenderName && (
            <span className={`mr-1 font-bold ${
              hasUnread && !isActive ? 'text-[#1a5c2a]' : 'text-gray-700'
            }`}>
              {thread.lastSenderName}:
            </span>
          )}
          {thread.lastMessage || 'New inquiry thread...'}
        </p>
      </button>

      <div className="absolute right-2 top-2 z-10">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
          className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:bg-gray-100 transition-all bg-white/80 shadow-sm border border-gray-100/50"
        >
          <MoreVertical className="w-3.5 h-3.5" />
        </button>

        {showMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
            <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-1 overflow-hidden animate-in fade-in duration-100">
              
              <button
                type="button"
                onClick={handleToggleStatus}
                className="w-full text-left px-3 py-1.5 text-[11px] font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 transition-colors"
              >
                {isClosed ? (
                  <>
                    <Unlock className="w-3 h-3 text-green-600" /> Re-open Ticket
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3 text-amber-600" /> Close Ticket
                  </>
                )}
              </button>

              {currentRole.toLowerCase() === 'admin' && (
                <button
                  type="button"
                  onClick={handleDeleteThread}
                  className="w-full text-left px-3 py-1.5 text-[11px] font-bold text-red-600 hover:bg-red-50 flex items-center gap-1.5 border-t border-gray-100 transition-colors"
                >
                  <Trash2 className="w-3 h-3" /> Delete Forever
                </button>
              )}
              
            </div>
          </>
        )}
      </div>
    </div>
  );
}

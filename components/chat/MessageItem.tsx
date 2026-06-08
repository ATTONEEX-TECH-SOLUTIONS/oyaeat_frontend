'use client';

import React from 'react';
import { User2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { type Message } from '@/lib/types/chat';

interface MessageItemProps {
  msg: Message;
  currentRole: string;
  currentUserId?: string;
  showAvatar: boolean;
}

export function MessageItem({ msg, currentRole, currentUserId, showAvatar }: MessageItemProps) {
  const isMe = msg.senderId === currentUserId || (!currentUserId && msg.senderRole === currentRole);

  const senderName = msg.sender
    ? `${msg.sender.firstName || ''} ${msg.sender.lastName || ''}`.trim() || `User ID: ${msg.senderId}`
    : `User ID: ${msg.senderId}`;

  const participants = msg.thread?.participants || [];
  const otherParty = participants.find((p: any) => p.id !== msg.senderId);

  const receiverName = otherParty
    ? `${otherParty.firstName || ''} ${otherParty.lastName || ''}`.trim() || `User ID: ${otherParty.id}`
    : "Admin Desk";

  const receiverRole = otherParty ? otherParty.role : "Admin";

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} max-w-full group`}>
      {!isMe && (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 mr-3 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm mt-auto">
          {showAvatar ? <User2 className="w-4 h-4 text-gray-400" /> : <div className="w-8 h-8" />}
        </div>
      )}
      <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm font-semibold leading-relaxed shadow-sm ${
            isMe
              ? 'bg-[#1a5c2a] text-white rounded-tr-none'
              : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
          }`}
        >
          {msg.content}
        </div>
        <span className="text-[10px] text-gray-400 font-extrabold mt-1.5 px-1 opacity-80 group-hover:opacity-100 transition-opacity uppercase tracking-wider flex flex-wrap items-center gap-1">
          <span className="text-[#1a5c2a] font-black">{senderName}</span>
          <span className="text-[9px] font-medium opacity-60">({msg.senderRole})</span>
          <span className="mx-0.5 text-slate-300">➔</span>
          <span className="text-slate-600 font-black">{receiverName}</span>
          <span className="text-[9px] font-medium opacity-60">({receiverRole})</span>
          <span className="mx-1 font-normal text-slate-200">•</span>
          <span className="font-normal text-slate-400 font-medium">
            {msg.createdAt ? formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true }).replace('about ', '') : ''}
          </span>
        </span>
      </div>
    </div>
  );
}

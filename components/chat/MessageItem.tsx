'use client';

import React from 'react';
import { User2, ShieldAlert } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { type Message } from '@/lib/types/chat';

interface MessageItemProps {
  msg: Message;
  currentRole: string;
  currentUserId?: string | number;
  showAvatar: boolean;
}

export function MessageItem({ msg, currentRole, currentUserId, showAvatar }: MessageItemProps) {
  // Safe comparison handles integer vs string type variations out of token headers
  const isMe = String(msg.senderId) === String(currentUserId) || (!currentUserId && msg.senderRole === currentRole);
  
  // Identifies if the sender is an official platform admin
  const isAdminSender = msg.senderRole?.toLowerCase() === 'admin';

  const senderName = msg.sender
    ? `${msg.sender.firstName || ''} ${msg.sender.lastName || ''}`.trim() || `User ID: ${msg.senderId}`
    : `User ID: ${msg.senderId}`;

  const participants = msg.thread?.participants || [];
  const otherParty = participants.find((p: any) => String(p.id) !== String(msg.senderId));

  const receiverName = otherParty
    ? `${otherParty.firstName || ''} ${otherParty.lastName || ''}`.trim() || `User ID: ${otherParty.id}`
    : "Admin Desk";

  const receiverRole = otherParty ? otherParty.role : "Admin";

  // Determine chat bubble custom styling classes dynamically
  let bubbleClasses = 'bg-white border border-gray-100 text-gray-800 rounded-tl-none';
  if (isMe) {
    bubbleClasses = 'bg-[#1a5c2a] text-white rounded-tr-none';
  } else if (isAdminSender) {
    bubbleClasses = 'bg-slate-900 text-slate-50 border border-slate-950 rounded-tl-none ring-1 ring-slate-950/10 shadow-md';
  }

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} max-w-full group animate-in fade-in duration-200`}>
      {/* Left-side Avatar Panel */}
      {!isMe && (
        <div className={`w-8 h-8 rounded-full flex-shrink-0 mr-3 flex items-center justify-center overflow-hidden border-2 shadow-sm mt-auto ${
          isAdminSender ? 'bg-slate-900 border-slate-800 text-amber-400' : 'bg-gray-200 border-white text-gray-400'
        }`}>
          {showAvatar ? (
            isAdminSender ? <ShieldAlert className="w-4 h-4" /> : <User2 className="w-4 h-4" />
          ) : (
            <div className="w-8 h-8" />
          )}
        </div>
      )}

      {/* Bubble Content Section */}
      <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
        <div className={`px-4 py-2.5 rounded-2xl text-sm font-semibold leading-relaxed shadow-sm relative transition-all ${bubbleClasses}`}>
          {/* Support status pill tag overlay for incoming admin statements */}
          {isAdminSender && !isMe && (
            <span className="absolute -top-2 -right-2 bg-amber-500 text-slate-950 text-[8px] font-black uppercase px-1 rounded shadow-sm border border-amber-400 tracking-wider">
              Official Support
            </span>
          )}
          {msg.content}
        </div>

        {/* Metadata breadcrumb history path label summary row */}
        <span className="text-[10px] text-gray-400 font-extrabold mt-1.5 px-1 opacity-80 group-hover:opacity-100 transition-opacity uppercase tracking-wider flex flex-wrap items-center gap-1">
          <span className={`${isAdminSender ? 'text-slate-900 font-black underline decoration-amber-400 decoration-2' : 'text-[#1a5c2a] font-black'}`}>
            {senderName}
          </span>
          <span className={`text-[9px] font-medium opacity-60 ${isAdminSender ? 'text-amber-600 font-bold' : ''}`}>
            ({msg.senderRole})
          </span>
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

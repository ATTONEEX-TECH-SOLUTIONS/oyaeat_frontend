'use client';

import React from 'react';
import { Clock } from 'lucide-react';

interface PendingAdvertsListProps {
  pendingAdverts: any[];
  selectedAdvert: any | null;
  onSelectAdvert: (advert: any) => void;
}

export function PendingAdvertsList({ 
  pendingAdverts, 
  selectedAdvert, 
  onSelectAdvert 
}: PendingAdvertsListProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm xl:col-span-1 space-y-4">
      <div className="flex items-center gap-2 border-b pb-3 border-slate-100">
        <Clock className="text-amber-500 w-5 h-5" />
        <h2 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">
          Pending Vendor Submissions ({pendingAdverts.length})
        </h2>
      </div>
      
      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
        {pendingAdverts.map((adv) => (
          <button
            key={adv.id}
            type="button"
            onClick={() => onSelectAdvert(adv)}
            className={`w-full p-3 rounded-xl border text-left transition-all block ${
              selectedAdvert?.id === adv.id 
                ? 'border-orange-500 bg-orange-50/40 shadow-sm' 
                : 'border-slate-100 hover:bg-slate-50'
            }`}
          >
            {/* 💡 FIXED: Changed adv.subject to adv.title to match Prisma */}
            <p className="text-xs font-bold text-slate-800">{adv.title || '(No Title)'}</p>
            
            {/* 💡 FIXED: Changed adv.content to adv.desc to match Prisma */}
            <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{adv.desc || '(No Description)'}</p>
          </button>
        ))}
        {pendingAdverts.length === 0 && (
          <div className="text-center py-12 text-slate-400 border border-dashed rounded-2xl text-xs">
            No marketing pitches awaiting authorization reviews.
          </div>
        )}
      </div>
    </div>
  );
}

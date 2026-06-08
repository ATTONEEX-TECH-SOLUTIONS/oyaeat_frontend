'use client';

import React from 'react';
import { Eye, EyeOff, AlertTriangle, Trash2 } from 'lucide-react';

interface AdminActiveBroadcastsTableProps {
  broadcasts: any[];
  onToggleStatus: (id: number, currentStatus: boolean) => void;
  onDeleteClick: (id: number) => void; // 🚀 NEW PURGE PROP CONTRACT
}

export function AdminActiveBroadcastsTable({ 
  broadcasts, 
  onToggleStatus,
  onDeleteClick // Destructured
}: AdminActiveBroadcastsTableProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm w-full space-y-4">
      <div className="flex items-center gap-2 border-b pb-3 border-slate-100">
        <h2 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Live & Active Broadcast Monitor</h2>
      </div>

      {broadcasts.length === 0 ? (
        <div className="text-center py-16 text-slate-400 border border-dashed rounded-2xl text-xs">
          No system promotions are currently broadcasting.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="p-3">Restaurant</th>
                <th className="p-3">Headline</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Admin Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y text-slate-700 font-medium">
              {broadcasts.map((promo, idx) => {
                const isRejected = !promo.isActive && promo.expiresAt && new Date(promo.expiresAt).getFullYear() < 2020;
                const isPending = !promo.isActive && !isRejected;

                return (
                  <tr key={promo.id || idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 font-bold text-slate-900">{promo.business?.name || `ID: ${promo.businessId}`}</td>
                    <td className="p-3">{promo.title}</td>
                    <td className="p-3 text-xs">
                      {isRejected && <span className="text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">Rejected</span>}
                      {isPending && <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 animate-pulse">Pending</span>}
                      {promo.isActive && <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Live</span>}
                    </td>
                    <td className="p-3 text-center flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onToggleStatus(promo.id, promo.isActive)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs inline-flex items-center gap-1 transition-all ${
                          promo.isActive 
                            ? 'bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100' 
                            : 'bg-emerald-50 border border-emerald-100 text-emerald-600 hover:bg-emerald-100'
                        }`}
                      >
                        {promo.isActive ? <><EyeOff className="w-3.5 h-3.5" /> Hide</> : <><Eye className="w-3.5 h-3.5" /> Unhide</>}
                      </button>

                      {/* 🚀 RED DELETION TRASH ICON TRIGGER */}
                      <button
                        type="button"
                        onClick={() => onDeleteClick(promo.id)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 border border-slate-100 hover:border-rose-100 hover:bg-rose-50/50 transition-all"
                        title="Delete Permanently"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

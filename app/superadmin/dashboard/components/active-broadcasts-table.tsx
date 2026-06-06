'use client';

import React from 'react';
import { Clock, Eye, EyeOff } from 'lucide-react';

interface ActiveBroadcastsTableProps {
  broadcasts: any[];
  onToggleStatus: (id: number, currentStatus: boolean) => void;
}

export function ActiveBroadcastsTable({ broadcasts, onToggleStatus }: ActiveBroadcastsTableProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm xl:col-span-2 space-y-4">
      <div className="flex items-center gap-2 border-b pb-3 border-slate-100">
        <h2 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Active Broadcast Streams</h2>
      </div>

      {broadcasts.length === 0 ? (
        <div className="text-center py-16 text-slate-400 border border-dashed rounded-2xl text-xs">
          No active promotions are currently loaded in the system dashboard.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="p-3">Restaurant Name</th>
                <th className="p-3">Campaign Headline</th>
                <th className="p-3">Uploaded Image Backdrop</th>
                <th className="p-3">Expiration Date</th>
                <th className="p-3 text-center">Status Action</th>
              </tr>
            </thead>
            <tbody className="divide-y text-slate-700 font-medium">
              {broadcasts.map((promo, idx) => {
                const isUploadedImage = promo.bgGradient?.startsWith("http://") || promo.bgGradient?.startsWith("https://");
                return (
                  <tr key={promo.id || idx} className={`hover:bg-slate-50/50 transition-colors ${!promo.isActive ? 'opacity-50 bg-slate-50/40' : ''}`}>
                    <td className="p-3 font-bold text-slate-900">{promo.business?.name || `ID: ${promo.businessId}`}</td>
                    <td className="p-3">{promo.title}</td>
                    <td className="p-3">
                      <div 
                        className={`h-12 w-32 rounded-xl bg-cover bg-center border text-white font-extrabold text-[10px] shadow-sm relative overflow-hidden flex flex-col justify-center p-1 text-center ${!isUploadedImage ? `bg-gradient-to-r ${promo.bgGradient}` : ''}`} 
                        style={isUploadedImage ? { backgroundImage: `url(${promo.bgGradient})` } : {}}
                      >
                        <div className="absolute inset-0 bg-black/40 z-0" />
                        <p className="relative z-10 tracking-tight leading-tight truncate px-1 font-black uppercase text-white">{promo.title}</p>
                        <p className="relative z-10 text-[8px] opacity-75 truncate px-1 font-normal text-white">{promo.desc || ""}</p>
                      </div>
                    </td>
                    <td className="p-3 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> 
                        {promo.expiresAt ? new Date(promo.expiresAt).toLocaleString([], {hour: '2-digit', minute:'2-digit', month:'short', day:'numeric'}) : 'N/A'}
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => onToggleStatus(promo.id, promo.isActive)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs inline-flex items-center gap-1 transition-all ${
                          promo.isActive 
                            ? 'bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100' 
                            : 'bg-emerald-50 border border-emerald-100 text-emerald-600 hover:bg-emerald-100'
                        }`}
                      >
                        {promo.isActive ? (
                          <><EyeOff className="w-3.5 h-3.5" /> Deactivate</>
                        ) : (
                          <><Eye className="w-3.5 h-3.5" /> Activate</>
                        )}
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

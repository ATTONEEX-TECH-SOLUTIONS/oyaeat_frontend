'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ActiveBroadcastsTableProps {
  broadcasts: any[];
}

export function ActiveBroadcastsTable({ broadcasts }: ActiveBroadcastsTableProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm xl:col-span-2 space-y-4">
      <div className="flex items-center gap-2 border-b pb-3 border-slate-100">
        <h2 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Campaign Tracking Monitor</h2>
      </div>

      {broadcasts.length === 0 ? (
        <div className="text-center py-16 text-slate-400 border border-dashed rounded-2xl text-xs">
          No promotions are currently loaded in your dashboard history.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="p-3">Campaign Headline</th>
                <th className="p-3">Uploaded Image</th>
                <th className="p-3">Status State Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y text-slate-700 font-medium">
              {broadcasts.map((promo, idx) => {
                const isUploadedImage = promo.bgGradient?.startsWith("http");
                const isRejected = !promo.isActive && promo.expiresAt && new Date(promo.expiresAt).getFullYear() < 2020;
                const isPending = !promo.isActive && !isRejected;

                return (
                  <tr key={promo.id || idx} className={`hover:bg-slate-50/50 transition-colors ${isRejected ? 'bg-rose-50/20' : ''}`}>
                    <td className="p-3 font-bold text-slate-900">{promo.title}</td>
                    <td className="p-3">
                      {isUploadedImage ? (
                        <div className="h-10 w-24 rounded-lg bg-cover bg-center border" style={{ backgroundImage: `url(${promo.bgGradient})` }} />
                      ) : (
                        <span className="text-xs text-slate-400">No image uploaded</span>
                      )}
                    </td>
                    <td className="p-3 text-xs">
                      {isRejected && (
                        <span className="bg-rose-50 border border-rose-200 text-rose-600 px-2.5 py-1 rounded-full font-bold inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Rejected by Admin
                        </span>
                      )}
                      {isPending && (
                        <span className="bg-amber-50 border border-amber-200 text-amber-600 px-2.5 py-1 rounded-full font-bold animate-pulse">
                          Awaiting Approval Review
                        </span>
                      )}
                      {promo.isActive && (
                        <span className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-2.5 py-1 rounded-full font-bold">
                          Live & Active Stream
                        </span>
                      )}
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

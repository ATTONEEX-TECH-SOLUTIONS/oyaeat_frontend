'use client';

import React from 'react';
import { ShieldAlert, CheckCircle2, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Alert {
  id: number;
  title: string;
  desc: string;
  type: string;
  createdAt: string;
}

interface RiderAlertsViewProps {
  alerts: Alert[];
}

export function RiderAlertsView({ alerts }: RiderAlertsViewProps) {
  return (
    <div className="flex-1 p-6 space-y-4 overflow-y-auto text-left w-full h-full bg-slate-50/10">
      {alerts.map((alert) => (
        <div 
          key={alert.id} 
          className={`p-4 rounded-xl border flex items-start gap-3 bg-white transition-all ${
            alert.type === "warning" ? "border-red-200 bg-red-50/10" : "border-green-200 bg-green-50/10"
          }`}
        >
          {alert.type === "warning" ? (
            <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <h4 className="text-xs font-black text-gray-900">{alert.title}</h4>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">{alert.desc}</p>
            <p className="text-[10px] text-gray-400 flex items-center gap-1 font-bold">
              <Clock className="w-3 h-3" /> 
              {alert.createdAt ? formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true }) : 'Just now'}
            </p>
          </div>
        </div>
      ))}
      
      {alerts.length === 0 && (
        <div className="text-center py-20 text-xs font-bold text-gray-400 bg-white border border-dashed rounded-3xl w-full">
          No operations logs or system alerts are currently registered to your profile.
        </div>
      )}
    </div>
  );
}

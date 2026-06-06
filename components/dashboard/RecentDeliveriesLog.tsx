'use client'

import { CheckCircle2, ChevronRight } from "lucide-react";

export function RecentDeliveriesLog({ recentDeliveries = [] }: { recentDeliveries?: any[] }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-900 text-lg">Recent Deliveries</h3>
        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">Today</span>
      </div>

      {recentDeliveries && recentDeliveries.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {recentDeliveries.map((delivery: any, idx: number) => (
            <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-green-50 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm group-hover:text-green-700 transition-colors">{delivery.restaurant}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">{delivery.time}</p>
                </div>
              </div>
              <div className="text-right flex items-center gap-2">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{delivery.payout}</p>
                  <p className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded uppercase mt-0.5 inline-block">Paid</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400 text-sm">No delivery activities completed yet today.</div>
      )}
    </div>
  );
}

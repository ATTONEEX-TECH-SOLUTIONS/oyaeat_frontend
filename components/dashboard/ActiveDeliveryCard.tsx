'use client'

import { CheckCircle2, Navigation } from "lucide-react";

interface ActiveDeliveryProps {
  activeDelivery: any;
  isOnline: boolean;
  isActionLoading: boolean;
  onAccept: (id: string) => void;
  onComplete: (id: string) => void;
}

export function ActiveDeliveryCard({ activeDelivery, isOnline, isActionLoading, onAccept, onComplete }: ActiveDeliveryProps) {
  if (!activeDelivery) {
    return isOnline ? (
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
        <p className="text-gray-500 text-sm">Waiting for delivery requests near you...</p>
      </div>
    ) : null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-green-200 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
              {activeDelivery.status === "out_for_delivery" ? "Active Trip" : "New Request"}
            </span>
            <h2 className="text-xl font-bold text-gray-900">{activeDelivery.payout} <span className="text-sm font-normal text-gray-500">Est. Payout</span></h2>
          </div>
          <div className="text-right">
            <p className="font-bold text-gray-900">{activeDelivery.distance || "3.2 km"}</p>
            <p className="text-sm text-gray-500">Total Distance</p>
          </div>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:inset-y-2 before:left-[11px] before:w-0.5 before:bg-gray-200">
          <div className="relative">
            <div className="absolute -left-[29px] top-1 w-4 h-4 bg-white border-4 border-gray-900 rounded-full z-10" />
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Pickup</p>
              <p className="font-bold text-gray-900">{activeDelivery.restaurant}</p>
              <p className="text-sm text-gray-500">Status: <span className="capitalize font-medium text-green-700">{activeDelivery.status?.replace(/_/g, ' ')}</span></p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -left-[29px] top-1 w-4 h-4 bg-white border-4 border-green-500 rounded-full z-10" />
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Dropoff</p>
              <p className="font-bold text-gray-900">{activeDelivery.customer}</p>
              <p className="text-sm text-gray-500">{activeDelivery.dropoff}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 border-t border-gray-100 flex gap-4">
        {activeDelivery.status === "out_for_delivery" ? (
          <button 
            onClick={() => onComplete(activeDelivery.id)}
            disabled={isActionLoading}
            className="flex-1 bg-emerald-700 text-white font-black py-3 rounded-xl hover:bg-emerald-800 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
          >
            <CheckCircle2 className="w-5 h-5" /> Confirm Dropoff & Collect Earnings
          </button>
        ) : (
          <>
            <button className="flex-1 bg-white border border-gray-300 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm">
              Decline
            </button>
            <button 
              onClick={() => onAccept(activeDelivery.id)}
              disabled={isActionLoading}
              className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
            >
              <Navigation className="w-5 h-5" /> Accept Order
            </button>
          </>
        )}
      </div>
    </div>
  );
}

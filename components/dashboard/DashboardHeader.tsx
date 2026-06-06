'use client'

import { MapPin, AlertCircle } from "lucide-react";

interface HeaderProps {
  firstName?: string;
  currentLocation: string;
  isOnline: boolean;
  isActionLoading: boolean;
  onToggleShift: () => void;
}

export function DashboardHeader({ firstName, currentLocation, isOnline, isActionLoading, onToggleShift }: HeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {firstName || "Rider"}</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-gray-400" />
            Current Location: <span className="font-medium text-gray-700">{currentLocation}</span>
          </p>
        </div>

        <div className="flex items-center gap-4 bg-gray-50 p-2 pr-4 rounded-full border border-gray-200">
          <button
            onClick={onToggleShift}
            disabled={isActionLoading}
            className={`relative w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ease-in-out outline-none border-none ${
              isOnline ? 'bg-green-500' : 'bg-gray-300'
            } ${isActionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${isOnline ? 'translate-x-8' : 'translate-x-0'}`} />
          </button>
          <span className={`font-bold text-sm uppercase tracking-wider ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
            {isActionLoading ? 'Updating...' : isOnline ? 'Go Offline' : 'Go Online'}
          </span>
        </div>
      </div>

      {isOnline ? (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-3 rounded-xl flex items-center gap-2 text-xs animate-pulse">
          <span>📡</span>
          <span>Live Tracking Active: Your real-time position is streaming to dispatch.</span>
        </div>
      ) : (
        <div className="bg-orange-50 border border-orange-200 text-orange-800 px-6 py-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-orange-500" />
          <div>
            <h3 className="font-semibold">You are currently offline</h3>
            <p className="text-sm mt-1 text-orange-700/80">Toggle status parameters to receive incoming orders.</p>
          </div>
        </div>
      )}
    </div>
  );
}

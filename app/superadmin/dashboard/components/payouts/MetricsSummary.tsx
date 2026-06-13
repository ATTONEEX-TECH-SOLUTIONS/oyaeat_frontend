'use client'

import { DollarSign, ShieldCheck, Truck, Percent } from "lucide-react";

interface AdminMetrics {
  totalPlatformVolume: number;
  totalAdminCommission: number;
  riderOwedPool: number;
  restaurantOwedPool: number;
}

export default function MetricsSummary({ metrics }: { metrics: AdminMetrics }) {
  const formatCurrency = (value: number) => `₦${Math.round(value).toLocaleString('en-NG')}`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Platform Volume */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Gross Sales</p>
          <h3 className="text-xl font-black text-gray-900 mt-1">{formatCurrency(metrics.totalPlatformVolume)}</h3>
        </div>
        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500">
          <DollarSign className="w-5 h-5" />
        </div>
      </div>

      {/* Admin Commission */}
      <div className="bg-emerald-950 p-5 rounded-xl text-white flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Admin Commission</p>
          <h3 className="text-xl font-black text-emerald-50 mt-1">{formatCurrency(metrics.totalAdminCommission)}</h3>
        </div>
        <div className="w-10 h-10 bg-emerald-900 rounded-lg flex items-center justify-center text-emerald-400">
          <Percent className="w-5 h-5" />
        </div>
      </div>

      {/* Restaurant Pool */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Owed to Restaurants</p>
          <h3 className="text-xl font-black text-gray-900 mt-1">{formatCurrency(metrics.restaurantOwedPool)}</h3>
        </div>
        <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600">
          <ShieldCheck className="w-5 h-5" />
        </div>
      </div>

      {/* Rider Pool */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Owed to Riders</p>
          <h3 className="text-xl font-black text-gray-900 mt-1">{formatCurrency(metrics.riderOwedPool)}</h3>
        </div>
        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
          <Truck className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

'use client'

import { Wallet, ArrowUpRight, TrendingUp, Calendar } from "lucide-react";

interface Metrics {
  balance: number;
  todayEarnings: string | number;
  weeklyEarnings: string | number;
}

export default function FinancialGrid({ metrics }: { metrics: Metrics | null }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Main Wallet Balance Box */}
      <div className="bg-gradient-to-br from-emerald-900 to-green-800 p-6 rounded-2xl shadow-sm text-white flex flex-col justify-between h-40">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider opacity-75">Withdrawable Balance</p>
          <Wallet className="w-5 h-5 opacity-75" />
        </div>
        <h2 className="text-3xl font-black">₦{metrics?.balance?.toLocaleString() || 0}</h2>
        <p className="text-[10px] opacity-60">Verified internal wallet balance</p>
      </div>

      {/* Today's Split Earnings */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 h-40">
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
          <ArrowUpRight className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">Today's Earnings</p>
          <h3 className="text-2xl font-bold text-gray-900">{metrics?.todayEarnings || "₦0"}</h3>
          <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Split payout active
          </p>
        </div>
      </div>

      {/* Weekly Accumulation */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 h-40">
        <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <Calendar className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">This Week's Earnings</p>
          <h3 className="text-2xl font-bold text-gray-900">{metrics?.weeklyEarnings || "₦0"}</h3>
          <p className="text-xs text-gray-400 mt-1">Resets tracking cycle every Sunday</p>
        </div>
      </div>
    </div>
  );
}

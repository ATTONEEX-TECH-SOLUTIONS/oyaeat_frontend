'use client';

import React from 'react';
import { Wallet } from 'lucide-react';

interface PayoutPoliciesProps {
  restaurantPayoutThreshold: number;
  setRestaurantPayoutThreshold: (val: number) => void;
  riderPayoutThreshold: number;
  setRiderPayoutThreshold: (val: number) => void;
  payoutSchedule: string;
  setPayoutSchedule: (val: string) => void;
}

export function PayoutPolicies({
  restaurantPayoutThreshold,
  setRestaurantPayoutThreshold,
  riderPayoutThreshold,
  setRiderPayoutThreshold,
  payoutSchedule,
  setPayoutSchedule,
}: PayoutPoliciesProps) {
  return (
    <div className="bg-card rounded-2xl border border-gray-100 p-8 shadow-sm bg-white w-full">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
        <Wallet className="w-6 h-6 text-[#1a5c2a]" />
        <h2 className="text-xl font-bold text-gray-900">Payout Policies</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-[#1a5c2a] mb-2">
            Restaurant Min Payout (₦)
          </label>
          <input 
            type="number" 
            value={restaurantPayoutThreshold} 
            onChange={e => setRestaurantPayoutThreshold(Number(e.target.value))} 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 font-semibold outline-none focus:border-[#1a5c2a] focus:bg-white transition-all text-sm" 
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-[#1a5c2a] mb-2">
            Rider Min Payout (₦)
          </label>
          <input 
            type="number" 
            value={riderPayoutThreshold} 
            onChange={e => setRiderPayoutThreshold(Number(e.target.value))} 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 font-semibold outline-none focus:border-[#1a5c2a] focus:bg-white transition-all text-sm" 
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-widest text-[#1a5c2a] mb-2">
          Automatic Payout Schedule
        </label>
        <select 
          value={payoutSchedule} 
          onChange={e => setPayoutSchedule(e.target.value)} 
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 font-bold outline-none focus:border-[#1a5c2a] focus:bg-white transition-all text-sm cursor-pointer"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="biweekly">Bi-Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
    </div>
  );
}

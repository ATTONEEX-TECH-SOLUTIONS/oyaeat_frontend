'use client';

import React from 'react';
import { DollarSign } from 'lucide-react';

interface CommissionFeesProps {
  platformCommission: number;
  setPlatformCommission: (val: number) => void;
  baseRiderFee: number;
  setBaseRiderFee: (val: number) => void;
}

export function CommissionFees({
  platformCommission,
  setPlatformCommission,
  baseRiderFee,
  setBaseRiderFee,
}: CommissionFeesProps) {
  return (
    <div className="bg-card rounded-2xl border border-gray-100 p-8 shadow-sm bg-white">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
        <DollarSign className="w-6 h-6 text-[#1a5c2a]" />
        <h2 className="text-xl font-bold text-gray-900">Commission & Fees</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-[#1a5c2a] mb-2">
            Global Platform Commission (%)
          </label>
          <input 
            type="number" 
            value={platformCommission} 
            onChange={e => setPlatformCommission(Number(e.target.value))} 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 font-semibold outline-none focus:border-[#1a5c2a] focus:bg-white transition-all text-sm" 
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-[#1a5c2a] mb-2">
            Base Rider Delivery Fee (₦)
          </label>
          <input 
            type="number" 
            value={baseRiderFee} 
            onChange={e => setBaseRiderFee(Number(e.target.value))} 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 font-semibold outline-none focus:border-[#1a5c2a] focus:bg-white transition-all text-sm" 
          />
        </div>
      </div>
    </div>
  );
}

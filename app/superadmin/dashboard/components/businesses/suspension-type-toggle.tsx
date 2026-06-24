'use client'

import React from 'react'

interface SuspensionTypeToggleProps {
  activeType: 'shadow' | 'main'
  onChange: (type: 'shadow' | 'main') => void
}

export function SuspensionTypeToggle({ activeType, onChange }: SuspensionTypeToggleProps) {
  return (
    <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
        Suspension Strategy Layer
      </label>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onChange('shadow')}
          className={`px-3 py-2.5 rounded-lg text-xs font-bold transition-all border ${
            activeType === 'shadow' 
              ? 'bg-amber-500 border-amber-600 text-white shadow-sm' 
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          ⚠️ Shadow Suspend (Hide Store Only)
        </button>
        <button
          type="button"
          onClick={() => onChange('main')}
          className={`px-3 py-2.5 rounded-lg text-xs font-bold transition-all border ${
            activeType === 'main' 
              ? 'bg-rose-600 border-rose-700 text-white shadow-sm' 
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          🚨 Main Suspend (Hard Block Dashboard)
        </button>
      </div>
      <p className="text-[11px] text-gray-400 leading-normal pt-1">
        {activeType === 'shadow' 
          ? 'Shadow suspension hides the storefront from consumer apps. Vendor retains full dashboard data viewing access.' 
          : 'Main suspension fully locks the vendor out behind an insurmountable compliance appeal portal layout wrapper.'}
      </p>
    </div>
  )
}

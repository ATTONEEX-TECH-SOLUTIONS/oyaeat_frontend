'use client'

import { C, STATUS_TABS } from '@/config/config'

interface StatusTabStripProps {
  activeStatus: string
  setActiveStatus: (status: string) => void
  counts: Record<string, number>
}

export function StatusTabStrip({ activeStatus, setActiveStatus, counts }: StatusTabStripProps) {
  return (
    <div
      className="flex gap-1 mb-5 rounded-2xl p-1.5 border w-fit shadow-sm"
      style={{ backgroundColor: C.white, borderColor: C.border }}
    >
      {STATUS_TABS.map(t => (
        <button
          key={t.key}
          onClick={() => setActiveStatus(t.key)}
          className="px-4 py-1.5 rounded-xl text-sm font-bold transition-all duration-150 whitespace-nowrap"
          style={{
            backgroundColor: activeStatus === t.key ? C.green : 'transparent',
            color:           activeStatus === t.key ? C.white : C.textMuted,
          }}
        >
          {t.label}
          <span
            className="ml-1.5 text-xs font-black"
            style={{ color: activeStatus === t.key ? C.greenLight : C.textMuted }}
          >
            {counts[t.key as keyof typeof counts] ?? 0}
          </span>
        </button>
      ))}
    </div>
  )
}

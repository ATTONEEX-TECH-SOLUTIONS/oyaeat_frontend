'use client'

import { C } from '@/config/config'

interface StatChipProps {
  label: string
  value: number
  icon: React.ElementType
  accent: string
  active: boolean
  onClick: () => void
}

export function StatChip({ label, value, icon: Icon, accent, active, onClick }: StatChipProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col gap-2 rounded-2xl border p-4 text-left w-full transition-all duration-200"
      style={{
        borderColor:     active ? C.green : C.border,
        backgroundColor: active ? C.green : C.white,
        boxShadow:       active ? `0 4px 16px ${C.green}30` : undefined,
      }}
    >
      <div
        className="flex h-9 w-9 items-center justify-center rounded-xl"
        style={{ backgroundColor: active ? 'rgba(255,255,255,0.15)' : `${accent}18` }}
      >
        <Icon className="h-4 w-4" style={{ color: active ? '#fff' : accent }} />
      </div>
      <div>
        <p className="text-xl font-black tracking-tight" style={{ color: active ? '#fff' : C.textDark }}>
          {value}
        </p>
        <p className="text-xs font-semibold uppercase tracking-widest mt-0.5" style={{ color: active ? C.greenLight : C.textMuted }}>
          {label}
        </p>
      </div>
    </button>
  )
}

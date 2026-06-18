'use client'

import { C } from '@/config/config'

export function PageHeader() {
  return (
    <div className="mb-6">
      <p className="text-xs font-bold uppercase tracking-[0.2em] mb-1" style={{ color: C.greenLight }}>
        Super Admin
      </p>
      <h1 className="text-2xl font-black tracking-tight" style={{ color: C.textDark }}>
        Businesses
      </h1>
      <p className="mt-1 text-sm" style={{ color: C.textMuted }}>
        View and manage all platform businesses — pending, approved, rejected, suspended.
      </p>
    </div>
  )
}

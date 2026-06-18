'use client'

import { Store } from 'lucide-react'
import { BusinessCard, type Business } from './business-card'
import { C } from '@/config/config'

interface BusinessesListProps {
  filtered: Business[]
  onApprove: (id: number) => void
  onUnsuspend: (id: number) => void 
  onRejectRequest: (id: number, name: string) => void
  onSuspendRequest: (id: number, name: string) => void
}

// ── Added "onUnsuspend" to the function argument block destructors list below ──
export function BusinessesList({ 
  filtered, 
  onApprove, 
  onUnsuspend, 
  onRejectRequest, 
  onSuspendRequest 
}: BusinessesListProps) {
  
  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border py-16 text-center" style={{ borderColor: C.border, backgroundColor: C.white }}>
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: C.border }}>
          <Store className="h-6 w-6" style={{ color: C.textMuted }} />
        </div>
        <p className="text-base font-bold" style={{ color: C.textDark }}>No businesses found</p>
        <p className="mt-1 text-sm" style={{ color: C.textMuted }}>Try adjusting your filters or search term.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {filtered.map(b => (
        <BusinessCard
          key={b.id}
          b={b}
          onApprove={() => onApprove(b.id)}
          onUnsuspend={() => onUnsuspend(b.id)} // 👈 Now runs perfectly without referencing a missing name variable!
          onRejectTrigger={() => onRejectRequest(b.id, b.name)}
          onSuspendTrigger={() => onSuspendRequest(b.id, b.name)}
        />
      ))}
    </div>
  )
}

'use client'

import React from 'react'
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
    <div className="space-y-3.5">
      {filtered.map((business) => (
        <BusinessCard
          key={business.id}
          b={business}
          onApprove={() => onApprove(business.id)}
          onUnsuspend={() => onUnsuspend(business.id)}
          onRejectTrigger={() => onRejectRequest(business.id, business.name)}
          onSuspendTrigger={() => onSuspendRequest(business.id, business.name)}
        />
      ))}
    </div>
  )
}

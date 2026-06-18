'use client'

import { ChevronDown, ChevronUp, Mail, Phone, FileText, FileCheck, Receipt, AlertCircle, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DocPill } from './doc-pill'
import { StatusBadge } from './status-badge'
import type { Restaurant } from '@/lib/types'

interface RestaurantCardProps {
  restaurant: Restaurant
  isExpanded: boolean
  onToggleExpand: () => void
  onApprove?: (id: string) => void
  onRejectTrigger: (id: string, name: string) => void // 👈 Higher-order handler
}

export function RestaurantCard({
  restaurant,
  isExpanded,
  onToggleExpand,
  onApprove,
  onRejectTrigger
}: RestaurantCardProps) {
  const allDocsComplete =
    restaurant.documents.businessLicense &&
    restaurant.documents.foodLicense &&
    restaurant.documents.taxId

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm transition-shadow hover:shadow-md">
      {/* ── Row ──────────────────────────────────────── */}
      <div className="flex items-center gap-4 px-5 py-4 cursor-pointer" onClick={onToggleExpand}>
        {/* Initials square */}
        <div
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-black text-white"
          style={{ backgroundColor: '#2D6A4F' }}
        >
          {restaurant.name.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase()}
        </div>

        {/* Name + meta */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground truncate">{restaurant.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {restaurant.cuisineType} &bull; {restaurant.address}
          </p>
          <div className="mt-1.5 flex items-center gap-4">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Mail className="h-3 w-3" />
              {restaurant.email || '—'}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Phone className="h-3 w-3" />
              {restaurant.phone || '—'}
            </span>
          </div>
        </div>

        {/* Status + date + chevron */}
        <div className="flex flex-shrink-0 items-center gap-3">
          <div className="text-right">
            <StatusBadge status={restaurant.status} />
            <p className="text-xs text-muted-foreground mt-0.5">
              {new Date(restaurant.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit', month: '2-digit', year: 'numeric',
              })}
            </p>
          </div>
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: '#F5F1EB' }}>
            {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </div>
        </div>
      </div>

      {/* ── Expanded panel ───────────────────────────── */}
      {isExpanded && (
        <div className="border-t border-border bg-[#F5F1EB] px-5 py-5 space-y-4">
          {/* Documents */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Documents</p>
            <div className="grid grid-cols-3 gap-3">
              <DocPill label="Business License" present={restaurant.documents.businessLicense} icon={FileText} />
              <DocPill label="Food License" present={restaurant.documents.foodLicense} icon={FileCheck} />
              <DocPill label="Tax ID" present={restaurant.documents.taxId} icon={Receipt} />
            </div>
          </div>

          {/* Missing docs warning */}
          {restaurant.status === 'suspended' && !allDocsComplete && (
            <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-amber-600" />
              <p className="text-sm text-amber-800">Missing required documents. Cannot approve until all documents are submitted.</p>
            </div>
          )}

          {/* Rejection reason */}
          {restaurant.status === 'rejected' && restaurant.rejectionReason && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-1">Rejection Reason</p>
              <p className="text-sm text-red-800">{restaurant.rejectionReason}</p>
            </div>
          )}

          {/* Actions panel */}
          {restaurant.status === 'suspended' && (
            <div className="flex gap-3 pt-1">
              {allDocsComplete && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card from collapsing
                    onApprove?.(restaurant.id);
                  }}
                  className="flex-1 rounded-xl font-bold text-white shadow-sm gap-2"
                  style={{ backgroundColor: '#1B4332' }}
                >
                  <Check className="h-4 w-4" />
                  Approve Restaurant
                </Button>
              )}
              <Button
                onClick={(e) => {
                  e.stopPropagation(); // 👈 1. Stops the card container accordion toggle behavior
                  onRejectTrigger(restaurant.id, restaurant.name); // 👈 2. Directly passes exact string parameters
                }}
                variant="outline"
                className="flex-1 rounded-xl font-bold border-border bg-card text-[#C0392B] hover:bg-red-50 hover:border-red-200 gap-2"
              >
                <X className="h-4 w-4" />
                Reject
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

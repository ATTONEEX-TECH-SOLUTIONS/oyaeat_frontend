'use client'

import { useState } from 'react'
import type { Restaurant } from '@/lib/types'
import { Check, X, PauseCircle, AlertCircle, ChevronDown, ChevronUp, Mail, Phone, FileText, FileCheck, Receipt } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RestaurantsListProps {
  restaurants: Restaurant[]
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}

// ── Status config ─────────────────────────────────────────────────────────────
const statusConfig = {
  suspended: { icon: PauseCircle, color: '#D4860B', bg: '#FEF3CD', label: 'Suspended' },
  approved:  { icon: Check,       color: '#2D6A4F', bg: '#D8F0E4', label: 'Approved'  },
  rejected:  { icon: X,           color: '#C0392B', bg: '#FDECEA', label: 'Rejected'  },
}

// ── Document pill ─────────────────────────────────────────────────────────────
function DocPill({ label, present, icon: Icon }: { label: string; present: boolean; icon: React.ElementType }) {
  return (
    <div className={`
      flex items-center gap-2 rounded-xl border px-3 py-2.5
      ${present ? 'border-[#D8F0E4] bg-[#F0FBF5]' : 'border-[#FDECEA] bg-[#FEF8F8]'}
    `}>
      <Icon className="h-4 w-4 flex-shrink-0" style={{ color: present ? '#2D6A4F' : '#C0392B' }} />
      <span className="text-xs font-semibold text-foreground">{label}</span>
      <span className="ml-auto">
        {present
          ? <Check className="h-3.5 w-3.5" style={{ color: '#2D6A4F' }} />
          : <X     className="h-3.5 w-3.5" style={{ color: '#C0392B' }} />
        }
      </span>
    </div>
  )
}

export function RestaurantsList({ restaurants, onApprove, onReject }: RestaurantsListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (restaurants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-16 px-6 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#D8E4DC]">
          <FileText className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-base font-bold text-foreground">No restaurants found</p>
        <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters or search term.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {restaurants.map((restaurant) => {
        const cfg = statusConfig[restaurant.status as keyof typeof statusConfig] ?? statusConfig.suspended
        const StatusIcon = cfg.icon
        const isExpanded = expandedId === restaurant.id
        const allDocsComplete =
          restaurant.documents.businessLicense &&
          restaurant.documents.foodLicense &&
          restaurant.documents.taxId

        return (
          <div
            key={restaurant.id}
            className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm transition-shadow hover:shadow-md"
          >
            {/* ── Row ──────────────────────────────────────── */}
            <div
              className="flex items-center gap-4 px-5 py-4 cursor-pointer"
              onClick={() => setExpandedId(isExpanded ? null : restaurant.id)}
            >
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
                  <div className="flex items-center justify-end gap-1.5">
                    <div
                      className="flex h-6 w-6 items-center justify-center rounded-full"
                      style={{ backgroundColor: cfg.bg }}
                    >
                      <StatusIcon className="h-3.5 w-3.5" style={{ color: cfg.color }} />
                    </div>
                    <span className="text-sm font-bold" style={{ color: cfg.color }}>
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(restaurant.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                    })}
                  </p>
                </div>
                <div
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: '#F5F1EB' }}
                >
                  {isExpanded
                    ? <ChevronUp   className="h-4 w-4 text-muted-foreground" />
                    : <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  }
                </div>
              </div>
            </div>

            {/* ── Expanded panel ───────────────────────────── */}
            {isExpanded && (
              <div className="border-t border-border bg-[#F5F1EB] px-5 py-5 space-y-4">

                {/* Documents */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                    Documents
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    <DocPill label="Business License" present={restaurant.documents.businessLicense} icon={FileText}  />
                    <DocPill label="Food License"     present={restaurant.documents.foodLicense}     icon={FileCheck} />
                    <DocPill label="Tax ID"           present={restaurant.documents.taxId}           icon={Receipt}   />
                  </div>
                </div>

                {/* Missing docs warning (for suspended = awaiting review) */}
                {restaurant.status === 'suspended' && !allDocsComplete && (
                  <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-amber-600" />
                    <p className="text-sm text-amber-800">
                      Missing required documents. Cannot approve until all documents are submitted.
                    </p>
                  </div>
                )}

                {/* Rejection reason */}
                {restaurant.status === 'rejected' && restaurant.rejectionReason && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-1">Rejection Reason</p>
                    <p className="text-sm text-red-800">{restaurant.rejectionReason}</p>
                  </div>
                )}

                {/* Actions — only shown for suspended restaurants */}
                {restaurant.status === 'suspended' && (
                  <div className="flex gap-3 pt-1">
                    {allDocsComplete && (
                      <Button
                        onClick={() => onApprove?.(restaurant.id)}
                        className="flex-1 rounded-xl font-bold text-white shadow-sm gap-2"
                        style={{ backgroundColor: '#1B4332' }}
                      >
                        <Check className="h-4 w-4" />
                        Approve Restaurant
                      </Button>
                    )}
                    <Button
                      onClick={() => onReject?.(restaurant.id)}
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
      })}
    </div>
  )
}
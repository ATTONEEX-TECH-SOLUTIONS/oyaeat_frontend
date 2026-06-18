'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Mail, Phone, AlertCircle, Check, X, PauseCircle } from 'lucide-react'
import { DocRow, type DocumentItem } from './doc-row'
import { C, getStatusCfg } from '@/config/config'

export type Submitter = { name: string; email: string; phone?: string }
export type Business = {
  id: number
  name: string
  status: string
  submitter: Submitter
  documents: DocumentItem[]
  rejectionReason?: string | null
  createdAt?: string
}

interface BusinessCardProps {
  b: Business
  onApprove: () => void
  onUnsuspend?: () => void 
  onRejectTrigger: () => void
  onSuspendTrigger: () => void
}

export function BusinessCard({ b, onApprove, onUnsuspend, onRejectTrigger, onSuspendTrigger }: BusinessCardProps) {
  const [open, setOpen] = useState(false)
  const cfg = getStatusCfg(b.status)
  const StatusIcon = cfg.icon

  const canApprove = b.status === 'pending_review'
  const canReject  = b.status === 'pending_review'
  const canSuspend = b.status === 'approved'
  const canUnsuspend = b.status === 'suspended'

  const initials = b.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()

  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md" style={{ borderColor: C.border }}>
      
      {/* ── Row Header ──────────────────────────────── */}
      <div className="flex cursor-pointer items-center gap-4 px-5 py-4" onClick={() => setOpen(o => !o)}>
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-black text-white" style={{ backgroundColor: C.greenMid }}>
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold truncate" style={{ color: C.textDark }}>{b.name}</p>
          <p className="text-xs truncate mt-0.5" style={{ color: C.textMuted }}>
            {b.submitter?.name || b.submitter?.email || 'Unknown'}
          </p>
          {b.createdAt && (
            <p className="text-xs mt-0.5" style={{ color: C.textMuted }}>
              {new Date(b.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
          )}
        </div>

        <div className="flex flex-shrink-0 items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full" style={{ backgroundColor: cfg.bg }}>
              <StatusIcon className="h-3.5 w-3.5" style={{ color: cfg.color }} />
            </div>
            <span className="text-sm font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: C.bg }}>
            {open ? <ChevronUp className="h-4 w-4" style={{ color: C.textMuted }} /> : <ChevronDown className="h-4 w-4" style={{ color: C.textMuted }} />}
          </div>
        </div>
      </div>

      {/* ── Expanded Panel (Fixed: Inside layout shell structure) ── */}
      {open && (
        <div className="border-t px-5 py-5 space-y-4" style={{ borderColor: C.border, backgroundColor: C.bg }}>
          
          {/* Contact Details */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: C.textMuted }}>Contact</p>
            <div className="flex items-center gap-2 text-sm" style={{ color: C.textMuted }}>
              <Mail className="h-4 w-4 flex-shrink-0" style={{ color: C.greenMid }} />
              {b.submitter?.email || 'N/A'}
            </div>
            {b.submitter?.phone && (
              <div className="flex items-center gap-2 text-sm" style={{ color: C.textMuted }}>
                <Phone className="h-4 w-4 flex-shrink-0" style={{ color: C.greenMid }} />
                {b.submitter.phone}
              </div>
            )}
          </div>

          {/* Rejection History Note */}
          {b.rejectionReason && (
            <div className="flex gap-3 rounded-xl border px-4 py-3" style={{ borderColor: '#FECACA', backgroundColor: '#FEF2F2' }}>
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: C.error }} />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: C.error }}>Rejection Reason</p>
                <p className="text-sm" style={{ color: C.error }}>{b.rejectionReason}</p>
              </div>
            </div>
          )}

          {/* Uploaded Documents List */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: C.textMuted }}>Documents</p>
            {b.documents?.length ? (
              <div className="space-y-2">
                {b.documents.map((d, i) => <DocRow key={i} doc={d} />)}
              </div>
            ) : (
              <p className="text-sm" style={{ color: C.textMuted }}>No documents uploaded</p>
            )}
          </div>

          {/* Action Controls Container */}
          {(canApprove || canReject || canSuspend || canUnsuspend) && (
            <div className="flex flex-wrap gap-2 pt-4 border-t" style={{ borderColor: C.border }}>
              {canApprove && (
                <button onClick={onApprove} className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-white hover:opacity-90" style={{ backgroundColor: C.green }}>
                  <Check className="h-4 w-4" /> Approve
                </button>
              )}
              
              {canUnsuspend && (
                <button 
                  onClick={onUnsuspend} 
                  className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90" 
                  style={{ backgroundColor: C.greenMid }}
                >
                  <Check className="h-4 w-4" /> Reactivate Profile
                </button>
              )}

              {canReject && (
                <button onClick={onRejectTrigger} className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold hover:bg-red-50" style={{ borderColor: '#FECACA', color: C.error, backgroundColor: '#FEF2F2' }}>
                  <X className="h-4 w-4" /> Reject
                </button>
              )}
              
              {canSuspend && (
                <button onClick={onSuspendTrigger} className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold" style={{ borderColor: C.border, color: C.textMuted, backgroundColor: C.white }}>
                  <PauseCircle className="h-4 w-4" /> Suspend
                </button>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  )
}

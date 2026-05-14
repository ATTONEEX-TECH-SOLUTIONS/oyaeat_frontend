'use client'

import { useEffect, useMemo, useState } from 'react'
import { Sidebar } from '@/app/superadmin/dashboard/components/sidebar'
import {
  ChevronDown, ChevronUp, FileText, FileCheck, Receipt,
  Mail, Phone, AlertCircle, RefreshCw, Search,
  Check, X, PauseCircle, Clock, Store, XCircle,
} from 'lucide-react'

type DocumentItem = { type: string; url?: string }
type Submitter    = { name: string; email: string; phone?: string }

type Business = {
  id: number
  name: string
  status: 'pending_review' | 'approved' | 'rejected' | 'suspended' | 'draft' | string
  submitter: Submitter
  documents: DocumentItem[]
  rejectionReason?: string | null
  createdAt?: string
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'

// ── Brand tokens ──────────────────────────────────────────────────────────────
const C = {
  green:      '#1B4332',
  greenMid:   '#2D6A4F',
  greenLight: '#52B788',
  amber:      '#D4860B',
  amberLight: '#F4A620',
  bg:         '#F5F1EB',
  white:      '#FFFFFF',
  textDark:   'inherit',
  textMuted:  '#6B7C6E',
  border:     '#D8E4DC',
  error:      '#C0392B',
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pending_review: { label: 'Pending',   color: C.amber,    bg: '#FEF3CD', icon: Clock       },
  approved:       { label: 'Approved',  color: C.greenMid, bg: '#D8F0E4', icon: Check       },
  rejected:       { label: 'Rejected',  color: C.error,    bg: '#FDECEA', icon: X           },
  suspended:      { label: 'Suspended', color: '#6B7C6E',  bg: '#E8EEEB', icon: PauseCircle },
  draft:          { label: 'Draft',     color: '#6B7C6E',  bg: '#E8EEEB', icon: FileText    },
}

function getStatusCfg(status: string) {
  return STATUS_CONFIG[status] ?? STATUS_CONFIG.draft
}

const STATUS_TABS: Array<{ key: string; label: string }> = [
  { key: 'all',           label: 'All'       },
  { key: 'pending_review',label: 'Pending'   },
  { key: 'approved',      label: 'Approved'  },
  { key: 'rejected',      label: 'Rejected'  },
  { key: 'suspended',     label: 'Suspended' },
]

// ── Document row ──────────────────────────────────────────────────────────────
function DocRow({ doc }: { doc: DocumentItem }) {
  const iconMap: Record<string, React.ElementType> = {
    business_license: FileText,
    food_certificate: FileCheck,
    tax_id:           Receipt,
  }
  const Icon = iconMap[doc.type] ?? FileText

  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2.5">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 flex-shrink-0" style={{ color: C.greenMid }} />
        <span className="text-xs font-semibold capitalize text-foreground">
          {doc.type.replace(/_/g, ' ')}
        </span>
      </div>
      {doc.url ? (
        <a
          href={doc.url}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-bold hover:underline"
          style={{ color: C.greenMid }}
        >
          View
        </a>
      ) : (
        <span className="text-xs text-muted-foreground">No file</span>
      )}
    </div>
  )
}

// ── Business card ─────────────────────────────────────────────────────────────
function BusinessCard({
  b, onApprove, onReject, onSuspend,
}: {
  b: Business
  onApprove: () => void
  onReject:  () => void
  onSuspend: () => void
}) {
  const [open, setOpen] = useState(false)
  const cfg = getStatusCfg(b.status)
  const StatusIcon = cfg.icon

  const canApprove = b.status === 'pending_review'
  const canReject  = b.status === 'pending_review'
  const canSuspend = b.status === 'approved'

  const initials = b.name
    .split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">

      {/* ── Row header ──────────────────────────────── */}
      <div
        className="flex cursor-pointer items-center gap-4 px-5 py-4"
        onClick={() => setOpen(o => !o)}
      >
        {/* Initials */}
        <div
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-black text-white"
          style={{ backgroundColor: C.greenMid }}
        >
          {initials}
        </div>

        {/* Name + submitter */}
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

        {/* Status + chevron */}
        <div className="flex flex-shrink-0 items-center gap-3">
          <div className="flex items-center gap-1.5">
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
          <div
            className="flex h-7 w-7 items-center justify-center rounded-lg"
            style={{ backgroundColor: C.bg }}
          >
            {open
              ? <ChevronUp   className="h-4 w-4" style={{ color: C.textMuted }} />
              : <ChevronDown className="h-4 w-4" style={{ color: C.textMuted }} />
            }
          </div>
        </div>
      </div>

      {/* ── Expanded panel ───────────────────────────── */}
      {open && (
        <div
          className="border-t px-5 py-5 space-y-4"
          style={{ borderColor: C.border, backgroundColor: C.bg }}
        >
          {/* Contact */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: C.textMuted }}>
              Contact
            </p>
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

          {/* Rejection reason */}
          {b.rejectionReason && (
            <div
              className="flex gap-3 rounded-xl border px-4 py-3"
              style={{ borderColor: '#FECACA', backgroundColor: '#FEF2F2' }}
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: C.error }} />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: C.error }}>
                  Rejection Reason
                </p>
                <p className="text-sm" style={{ color: C.error }}>{b.rejectionReason}</p>
              </div>
            </div>
          )}

          {/* Documents */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: C.textMuted }}>
              Documents
            </p>
            {b.documents?.length ? (
              <div className="space-y-2">
                {b.documents.map((d, i) => <DocRow key={i} doc={d} />)}
              </div>
            ) : (
              <p className="text-sm" style={{ color: C.textMuted }}>No documents uploaded</p>
            )}
          </div>

          {/* Actions */}
          {(canApprove || canReject || canSuspend) && (
            <div
              className="flex flex-wrap gap-2 pt-4 border-t"
              style={{ borderColor: C.border }}
            >
              {canApprove && (
                <button
                  onClick={onApprove}
                  className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: C.green }}
                >
                  <Check className="h-4 w-4" />
                  Approve
                </button>
              )}
              {canReject && (
                <button
                  onClick={onReject}
                  className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition-colors hover:bg-red-50"
                  style={{ borderColor: '#FECACA', color: C.error, backgroundColor: '#FEF2F2' }}
                >
                  <X className="h-4 w-4" />
                  Reject
                </button>
              )}
              {canSuspend && (
                <button
                  onClick={onSuspend}
                  className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition-colors"
                  style={{ borderColor: C.border, color: C.textMuted, backgroundColor: C.white }}
                >
                  <PauseCircle className="h-4 w-4" />
                  Suspend
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Stat chip ─────────────────────────────────────────────────────────────────
function StatChip({
  label, value, icon: Icon, accent, active, onClick,
}: {
  label: string; value: number; icon: React.ElementType
  accent: string; active: boolean; onClick: () => void
}) {
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
        <p className="text-xs font-semibold uppercase tracking-widest mt-0.5"
           style={{ color: active ? C.greenLight : C.textMuted }}>
          {label}
        </p>
      </div>
    </button>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState<string | null>(null)
  const [search, setSearch]         = useState('')
  const [activeStatus, setActiveStatus] = useState('all')

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
  const authHeader = token ? { Authorization: `Bearer ${token}` } : {}

  const normalizeBusinesses = (list: any[]): Business[] =>
    list.map((item: any) => {
      const owner = item?.owner
      const submitter: Submitter =
        item?.submitter ??
        (owner
          ? {
              name:  [owner.firstName, owner.lastName].filter(Boolean).join(' ').trim() || owner.email || '',
              email: owner.email || '',
              phone: owner.phone,
            }
          : { name: 'Unknown', email: '' })

      const documents: DocumentItem[] = Array.isArray(item?.documents)
        ? item.documents.map((d: any) => {
            const raw = typeof d?.url === 'string' ? d.url.replace(/[`"]/g, '').trim() : ''
            if (raw.startsWith('http://') || raw.startsWith('https://')) {
              return { type: d?.type ?? d?.name ?? 'document', url: raw }
            }
            const fixed = raw.length === 0
              ? undefined
              : raw.startsWith('/') ? `${API_BASE}${raw}` : `${API_BASE}/${raw}`
            return { type: d?.type ?? d?.name ?? 'document', url: fixed }
          })
        : []

      return {
        id: item?.id ?? item?.businessId ?? 0,
        name: item?.name ?? item?.businessName ?? 'Unknown',
        status: item?.status ?? 'pending_review',
        submitter,
        documents,
        rejectionReason: item?.rejectionReason ?? null,
        createdAt: item?.createdAt,
      }
    })

  const fetchBusinesses = async () => {
    setLoading(true)
    setError(null)
    try {
      const qs = activeStatus !== 'all'
        ? `?status=${encodeURIComponent(activeStatus)}&page=1&limit=50`
        : `?page=1&limit=50`
      const res = await fetch(`${API_BASE}/admin/businesses${qs}`, {
        headers: { 'Content-Type': 'application/json', ...authHeader },
      })
      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.success) throw new Error(json?.message || 'Failed to load businesses')
      const list = Array.isArray(json?.data?.businesses) ? json.data.businesses : []
      setBusinesses(normalizeBusinesses(list))
    } catch (e: any) {
      setError(e?.message || 'Unable to fetch businesses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBusinesses() }, [activeStatus])

  const approve = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/admin/businesses/${id}/approve`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeader },
      })
      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.success) throw new Error(json?.message || 'Approve failed')
      fetchBusinesses()
    } catch (e: any) { alert(e?.message || 'Failed to approve') }
  }

  const withReason = async (path: 'reject' | 'suspend', id: number) => {
    const reason = window.prompt('Enter reason:')
    if (!reason?.trim()) return
    try {
      const res = await fetch(`${API_BASE}/admin/businesses/${id}/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify({ reason: reason.trim() }),
      })
      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.success) throw new Error(json?.message || `${path} failed`)
      fetchBusinesses()
    } catch (e: any) { alert(e?.message || `Failed to ${path}`) }
  }

  const counts = useMemo(() => ({
    all:            businesses.length,
    pending_review: businesses.filter(b => b.status === 'pending_review').length,
    approved:       businesses.filter(b => b.status === 'approved').length,
    rejected:       businesses.filter(b => b.status === 'rejected').length,
    suspended:      businesses.filter(b => b.status === 'suspended').length,
  }), [businesses])

  const filtered = useMemo(() => {
    const list = Array.isArray(businesses) ? businesses : []
    const byStatus = activeStatus === 'all' ? list : list.filter(b => b.status === activeStatus)
    const term = search.toLowerCase().trim()
    if (!term) return byStatus
    return byStatus.filter(b =>
      b.name.toLowerCase().includes(term) ||
      (b.submitter.email || '').toLowerCase().includes(term) ||
      (b.submitter.name  || '').toLowerCase().includes(term)
    )
  }, [businesses, search, activeStatus])

  const statChips = [
    { key: 'all',            label: 'Total',     icon: Store,        accent: C.green,    value: counts.all            },
    { key: 'pending_review', label: 'Pending',   icon: Clock,        accent: C.amber,    value: counts.pending_review },
    { key: 'approved',       label: 'Approved',  icon: Check,        accent: C.greenMid, value: counts.approved       },
    { key: 'rejected',       label: 'Rejected',  icon: XCircle,      accent: C.error,    value: counts.rejected       },
    { key: 'suspended',      label: 'Suspended', icon: PauseCircle,  accent: '#6B7C6E',  value: counts.suspended      },
  ]

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: C.bg }}>
      <Sidebar />

      <main className="flex-1 min-w-0 overflow-auto">
        <div className="p-6">

          {/* ── Page header ─────────────────────────────── */}
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-1" style={{ color: C.greenLight }}>
              Super Admin
            </p>
            <h1 className="text-2xl font-black tracking-tight" style={{ color: C.textDark }}>
              Businesses
            </h1>
            <p className="mt-1 text-sm" style={{ color: C.textMuted }}>
              View and manage all businesses — pending, approved, rejected, suspended.
            </p>
          </div>

          {/* ── Stat chips ──────────────────────────────── */}
          <div className="grid grid-cols-5 gap-3 mb-6">
            {statChips.map(s => (
              <StatChip
                key={s.key}
                label={s.label}
                value={s.value}
                icon={s.icon}
                accent={s.accent}
                active={activeStatus === s.key}
                onClick={() => setActiveStatus(s.key)}
              />
            ))}
          </div>

          {/* ── Search + refresh ─────────────────────────── */}
          <div className="flex gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: C.textMuted }} />
              <input
                placeholder="Search by business name or submitter..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full h-10 rounded-xl border pl-10 pr-4 text-sm outline-none transition-colors"
                style={{
                  borderColor: C.border,
                  backgroundColor: C.white,
                  color: C.textDark,
                }}
                onFocus={e => (e.currentTarget.style.borderColor = C.greenMid)}
                onBlur={e  => (e.currentTarget.style.borderColor = C.border)}
              />
            </div>
            <button
              onClick={fetchBusinesses}
              disabled={loading}
              className="flex items-center gap-2 h-10 rounded-xl border px-4 text-sm font-semibold transition-colors"
              style={{ borderColor: C.border, backgroundColor: C.white, color: C.greenMid }}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = '#F0F7F3')}
              onMouseOut={e  => (e.currentTarget.style.backgroundColor = C.white)}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {/* ── Tab strip ────────────────────────────────── */}
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

          {/* ── Error banner ─────────────────────────────── */}
          {error && (
            <div
              className="mb-5 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium"
              style={{ borderColor: '#FECACA', backgroundColor: '#FEF2F2', color: C.error }}
            >
              <XCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* ── Results count ─────────────────────────────── */}
          {!loading && (
            <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: C.textMuted }}>
              {filtered.length} {filtered.length === 1 ? 'business' : 'businesses'}
              {search && ` matching "${search}"`}
            </p>
          )}

          {/* ── Loading ──────────────────────────────────── */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <RefreshCw className="h-6 w-6 animate-spin" style={{ color: C.greenMid }} />
                <p className="text-sm font-medium" style={{ color: C.textMuted }}>Loading businesses...</p>
              </div>
            </div>
          )}

          {/* ── Empty ────────────────────────────────────── */}
          {!loading && filtered.length === 0 && (
            <div
              className="flex flex-col items-center justify-center rounded-2xl border py-16 text-center"
              style={{ borderColor: C.border, backgroundColor: C.white }}
            >
              <div
                className="mb-4 flex h-14 w-14 items-center justify-center rounded-full"
                style={{ backgroundColor: C.border }}
              >
                <Store className="h-6 w-6" style={{ color: C.textMuted }} />
              </div>
              <p className="text-base font-bold" style={{ color: C.textDark }}>No businesses found</p>
              <p className="mt-1 text-sm" style={{ color: C.textMuted }}>
                Try adjusting your filters or search term.
              </p>
            </div>
          )}

          {/* ── List ─────────────────────────────────────── */}
          {!loading && filtered.length > 0 && (
            <div className="space-y-3">
              {filtered.map(b => (
                <BusinessCard
                  key={b.id}
                  b={b}
                  onApprove={() => approve(b.id)}
                  onReject={() => withReason('reject', b.id)}
                  onSuspend={() => withReason('suspend', b.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
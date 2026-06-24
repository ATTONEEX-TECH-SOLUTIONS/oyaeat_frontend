'use client'

import { useEffect, useMemo, useState } from 'react'
import { Sidebar } from '@/app/superadmin/dashboard/components/sidebar'
import { useToast } from '@/components/ui/toast-provider'
import { ReasonModal } from '../components/ui/reason-modal'

// Sub-component architectural elements import layer
import { PageHeader } from '../components/businesses/page-header'
import { SearchToolbar } from "@/app/superadmin/dashboard/components/businesses/search-toolbar"
import { StatusTabStrip } from '../components/businesses/status-tab-strip'
import { StatChip } from '../components/businesses/stat-chip'
import { BusinessesList } from '../components/businesses/businesses-list'
import { SuspensionTypeToggle } from '../components/businesses/suspension-type-toggle' // 🚀 IMPORT LAYER LINKED HERE

import { type Business, type Submitter } from '../components/businesses/business-card'
import { type DocumentItem } from '../components/businesses/doc-row'
import { C } from '@/config/config'
import { RefreshCw, Check, PauseCircle, Clock, Store, XCircle } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000'

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState<string | null>(null)
  const [search, setSearch]         = useState('')
  const [activeStatus, setActiveStatus] = useState('all')

  // 🚀 UPDATED STATE PROPERTIES TO SECURELY HOLD LAYER ASSIGNMENTS
  const [modal, setModal] = useState<{ 
    isOpen: boolean; 
    type: 'reject' | 'suspend' | null; 
    targetId: number | null; 
    name: string;
    suspensionType: 'shadow' | 'main';
  }>({
    isOpen: false, type: null, targetId: null, name: '', suspensionType: 'shadow'
  })

  const { toast } = useToast()
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
  
  const fetchHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const normalizeBusinesses = (list: any[]): Business[] =>
    list.map((item: any) => {
      const owner = item?.owner
      const submitter: Submitter = item?.submitter ?? (owner ? {
        name: [owner.firstName, owner.lastName].filter(Boolean).join(' ').trim() || owner.email || '',
        email: owner.email || '', phone: owner.phone,
      } : { name: 'Unknown', email: '' })

      const documents: DocumentItem[] = Array.isArray(item?.documents) ? item.documents.map((d: any) => {
        const raw = typeof d?.url === 'string' ? d.url.replace(/[`"]/g, '').trim() : ''
        const url = raw.startsWith('http') ? raw : raw.length === 0 ? undefined : raw.startsWith('/') ? `${API_BASE}${raw}` : `${API_BASE}/${raw}`
        return { type: d?.type ?? d?.name ?? 'document', url }
      }) : []

      return { id: item?.id ?? item?.businessId ?? 0, name: item?.name ?? item?.businessName ?? 'Unknown', status: item?.status ?? 'pending_review', submitter, documents, rejectionReason: item?.rejectionReason ?? null, createdAt: item?.createdAt }
    })

  const fetchBusinesses = async () => {
    setLoading(true); setError(null)
    try {
      const qs = activeStatus !== 'all' ? `?status=${encodeURIComponent(activeStatus)}&page=1&limit=50` : `?page=1&limit=50`
      const res = await fetch(`${API_BASE}/admin/businesses${qs}`, { headers: fetchHeaders })
      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.success) throw new Error(json?.message || 'Failed to load businesses')
      setBusinesses(normalizeBusinesses(json?.data?.businesses || []))
    } catch (e: any) {
      setError(e?.message || 'Unable to fetch businesses')
      toast('Sync Failure', e?.message || 'Failed fetching business arrays.', 'error')
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchBusinesses() }, [activeStatus])

  const approve = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/admin/businesses/${id}/approve`, { 
        method: 'POST', 
        headers: fetchHeaders,
        body: JSON.stringify({ reason: null }) 
      })
      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.success) throw new Error(json?.message || 'Approve failed')
      toast('Verification Successful', 'Profile approved.', 'success')
      fetchBusinesses()
    } catch (e: any) { toast('Error Processing Action', e?.message, 'error') }
  }

  const handleModalFormSubmit = async (reason: string) => {
    if (!modal.targetId || !modal.type) return
    try {
      const payload: Record<string, any> = { reason: reason.trim() };
      
      // 🚀 ATTACH LEVEL IDENTIFIER ONLY ON SUSPEND REQUEST ROUTES MATCHING BACKEND
      if (modal.type === 'suspend') {
        payload.suspensionType = modal.suspensionType;
      }

      const res = await fetch(`${API_BASE}/admin/businesses/${modal.targetId}/${modal.type}`, {
        method: 'POST', 
        headers: fetchHeaders, 
        body: JSON.stringify(payload)
      })
      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.success) throw new Error(json?.message || `${modal.type} failed`)
      
      toast('Status Modified', `Successfully updated profile state records for ${modal.name}.`, 'success')
      setModal({ isOpen: false, type: null, targetId: null, name: '', suspensionType: 'shadow' })
      fetchBusinesses()
    } catch (e: any) { toast('Processing Error', e?.message, 'error') }
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
    return byStatus.filter(b => b.name.toLowerCase().includes(term) || (b.submitter.email || '').toLowerCase().includes(term) || (b.submitter.name || '').toLowerCase().includes(term))
  }, [businesses, search, activeStatus])

  const statChips = [
    { key: 'all',            label: 'Total',     icon: Store,        accent: C.green,    value: counts.all            },
    { key: 'pending_review', label: 'Pending',   icon: Clock,        accent: C.amber,    value: counts.pending_review },
    { key: 'approved',       label: 'Approved',  icon: Check,        accent: C.greenMid, value: counts.approved       },
    { key: 'rejected',       label: 'Rejected',  icon: XCircle,      accent: C.error,    value: counts.rejected       },
    { key: 'suspended',      label: 'Suspended', icon: PauseCircle,  accent: '#6B7C6E',  value: counts.suspended      },
  ]
  
  const unsuspend = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/admin/businesses/${id}/approve`, { 
        method: 'POST', 
        headers: fetchHeaders,
        body: JSON.stringify({ reason: null }) 
      })
      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.success) throw new Error(json?.message || 'Reactivation execution failed')
      
      toast('Profile Reactivated', 'The business operations are live and approved again.', 'success')
      fetchBusinesses()
    } catch (e: any) { 
      toast('Operation Failed', e?.message || 'Network transaction drop.', 'error') 
    }
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: C.bg }}>
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="p-6">
          <PageHeader />

          <div className="grid grid-cols-5 gap-3 mb-6">
            {statChips.map(({ key, ...rest }) => (
              <StatChip 
                key={key} 
                {...rest} 
                active={activeStatus === key} 
                onClick={() => setActiveStatus(key)} 
              />
            ))}
          </div>

          <SearchToolbar search={search} setSearch={setSearch} onRefresh={fetchBusinesses} loading={loading} />

          <StatusTabStrip activeStatus={activeStatus} setActiveStatus={setActiveStatus} counts={counts} />

          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium" style={{ borderColor: '#FECACA', backgroundColor: '#FEF2F2', color: C.error }}>
              <XCircle className="h-4 w-4" />
              {error}
            </div>
          )}
          
          {!loading && <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: C.textMuted }}>{filtered.length} matching lists found</p>}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="h-6 w-6 animate-spin" style={{ color: C.greenMid }} />
            </div>
          ) : (
// REPLACE THIS ASSIGNMENT SLOT INSIDE YOUR MAIN BUSINESSESPAGE FILE:
<BusinessesList
  filtered={filtered}
  onApprove={approve}
  onUnsuspend={unsuspend}
  onRejectRequest={(id, name) => setModal({ isOpen: true, type: 'reject', targetId: id, name, suspensionType: 'shadow' })}
  
  // 🚀 FIXED: Checks if the target business profile is already shadow-suspended 
  // and dynamically presets the modal to 'main' for an immediate hard-lockout upgrade!
  onSuspendRequest={(id, name) => {
    const targetBiz = filtered.find(b => b.id === id);
    const isAlreadyShadow = targetBiz?.status === 'suspended' && targetBiz?.suspensionType !== 'main';
    
    setModal({ 
      isOpen: true, 
      type: 'suspend', 
      targetId: id, 
      name, 
      suspensionType: isAlreadyShadow ? 'main' : 'shadow' // Sets default toggle position dynamically
    });
  }}
/>

          )}
        </div>
      </main>

         <ReasonModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ isOpen: false, type: null, targetId: null, name: '', suspensionType: 'shadow' })}
        onSubmit={handleModalFormSubmit}
        title={modal.type === 'reject' ? 'Reject Submission' : `Suspend Profile: ${modal.name}`}
        description={`State the core reason below for updating the platform parameters of ${modal.name}.`}
        confirmButtonVariant={modal.type === 'reject' ? 'danger' : 'warning'}
        confirmButtonText={modal.type === 'reject' ? 'Confirm Rejection' : 'Confirm Suspension'}
      >
        {/* 🚀 FIXED: Renders safely inside the modal component tags as a React child node */}
        {modal.type === 'suspend' && (
          <SuspensionTypeToggle 
            activeType={modal.suspensionType} 
            onChange={(nextType) => setModal(prev => ({ ...prev, suspensionType: nextType }))} 
          />
        )}
      </ReasonModal>



    </div>
  )
}


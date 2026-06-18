'use client'

import { useEffect, useMemo, useState } from 'react'
import { Sidebar } from '@/app/superadmin/dashboard/components/sidebar'
import { RestaurantsList } from '@/app/superadmin/dashboard/components/restaurants-list'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast-provider'
import { Search, RefreshCw, Store, XCircle } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

type BusinessDoc = { type: string; url: string }
type Business = {
  id: number
  name: string
  status: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'suspended'
  businessEmail?: string
  businessPhone?: string
  streetAddress?: string
  city?: string
  state?: string
  type?: string
  createdAt: string
  rejectionReason?: string | null
  documents?: BusinessDoc[]
}

type RestaurantUI = {
  id: string
  name: string
  email: string
  phone: string
  address: string
  cuisineType: string
  status: 'approved' // 👈 Strictly locked down to approved typing limits
  createdAt: string
  rejectionReason?: string | null
  documents: { businessLicense: boolean; foodLicense: boolean; taxId: boolean }
}

function mapBusinessToRestaurantUI(b: Business): RestaurantUI {
  const docs = Array.isArray(b.documents) ? b.documents : []
  const has = (t: string) => docs.some((d) => d?.type === t)
  return {
    id: String(b.id),
    name: b.name,
    email: b.businessEmail || '',
    phone: b.businessPhone || '',
    address: [b.streetAddress, b.city, b.state].filter(Boolean).join(', ') || '—',
    cuisineType: b.type || 'restaurant',
    status: 'approved', // Safeguard hardcoded status allocation match parameter
    createdAt: b.createdAt,
    rejectionReason: b.rejectionReason,
    documents: {
      businessLicense: has('business_license'),
      foodLicense: has('food_certificate'),
      taxId: has('tax_id'),
    },
  }
}

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<RestaurantUI[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { toast } = useToast()

  const adminToken = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
  const authHeader = adminToken ? { Authorization: `Bearer ${adminToken}` } : {}
 const fetchHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {})
  }
  const fetchAll = async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch data using the specific status query parameter filter rule
      const res = await fetch(`${API_BASE}/admin/businesses?status=approved&page=1&limit=100`, {
        headers: fetchHeaders,
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.message || `Failed (${res.status})`)
      const list: Business[] =
        Array.isArray(json?.data?.businesses) ? json.data.businesses :
        Array.isArray(json?.data)             ? json.data :
        Array.isArray(json?.businesses)       ? json.businesses :
        Array.isArray(json)                   ? json : []
      
      // ── Explicit Array Data Filtering Safeguard Check ──
      // This strips away any non-approved metadata values from entering your local view state array
      const approvedOnly = list
        .filter((b) => b.status === 'approved')
        .map(mapBusinessToRestaurantUI)

      setRestaurants(approvedOnly)
    } catch (e: any) {
      setError(e?.message || 'Failed to load restaurants')
      toast('Sync Error', e?.message || 'Failed to sync with API', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/businesses/${id}/status`, {
        method: 'PATCH',
        headers: fetchHeaders,
        body: JSON.stringify({ status: 'approved' }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.message || 'Failed to approve restaurant profile')
      
      toast('Restaurant Approved', 'The restaurant is now live on the platform.', 'success')
      fetchAll()
    } catch (err: any) {
      toast('Operation Failed', err.message, 'error')
    }
  }

  const handleReject = async (id: string, reason: string) => {
    try {
      const res = await fetch(`${API_BASE}/admin/businesses/${id}/status`, {
        method: 'PATCH',
        headers: fetchHeaders,
        body: JSON.stringify({ status: 'rejected', reason }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.message || 'Failed to reject restaurant submission')
      
      toast('Submission Rejected', 'Feedback documentation logs saved.', 'success')
      fetchAll()
    } catch (err: any) {
      toast('Operation Failed', err.message, 'error')
    }
  }

  const filtered = useMemo(() =>
    restaurants.filter(r =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  [restaurants, searchTerm])

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F5F1EB' }}>
      <Sidebar />

      <main className="flex-1 min-w-0 overflow-auto">
        <div className="p-6">

          {/* Page header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#52B788] mb-1">Super Admin</p>
              <h1 className="text-2xl font-black tracking-tight text-foreground">Restaurants</h1>
              <p className="text-muted-foreground mt-1 text-sm">All approved and active restaurants on the platform</p>
            </div>

            {!loading && (
              <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-3 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: '#1B433218' }}>
                  <Store className="h-5 w-5" style={{ color: '#1B4332' }} />
                </div>
                <div>
                  <p className="text-xl font-black tracking-tight text-foreground">{restaurants.length}</p>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Total</p>
                </div>
              </div>
            )}
          </div>

          {/* Search + refresh toolbar */}
          <div className="flex gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-10 h-10 rounded-xl border-border bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-[#1B4332]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={fetchAll}
              disabled={loading}
              className="h-10 rounded-xl border-border bg-card text-[#2D6A4F] font-semibold hover:bg-[#F0F7F3] transition-all gap-2 px-4"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>

          {/* Error Banner view fallback node */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 flex items-center gap-2">
              <XCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="h-6 w-6 animate-spin text-[#2D6A4F]" />
            </div>
          )}

          {!loading && (
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              {filtered.length} {filtered.length === 1 ? 'restaurant' : 'restaurants'}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          )}

          {!loading && (
            <RestaurantsList 
              restaurants={filtered as any} 
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}
        </div>
      </main>
    </div>
  )
}

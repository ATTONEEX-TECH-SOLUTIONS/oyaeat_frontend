export type BusinessStatus = 'pending_review' | 'approved' | 'rejected' | 'suspended'

export type BusinessOwner = {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
}

export type Business = {
  id: number
  name?: string
  businessName?: string
  status: BusinessStatus
  createdAt: string
  rejectionReason?: string | null
  owner?: BusinessOwner
}

export type BusinessStats = {
  total: number
  pending: number
  approved: number
  rejected: number
  suspended: number
}

// ✅ NEW: dashboard metrics including orders + revenue
export type DashboardMetrics = {
  totalRestaurants: number
  activeRestaurants: number
  pendingApprovals: number
  totalRiders: number
  activeRiders: number
  totalOrders: number
  todayOrders: number
  totalRevenue: number
  avgOrderValue: number
}

function getApiBaseUrl() {
  // MUST match what you used in login page
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'
}

function getTokenOrThrow() {
  const token = localStorage.getItem('admin_token') // ✅ matches your login
  if (!token) throw new Error('Admin not logged in. Please login again.')
  return token
}

async function safeJson(res: Response) {
  const text = await res.text().catch(() => '')
  try {
    return text ? JSON.parse(text) : null
  } catch {
    return null
  }
}

async function request(path: string, options: RequestInit = {}) {
  const token = getTokenOrThrow()
  const API_BASE_URL = getApiBaseUrl()

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
    cache: 'no-store',
  })

  const json = await safeJson(res)

  if (!res.ok || !json?.success) {
    throw new Error(json?.message || `Request failed (${res.status})`)
  }

  return json
}

// ✅ NOTE: routes are /admin/... not /api/admin/...
export async function fetchBusinessStats(): Promise<BusinessStats> {
  const json = await request('/admin/businesses/stats')
  return json.data as BusinessStats
}

export async function fetchBusinesses(params?: {
  status?: BusinessStatus
  page?: number
  limit?: number
}): Promise<{ businesses: Business[]; pagination?: any }> {
  const qs = new URLSearchParams()
  if (params?.status) qs.set('status', params.status)
  if (params?.page) qs.set('page', String(params.page))
  if (params?.limit) qs.set('limit', String(params.limit))

  const path = `/admin/businesses${qs.toString() ? `?${qs}` : ''}`
  const json = await request(path)
  return json.data as { businesses: Business[]; pagination?: any }
}

export async function approveBusiness(businessId: number) {
  return request(`/admin/businesses/${businessId}/approve`, { method: 'POST' })
}

export async function rejectBusiness(businessId: number, reason: string) {
  return request(`/admin/businesses/${businessId}/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  })
}

export async function suspendBusiness(businessId: number, reason?: string) {
  return request(`/admin/businesses/${businessId}/suspend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason: reason || '' }),
  })
}

// Dashboard metrics route (orders, revenue, etc)
export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  // backend should return: { success: true, data: metrics }
  const json = await request('/admin/dashboard/metrics')
  return json.data as DashboardMetrics
}
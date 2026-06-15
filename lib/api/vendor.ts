type ApiOk<T> = { success: true; data: T }
type ApiErr = { success: false; message?: string }

export type MenuItem = {
  id: number
  name: string
  category: string
  price: number
  description?: string | null
  imageUrl?: string | null
  imagePublicId?: string | null
  available: boolean
  createdAt?: string
  updatedAt?: string
}

export type StaffMember = {
  id: number
  fullName: string
  role: string
  email?: string | null
  phone?: string | null
  status: string
  createdAt?: string
  updatedAt?: string
}

export type OrderStatus =
  | 'pending'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'

export type OrderItem = {
  id: number
  name: string
  price: number
  quantity: number
  menuItem?: {
    imageUrl?: string | null
    imagePublicId?: string | null
  }
}

export type Order = {
  id: number
  customerName: string
  customerPhone?: string | null
  address?: string | null
  paymentMethod?: string | null
  notes?: string | null
  status: OrderStatus
  total: number
  createdAt: string
  items: OrderItem[]
}

export type SalesPoint = {
  date: string
  revenue: number
  orders: number
}

// ── Wallet Types ──
export type WalletTransaction = {
  id: number
  amount: number
  type: 'credit' | 'debit' | 'withdrawal'
  status: 'pending' | 'completed' | 'failed'
  description: string
  createdAt: string
}

export type WalletData = {
  balance: number
  pendingPayouts: number
  transactions: WalletTransaction[]
}

// ── Review Types ──
export type Review = {
  id: number
  customerName: string
  rating: number
  comment?: string | null
  orderId?: number
  createdAt: string
}

export type ReviewsData = {
  averageRating: number
  totalReviews: number
  distribution: {
    5: number; 4: number; 3: number; 2: number; 1: number;
  }
  reviews: Review[]
}

export type VendorDashboard = {
  business: null | {
    id: number
    name: string
    status: string
    rejectionReason?: string | null
    hasDocuments: boolean
    hasBankDetails: boolean
  }
  summary: null | {
    totalOrders: number
    revenueToday: number
    activeOrders: number
    totalCustomers: number
    avgOrderValue: number
    avgDeliveryTimeMins: number
    customerRating: number
    avgPrepTimeMins: number
  }
  recentOrders: Order[]
  salesSeries: SalesPoint[]
}

export type MenuItemPayload = {
  name: string
  category: string
  price: number
  description?: string | null
  available: boolean
  image?: File | null
}

function base() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'
}

function token() {
  if (typeof window === 'undefined') {
    throw new Error('Not logged in')
  }

  const t = localStorage.getItem('authToken')
  if (!t) throw new Error('Not logged in')

  return t
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${base()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token()}`,
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  })

  const json = (await res.json().catch(() => null)) as ApiOk<any> | ApiErr | null

  if (!res.ok) {
    throw new Error((json as any)?.message || `Request failed (${res.status})`)
  }

  if (!json || (json as any).success === false) {
    throw new Error((json as any)?.message || 'Request failed')
  }

  return (json as any).data as T
}

function makeMenuFormData(body: MenuItemPayload) {
  const formData = new FormData()

  formData.append('name', body.name)
  formData.append('category', body.category)
  formData.append('price', String(body.price))
  formData.append('description', body.description || '')
  formData.append('available', String(body.available))

  if (body.image) {
    formData.append('image', body.image)
  }

  return formData
}

export const vendorApi = {


  getVendorStatus: () => 
    request<{
      success: boolean;
      userId: number;
      phoneVerified: boolean;
      business: {
        id: number;
        name: string;
        status: string;
        hasDocuments: boolean;
        hasBankDetails: boolean;
        rejectionReason: string | null;
        documents: any[];
        bankDetail: any;
      } | null;
      debug: boolean;
    }>('/vendor/status'),

    
  getDashboard: () => request<{ dashboard: VendorDashboard }>('/vendor/dashboard'),

  getMenu: () => request<{ business?: { id: number; name: string; status: string }; items: MenuItem[] }>('/vendor/menu'),

  createMenuItem: (body: MenuItemPayload) =>
    request<{ item: MenuItem }>('/vendor/menu', {
      method: 'POST',
      body: makeMenuFormData(body),
    }),

  updateMenuItem: (id: number, body: MenuItemPayload) =>
    request<{ item: MenuItem }>(`/vendor/menu/${id}`, {
      method: 'PATCH',
      body: makeMenuFormData(body),
    }),

  deleteMenuItem: (id: number) =>
    request<{ message: string }>(`/vendor/menu/${id}`, {
      method: 'DELETE',
    }),

  getOrders: (params?: {
    status?: OrderStatus
    page?: number
    limit?: number
  }) => {
    const q = new URLSearchParams()

    if (params?.status) q.set('status', params.status)
    if (params?.page) q.set('page', String(params.page))
    if (params?.limit) q.set('limit', String(params.limit))

    const suffix = q.toString() ? `?${q.toString()}` : ''

    return request<{
      orders: Order[]
      pagination: { total: number; page: number; limit: number; totalPages: number }
    }>(`/vendor/orders${suffix}`)
  },

  updateOrderStatus: (orderId: number, status: OrderStatus) =>
    request<{ order: Order }>(`/vendor/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }),

  getStaff: () => request<{ staff: StaffMember[] }>('/vendor/staff'),

  createStaff: (body: {
    fullName: string
    role: string
    email?: string | null
    phone?: string | null
    status?: string
  }) =>
    request<{ staff: StaffMember }>('/vendor/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),

  updateStaff: (
    staffId: number,
    body: Partial<{
      fullName: string
      role: string
      email: string | null
      phone: string | null
      status: string
    }>,
  ) =>
    request<{ staff: StaffMember }>(`/vendor/staff/${staffId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),

  deleteStaff: (staffId: number) =>
    request<{ message: string }>(`/vendor/staff/${staffId}`, {
      method: 'DELETE',
    }),

  
   // Inside vendorApi object block:
  getWallet: () => 
    request<{ wallet: WalletData; hasBankDetails: boolean; linkedBankAccount: string }>('/api/wallet/summary'),


  requestWithdrawal: (amount: number) =>
    request<{ message: string }>('/api/wallet/request-payout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    }),


  // Reviews
  getReviews: (params?: { page?: number; limit?: number }) => {
    const q = new URLSearchParams()
    if (params?.page) q.set('page', String(params.page))
    if (params?.limit) q.set('limit', String(params.limit))
    const suffix = q.toString() ? `?${q.toString()}` : ''
    return request<{ data: ReviewsData; pagination: { total: number; page: number; limit: number; totalPages: number } }>(`/vendor/reviews${suffix}`)
  },
}
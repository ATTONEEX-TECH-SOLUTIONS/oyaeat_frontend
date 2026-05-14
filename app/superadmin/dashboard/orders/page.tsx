'use client'

import { useEffect, useMemo, useState } from 'react'
import { Sidebar } from '@/app/superadmin/dashboard/components/sidebar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, RefreshCw, ShoppingCart, XCircle, ArrowRight } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled'

export default function SuperadminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false)

  const adminToken = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null

  const fetchOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (adminToken) headers.Authorization = `Bearer ${adminToken}`

      const res = await fetch(`${API_BASE}/admin/orders?page=${page}&limit=50`, {
        headers,
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.message || `Failed to fetch global orders (${res.status})`)
      
      const list = Array.isArray(json?.data?.orders) ? json.data.orders :
                   Array.isArray(json?.orders) ? json.orders :
                   Array.isArray(json?.data) ? json.data : []
      setOrders(list)
      setHasNextPage(list.length === 50 || (json?.data?.pagination?.hasNextPage ?? false))
    } catch (e: any) {
      setError(e?.message || 'Error communicating with the orders server')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [page])

  const filtered = useMemo(() => {
    return orders.filter(o => 
      (statusFilter === 'all' || o.status === statusFilter) &&
      (o.id?.toString().includes(searchTerm) || 
       (o.businessName || o.restaurantName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
       (o.customer?.name || o.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [orders, searchTerm, statusFilter])

  // Helpers for graceful rendering
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'preparing': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'ready': return 'bg-indigo-100 text-indigo-700 border-indigo-200'
      case 'out_for_delivery': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'cancelled': return 'bg-rose-100 text-rose-700 border-rose-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F5F1EB' }}>
      <Sidebar />

      <main className="flex-1 min-w-0 overflow-auto">
        <div className="p-6">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#52B788] mb-1">
                Super Admin
              </p>
              <h1 className="text-2xl font-black tracking-tight text-foreground">
                Global Orders
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                Monitor all historical and live orders across the entire platform.
              </p>
            </div>

            {/* Total count badge */}
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-3 shadow-sm">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ backgroundColor: '#1B433218' }}
              >
                <ShoppingCart className="h-5 w-5" style={{ color: '#1B4332' }} />
              </div>
              <div>
                <p className="text-xl font-black tracking-tight text-foreground">{orders.length}</p>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Collected</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mb-5 flex-col md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, restaurant, or customer name..."
                className="pl-10 h-10 rounded-xl border-border bg-card text-foreground placeholder:text-muted-foreground hover:border-[#a5d6a7] focus-visible:ring-[#1a5c2a] focus-visible:border-[#1a5c2a] transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="h-10 px-4 rounded-xl border border-border bg-card text-sm font-semibold text-foreground outline-none hover:border-[#a5d6a7] focus:border-[#1a5c2a] transition-colors shadow-sm"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
            >
               <option value="all">All Statuses</option>
               <option value="pending">Pending</option>
               <option value="preparing">Preparing</option>
               <option value="ready">Ready</option>
               <option value="out_for_delivery">Out for Delivery</option>
               <option value="delivered">Delivered</option>
               <option value="cancelled">Cancelled</option>
            </select>

            <Button
              variant="outline"
              onClick={fetchOrders}
              disabled={loading}
              className="h-10 rounded-xl border-border bg-card text-[#2D6A4F] font-semibold hover:bg-[#F0F7F3] hover:border-[#52B788] transition-all gap-2 px-4 shrink-0 shadow-sm"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border-2 border-red-200 bg-red-50/80 px-4 py-3 text-sm font-semibold text-red-700 flex items-center gap-2 shadow-sm">
              <XCircle className="h-5 w-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-background border-b border-border">
                     <tr>
                        {['Order ID', 'Restaurant', 'Customer', 'Amount', 'Status', 'Date', ''].map(h => (
                          <th key={h} className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-widest text-primary">
                             {h}
                          </th>
                        ))}
                     </tr>
                  </thead>
                  <tbody>
                     {loading ? (
                        <tr><td colSpan={7} className="px-6 py-12 text-center text-sm font-bold text-muted-foreground bg-card">Loading platform orders...</td></tr>
                     ) : filtered.length === 0 ? (
                        <tr><td colSpan={7} className="px-6 py-16 text-center text-sm font-medium text-muted-foreground bg-card">
                            <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            No orders found matching your criteria.
                        </td></tr>
                     ) : (
                        filtered.map((order, i) => (
                          <tr key={order.id || i} className="border-b border-border/40 last:border-0 hover:bg-[#F0F7F1] transition-colors cursor-default">
                             <td className="px-6 py-4">
                                <span className="font-black text-[#1a5c2a]">#{order.id}</span>
                             </td>
                             <td className="px-6 py-4">
                               <p className="font-bold text-foreground">{order.businessName || order.business?.name || order.restaurantName || 'Unknown Vendor'}</p>
                             </td>
                             <td className="px-6 py-4">
                                <span className="text-sm font-semibold text-[#4A7C59] bg-background px-2 py-1 rounded-md border border-border/50">
                                   {order.customer?.firstName || order.customer?.name || order.customerName || 'Guest User'}
                                </span>
                             </td>
                             <td className="px-6 py-4 font-black tracking-tight text-foreground">₦{Number(order.totalAmount || order.amount || 0).toLocaleString()}</td>
                             <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                                   {order.status}
                                </span>
                             </td>
                             <td className="px-6 py-4 text-[13px] font-semibold text-muted-foreground">
                               {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                             </td>
                             <td className="px-6 py-4 text-right">
                                <button className="p-2 text-[#4A7C59] hover:bg-[#D8E4DC] hover:text-[#1a5c2a] rounded-xl transition-colors">
                                   <ArrowRight className="w-4 h-4" />
                                </button>
                             </td>
                          </tr>
                        ))
                     )}
                  </tbody>
               </table>
             </div>
             
             {/* Pagination Controls */}
             <div className="border-t border-border bg-card px-6 py-4 flex items-center justify-between">
               <span className="text-sm font-semibold text-muted-foreground">
                 Page {page}
               </span>
               <div className="flex gap-2">
                 <Button
                   variant="outline"
                   disabled={page === 1 || loading}
                   onClick={() => setPage(p => Math.max(1, p - 1))}
                   className="h-9 px-4 rounded-xl border-border text-[#2D6A4F] hover:bg-[#F0F7F3] transition-colors"
                 >
                   Previous
                 </Button>
                 <Button
                   variant="outline"
                   disabled={!hasNextPage || loading}
                   onClick={() => setPage(p => p + 1)}
                   className="h-9 px-4 rounded-xl border-border text-[#2D6A4F] hover:bg-[#F0F7F3] transition-colors"
                 >
                   Next
                 </Button>
               </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  )
}

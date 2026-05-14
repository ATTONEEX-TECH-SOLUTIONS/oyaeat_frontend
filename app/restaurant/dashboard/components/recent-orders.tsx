'use client'

import { useState, useEffect } from 'react'
import { Eye, CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

type OrderItem = { name: string; quantity: number; price: number }

export type RecentOrder = {
  id: number
  customerName: string
  status:
    | 'pending'
    | 'preparing'
    | 'ready'
    | 'out_for_delivery'
    | 'delivered'
    | 'cancelled'
  total: number
  createdAt: string
  items?: OrderItem[]
}

function labelStatus(status: RecentOrder['status']) {
  switch (status) {
    case 'pending':
      return 'Pending'
    case 'preparing':
      return 'Preparing'
    case 'ready':
      return 'Ready for Pickup'
    case 'out_for_delivery':
      return 'Out for Delivery'
    case 'delivered':
      return 'Delivered'
    case 'cancelled':
      return 'Cancelled'
    default:
      return status
  }
}

const getStatusIcon = (status: RecentOrder['status']) => {
  switch (status) {
    case 'pending':
    case 'preparing':
      return <Clock className="w-5 h-5 text-amber-600" />
    case 'ready':
      return <CheckCircle className="w-5 h-5 text-blue-600" />
    case 'out_for_delivery':
      return <AlertCircle className="w-5 h-5 text-orange-600" />
    case 'delivered':
      return <CheckCircle className="w-5 h-5 text-green-600" />
    case 'cancelled':
      return <XCircle className="w-5 h-5 text-red-600" />
    default:
      return null
  }
}

const getStatusColor = (status: RecentOrder['status']) => {
  switch (status) {
    case 'pending':
    case 'preparing':
      return 'bg-amber-50 text-amber-700'
    case 'ready':
      return 'bg-blue-50 text-blue-700'
    case 'out_for_delivery':
      return 'bg-orange-50 text-orange-700'
    case 'delivered':
      return 'bg-green-50 text-green-700'
    case 'cancelled':
      return 'bg-red-50 text-red-700'
    default:
      return 'bg-gray-50 text-gray-700'
  }
}

function timeAgo(iso: string) {
  const then = new Date(iso).getTime()
  const now = Date.now()
  const diff = Math.max(0, now - then)

  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`

  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`

  const days = Math.floor(hrs / 24)
  return `${days} day${days > 1 ? 's' : ''} ago`
}

function itemsText(items?: OrderItem[]) {
  if (!items?.length) return '—'
  // e.g. "Margherita Pizza x2, Caesar Salad x1"
  return items
    .slice(0, 3)
    .map((i) => `${i.name} x${i.quantity ?? 1}`)
    .join(', ')
}

export default function RecentOrders({
  orders,
  onView,
}: {
  orders: RecentOrder[]
  onView?: (orderId: number) => void
}) {
  const [page, setPage] = useState(1)
  const limit = 5
  
  const totalPages = Math.ceil((orders?.length || 0) / limit)
  const paginatedOrders = orders?.slice((page - 1) * limit, page * limit) || []

  useEffect(() => {
    setPage(1)
  }, [orders])

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="font-bold text-lg text-foreground mb-6">Recent Orders</h3>

      <div className="space-y-3">
        {!paginatedOrders?.length ? (
          <div className="text-sm text-muted-foreground">No recent orders.</div>
        ) : (
          paginatedOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary transition"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-semibold text-foreground">{order.id}</h4>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(
                      order.status,
                    )} flex items-center gap-1`}
                  >
                    {getStatusIcon(order.status)}
                    {labelStatus(order.status)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  {order.customerName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {itemsText(order.items)}
                </p>
              </div>

              <div className="flex items-center gap-6 ml-4">
                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    ₦{Math.round(order.total || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {timeAgo(order.createdAt)}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onView?.(order.id)}
                  aria-label="View order"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground font-medium">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
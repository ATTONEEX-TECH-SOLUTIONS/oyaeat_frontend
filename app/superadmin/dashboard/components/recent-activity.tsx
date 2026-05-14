import type { Order } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'

interface RecentActivityProps {
  orders: Order[]
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  ready: 'bg-indigo-100 text-indigo-800',
  out_for_delivery: 'bg-orange-100 text-orange-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export function RecentActivity({ orders }: RecentActivityProps) {
  const recentOrders = orders.slice(0, 5)

  return (
    <div className="bg-card rounded-lg border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">
        Recent Orders
      </h3>
      <div className="space-y-4">
        {recentOrders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between pb-4 border-b border-slate-100 last:border-b-0"
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">{order.id}</p>
              <p className="text-xs text-slate-500">
                {formatDistanceToNow(new Date(order.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">
                ₦{order.total.toLocaleString()}
              </p>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  statusColors[order.status] || 'bg-slate-100 text-slate-800'
                }`}
              >
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import { TrendingUp, Users, Bike, ShoppingCart, AlertCircle, CheckCircle } from 'lucide-react'
import type { DashboardMetrics } from '@/lib/api/superadmin' // ✅ keep types consistent

interface DashboardOverviewProps {
  metrics: DashboardMetrics
}

export function DashboardOverview({ metrics }: DashboardOverviewProps) {
  const stats = [
    {
      label: 'Active Restaurants',
      value: metrics.activeRestaurants,
      total: metrics.totalRestaurants,
      icon: Users,
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      label: 'Pending Approvals',
      value: metrics.pendingApprovals,
      icon: AlertCircle,
      color: 'bg-yellow-500/10 text-yellow-500',
      highlight: true,
    },
    {
      label: 'Active Riders',
      value: metrics.activeRiders,
      total: metrics.totalRiders,
      icon: Bike,
      color: 'bg-green-500/10 text-green-500',
    },
    {
      label: 'Today Orders',
      value: metrics.todayOrders,
      total: metrics.totalOrders,
      icon: ShoppingCart,
      color: 'bg-purple-500/10 text-purple-500',
    },
    {
      label: 'Total Revenue',
      value: `₦${(metrics.totalRevenue / 1_000_000).toFixed(1)}M`,
      icon: TrendingUp,
      color: 'bg-orange-500/10 text-orange-500',
    },
    {
      label: 'Avg Order Value',
      value: `₦${Number(metrics.avgOrderValue || 0).toLocaleString()}`,
      icon: CheckCircle,
      color: 'bg-indigo-500/10 text-indigo-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className={`p-6 rounded-lg border ${
              stat.highlight ? 'bg-yellow-50 border-yellow-200' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">{stat.value}</p>

                {typeof stat.total === 'number' && (
                  <p className="text-xs text-slate-500 mt-1">of {stat.total} total</p>
                )}
              </div>

              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
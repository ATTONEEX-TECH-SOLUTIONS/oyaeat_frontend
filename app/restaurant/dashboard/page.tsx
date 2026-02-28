'use client'

import { useEffect, useMemo, useState } from 'react'
import { ShoppingCart, DollarSign, Users, Clock } from 'lucide-react'
import StatCard from './components/stat-card'
import RecentOrders from './components/recent-orders'
import SalesChart from './components/sales-chart'
import Link from 'next/link'
import { Spinner } from '@/components/ui/spinner'
import { vendorApi, type VendorDashboard } from '@/lib/api/vendor'

export default function DashboardPage() {
  const [dash, setDash] = useState<VendorDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        setLoading(true)
        setError('')
        const res = await vendorApi.getDashboard()
        if (cancelled) return
        setDash(res.dashboard || null)
        try { localStorage.setItem('vendor_dashboard', JSON.stringify(res.dashboard || null)) } catch {}
      } catch (e: any) {
        if (cancelled) return
        setError(e?.message || 'Failed to load dashboard')
        try {
          const cached = localStorage.getItem('vendor_dashboard')
          if (cached) setDash(JSON.parse(cached))
        } catch {}
      } finally {
        if (cancelled) return
        setLoading(false)
      }
    })()

    return () => { cancelled = true }
  }, [])

  const business = dash?.business ?? null
  const summary  = dash?.summary  ?? null
  const status   = business?.status
  const hasBusiness = !!business

  const cards = useMemo(() => ({
    totalOrders:          summary?.totalOrders          ?? 0,
    revenueToday:         summary?.revenueToday         ?? 0,
    activeOrders:         summary?.activeOrders         ?? 0,
    totalCustomers:       summary?.totalCustomers       ?? 0,
    avgOrderValue:        summary?.avgOrderValue        ?? 0,
    avgDeliveryTimeMins:  summary?.avgDeliveryTimeMins  ?? 0,
    customerRating:       summary?.customerRating       ?? 0,
    avgPrepTimeMins:      summary?.avgPrepTimeMins      ?? 0,
  }), [summary])

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Spinner />
      </div>
    )
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (error && !dash) {
    return (
      <div className="bg-white border border-[#c8e6c9] rounded-xl p-6 shadow-sm">
        <p className="text-sm font-semibold text-rose-600">Failed to load</p>
        <p className="text-sm mt-1" style={{ color: '#4a7c59' }}>{error}</p>
      </div>
    )
  }

  // ── No business yet ──────────────────────────────────────────────────────
  if (!hasBusiness) {
    return (
      <div className="space-y-8">
        <div className="bg-white border border-[#c8e6c9] rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#1a5c2a' }}>
            Create your restaurant
          </h2>
          <p className="mb-6" style={{ color: '#4a7c59' }}>
            Start setting up your restaurant to begin receiving orders.
          </p>
          <Link href="/partner-signup/add-business">
            <button
              className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: '#1a5c2a' }}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = '#14491f')}
              onMouseOut={e => (e.currentTarget.style.backgroundColor = '#1a5c2a')}
            >
              Create Restaurant
            </button>
          </Link>
        </div>
      </div>
    )
  }

  // ── Pending review ───────────────────────────────────────────────────────
  if (status === 'pending_review') {
    return (
      <div className="space-y-8">
        <div className="bg-white border border-[#c8e6c9] rounded-xl p-8 shadow-sm">
          <div
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold mb-4 border"
            style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', borderColor: '#a5d6a7' }}
          >
            Under Review
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#1a5c2a' }}>
            Business review pending
          </h2>
          <p className="mb-6" style={{ color: '#4a7c59' }}>
            Your business {business?.name ? <strong>"{business.name}"</strong> : ''} is currently
            under review. You will be notified once the review is complete.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border p-4" style={{ backgroundColor: '#f5faf6', borderColor: '#c8e6c9' }}>
              <p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: '#4a7c59' }}>Documents</p>
              <p className="text-lg font-bold" style={{ color: '#1a5c2a' }}>
                {business?.hasDocuments ? '✓ Submitted' : '✗ Missing'}
              </p>
            </div>
            <div className="rounded-xl border p-4" style={{ backgroundColor: '#f5faf6', borderColor: '#c8e6c9' }}>
              <p className="text-xs uppercase tracking-wider font-semibold mb-1" style={{ color: '#4a7c59' }}>Bank Details</p>
              <p className="text-lg font-bold" style={{ color: '#1a5c2a' }}>
                {business?.hasBankDetails ? '✓ Completed' : '✗ Incomplete'}
              </p>
            </div>
          </div>

          {business?.rejectionReason && (
            <div className="mt-6 bg-rose-50 border border-rose-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-rose-600">Rejection Reason</p>
              <p className="text-sm text-rose-700 mt-1">{business.rejectionReason}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Rejected ─────────────────────────────────────────────────────────────
  if (status === 'rejected') {
    return (
      <div className="space-y-8">
        <div className="bg-white border border-rose-200 rounded-xl p-8 shadow-sm">
          <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold mb-4 border bg-rose-50 text-rose-700 border-rose-200">
            Rejected
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#1a5c2a' }}>
            Business rejected
          </h2>
          <p className="mb-6" style={{ color: '#4a7c59' }}>
            {business?.rejectionReason || 'Please review the requirements and resubmit your application.'}
          </p>
          <Link href="/partner-signup/add-business">
            <button
              className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: '#1a5c2a' }}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = '#14491f')}
              onMouseOut={e => (e.currentTarget.style.backgroundColor = '#1a5c2a')}
            >
              Update Submission
            </button>
          </Link>
        </div>
      </div>
    )
  }

  // ── Approved / Active ────────────────────────────────────────────────────
  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#1a5c2a' }}>Dashboard</h1>
        <p className="mt-1 text-sm" style={{ color: '#4a7c59' }}>
          Welcome back! Here's your restaurant overview.
        </p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/*
          Inside your <StatCard> component, apply these classes:
            card bg:        bg-white
            card border:    border border-[#c8e6c9]
            card shadow:    shadow-sm rounded-xl
            title text:     text-[#4a7c59] text-sm
            value text:     text-[#1a5c2a] font-bold text-2xl
            icon wrapper:   bg-[#e8f5e9] rounded-lg p-2
            icon color:     text-[#2e7d32]
            trend up:       text-[#2e7d32]
            trend down:     text-rose-500
        */}
        <StatCard
          title="Total Orders"
          value={cards.totalOrders.toLocaleString()}
          change={0}
          icon={ShoppingCart}
          trend="up"
        />
        <StatCard
          title="Revenue Today"
          value={`₦${Math.round(cards.revenueToday).toLocaleString()}`}
          change={0}
          icon={DollarSign}
          trend="up"
        />
        <StatCard
          title="Active Orders"
          value={cards.activeOrders.toLocaleString()}
          change={0}
          icon={Clock}
          trend="up"
        />
        <StatCard
          title="Total Customers"
          value={cards.totalCustomers.toLocaleString()}
          change={0}
          icon={Users}
          trend="up"
        />
      </div>

      {/* ── Chart + Quick Stats ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Sales chart — spans 2 cols */}
        <div className="lg:col-span-2 bg-white border border-[#c8e6c9] rounded-xl p-6 shadow-sm">
          {/*
            Inside <SalesChart>:
              line/bar color:   #1a5c2a or #2e7d32
              grid lines:       #e8f5e9
              axis text:        #4a7c59
              tooltip bg:       #1a5c2a  text-white
          */}
          <SalesChart data={dash?.salesSeries || []} />
        </div>

        {/* Quick Stats card */}
        <div className="bg-white border border-[#c8e6c9] rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-5" style={{ color: '#1a5c2a' }}>Quick Stats</h3>

          <div className="space-y-0">
            {[
              { label: 'Avg. Order Value',  value: `₦${Math.round(cards.avgOrderValue).toLocaleString()}` },
              { label: 'Delivery Time',     value: cards.avgDeliveryTimeMins ? `${cards.avgDeliveryTimeMins} min` : '—' },
              { label: 'Customer Rating',   value: cards.customerRating ? `${cards.customerRating}/5.0` : '—' },
              { label: 'Prep Time',         value: cards.avgPrepTimeMins ? `${cards.avgPrepTimeMins} min` : '—' },
            ].map(({ label, value }, i, arr) => (
              <div
                key={label}
                className={`flex justify-between items-center py-3 ${i < arr.length - 1 ? 'border-b border-[#e8f5e9]' : ''}`}
              >
                <span className="text-sm" style={{ color: '#4a7c59' }}>{label}</span>
                <span className="font-semibold text-sm" style={{ color: '#1a5c2a' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Orders ── */}
      {/*
        Inside <RecentOrders>:
          table header bg:   bg-[#e8f5e9]
          header text:       text-[#1a5c2a] font-semibold text-xs uppercase tracking-wide
          row hover:         hover:bg-[#f5faf6]
          status badge:      same statusBadge() logic as businesses page
          link/action color: text-[#2e7d32] hover:underline
      */}
      <RecentOrders orders={dash?.recentOrders || []} />
    </div>
  )
}
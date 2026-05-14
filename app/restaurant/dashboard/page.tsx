'use client'

import { useEffect, useMemo, useState } from 'react'
import { ShoppingCart, DollarSign, Users, Clock, Star, Zap, Package } from 'lucide-react'
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
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [])

  const business = dash?.business ?? null
  const summary  = dash?.summary  ?? null
  const status   = business?.status
  const hasBusiness = !!business

  const cards = useMemo(() => ({
    totalOrders:         summary?.totalOrders         ?? 0,
    revenueToday:        summary?.revenueToday        ?? 0,
    activeOrders:        summary?.activeOrders        ?? 0,
    totalCustomers:      summary?.totalCustomers      ?? 0,
    avgOrderValue:       summary?.avgOrderValue       ?? 0,
    avgDeliveryTimeMins: summary?.avgDeliveryTimeMins ?? 0,
    customerRating:      summary?.customerRating      ?? 0,
    avgPrepTimeMins:     summary?.avgPrepTimeMins     ?? 0,
  }), [summary])

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]"><Spinner /></div>
  )

  if (error && !dash) return (
    <div style={{ background: '#fff', border: '1px solid #c8e6c9', borderRadius: 16, padding: 24 }}>
      <p style={{ color: '#e53935', fontWeight: 600, margin: 0 }}>Failed to load</p>
      <p style={{ color: '#4a7c59', marginTop: 4, fontSize: 14 }}>{error}</p>
    </div>
  )

  if (!hasBusiness) return (
    <div style={{ background: '#fff', border: '1px solid #c8e6c9', borderRadius: 16, padding: 32 }}>
      <h2 style={{ color: '#1a5c2a', fontWeight: 700, fontSize: 22, marginBottom: 8 }}>Create your restaurant</h2>
      <p style={{ color: '#4a7c59', marginBottom: 24 }}>Start setting up your restaurant to begin receiving orders.</p>
      <Link href="/partner-signup/add-business">
        <button style={{ background: '#1a5c2a', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontWeight: 600, cursor: 'pointer' }}>
          Create Restaurant
        </button>
      </Link>
    </div>
  )

  if (status === 'pending_review') return (
    <div style={{ background: '#fff', border: '1px solid #c8e6c9', borderRadius: 16, padding: 32 }}>
      <span style={{ background: '#e8f5e9', color: '#2e7d32', border: '1px solid #a5d6a7', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>Under Review</span>
      <h2 style={{ color: '#1a5c2a', fontWeight: 700, fontSize: 22, margin: '16px 0 8px' }}>Business review pending</h2>
      <p style={{ color: '#4a7c59', marginBottom: 24 }}>Your business is under review. You'll be notified once complete.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {[
          { label: 'Documents', value: business?.hasDocuments ? '✓ Submitted' : '✗ Missing' },
          { label: 'Bank Details', value: business?.hasBankDetails ? '✓ Completed' : '✗ Incomplete' },
        ].map(({ label, value }) => (
          <div key={label} style={{ background: '#f5faf6', border: '1px solid #c8e6c9', borderRadius: 12, padding: 16 }}>
            <p style={{ color: '#4a7c59', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>{label}</p>
            <p style={{ color: '#1a5c2a', fontWeight: 700, fontSize: 16, margin: 0 }}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  )

  if (status === 'rejected') return (
    <div style={{ background: '#fff', border: '1px solid #fecaca', borderRadius: 16, padding: 32 }}>
      <span style={{ background: '#fef2f2', color: '#e53935', border: '1px solid #fecaca', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>Rejected</span>
      <h2 style={{ color: '#1a5c2a', fontWeight: 700, fontSize: 22, margin: '16px 0 8px' }}>Business rejected</h2>
      <p style={{ color: '#4a7c59', marginBottom: 24 }}>{business?.rejectionReason || 'Please review requirements and resubmit.'}</p>
      <Link href="/partner-signup/add-business">
        <button style={{ background: '#1a5c2a', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px', fontWeight: 600, cursor: 'pointer' }}>Update Submission</button>
      </Link>
    </div>
  )

  // ── Approved / Active ────────────────────────────────────────────────────
  const quickStats = [
    { label: 'Avg. Order Value', value: `₦${Math.round(cards.avgOrderValue).toLocaleString()}`, icon: DollarSign },
    { label: 'Delivery Time',    value: cards.avgDeliveryTimeMins ? `${cards.avgDeliveryTimeMins} min` : '—', icon: Zap },
    { label: 'Customer Rating',  value: cards.customerRating ? `${cards.customerRating}/5.0` : '—', icon: Star },
    { label: 'Prep Time',        value: cards.avgPrepTimeMins ? `${cards.avgPrepTimeMins} min` : '—', icon: Clock },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 className="truncate max-w-[80vw] lg:max-w-2xl capitalize" style={{ color: '#1a5c2a', fontWeight: 800, fontSize: 28, margin: 0 }}>
            {business?.name ? `${business.name} Dashboard` : 'Dashboard'}
          </h1>
          <p style={{ color: '#4a7c59', fontSize: 13, margin: '4px 0 0' }}>
            Welcome back! Here's your restaurant overview.
          </p>
        </div>
        {/* Live indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#e8f5e9', border: '1px solid #c8e6c9', borderRadius: 20, padding: '6px 14px' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2e7d32', display: 'inline-block', boxShadow: '0 0 0 3px rgba(46,125,50,0.2)' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#2e7d32' }}>Live</span>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
        <StatCard title="Total Orders"    value={cards.totalOrders.toLocaleString()}                icon={ShoppingCart} change={0} trend="up" />
        <StatCard title="Revenue Today"   value={`₦${Math.round(cards.revenueToday).toLocaleString()}`} icon={DollarSign}   change={0} trend="up" />
        <StatCard title="Active Orders"   value={cards.activeOrders.toLocaleString()}               icon={Package}      change={0} trend="up" />
        <StatCard title="Total Customers" value={cards.totalCustomers.toLocaleString()}             icon={Users}        change={0} trend="up" />
      </div>

      {/* ── Chart + Quick Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>

        {/* Sales chart */}
        <div style={{ background: '#fff', border: '1px solid #c8e6c9', borderRadius: 16, padding: '24px 24px 16px', boxShadow: '0 1px 4px rgba(26,92,42,0.06)' }}>
          <SalesChart data={dash?.salesSeries || []} />
        </div>

        {/* Quick Stats */}
        <div style={{ background: '#fff', border: '1px solid #c8e6c9', borderRadius: 16, padding: 24, boxShadow: '0 1px 4px rgba(26,92,42,0.06)' }}>
          <h3 style={{ color: '#1a5c2a', fontWeight: 700, fontSize: 16, margin: '0 0 20px' }}>Quick Stats</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {quickStats.map(({ label, value, icon: Icon }, i) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 0',
                  borderBottom: i < quickStats.length - 1 ? '1px solid #e8f5e9' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ background: '#e8f5e9', borderRadius: 8, padding: 7, display: 'flex' }}>
                    <Icon size={14} color="#2e7d32" strokeWidth={2.5} />
                  </div>
                  <span style={{ fontSize: 13, color: '#4a7c59' }}>{label}</span>
                </div>
                <span style={{ fontWeight: 700, fontSize: 14, color: '#1a5c2a' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Orders ── */}
      <RecentOrders orders={dash?.recentOrders || []} />
    </div>
  )
}
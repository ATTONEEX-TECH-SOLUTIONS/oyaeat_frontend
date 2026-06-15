'use client'

import { useEffect, useMemo, useState } from 'react'
import { ShoppingCart, DollarSign, Users, Package } from 'lucide-react'
import StatCard from './components/stat-card'
import RecentOrders from './components/recent-orders'
import SalesChart from './components/sales-chart'
import DashboardReview from '@/app/restaurant/dashboard/components/dashboard/DashboardReview'
import QuickStatsPanel from '@/app/restaurant/dashboard/components/dashboard/QuickStatsPanel'
import Link from 'next/link'
import { Spinner } from '@/components/ui/spinner'
import { vendorApi } from '@/lib/api/vendor'

export default function DashboardPage() {
  const [businessProfile, setBusinessProfile] = useState<any | null>(null)
  const [dashData, setDashData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const initializeDashboard = async () => {
      try {
        setLoading(true)
        setError('')

        // 1. Fetch verification status directly from your secure source of truth
        const statusResponse = await vendorApi.getVendorStatus()
        if (cancelled) return

        // Extracts the business payload securely whether it arrives at root level or nested inside a .data layer
        const biz = statusResponse?.business || (statusResponse as any)?.data?.business || null
        setBusinessProfile(biz)

        // 2. Normalize and evaluate incoming state status string
        const status = biz?.status?.trim()?.toLowerCase() || 'draft'
        
        // 🚀 FIXED: Added 'suspended' here so it stops loading right away and skips dashboard fetch calls
        if (
          status === 'pending_review' || 
          status === 'under_review' || 
          status === 'pending' ||
          status === 'suspended'
        ) {
          setLoading(false)
          return
        }

        if (status === 'approved' || status === 'live') {
          const dashboardResponse = await vendorApi.getDashboard()
          if (cancelled) return
          setDashData(dashboardResponse?.dashboard || dashboardResponse)
        }

      } catch (err: any) {
        if (cancelled) return
        console.error("Initialization failed:", err)
        setError(err?.message || 'Failed to sync authorization profile routing.')
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    initializeDashboard()
    return () => { cancelled = true }
  }, [])

  // Universal lowercased string selector targeting the correctly stored state hook
  const currentStatusString = useMemo(() => {
    if (!businessProfile || !businessProfile.status) return 'draft'
    return String(businessProfile.status).trim().toLowerCase()
  }, [businessProfile])

  const cards = useMemo(() => {
    const summary = dashData?.summary
    return {
      totalOrders:         summary?.totalOrders         ?? 0,
      revenueToday:        summary?.revenueToday        ?? summary?.totalSales ?? 0,
      activeOrders:        summary?.activeOrders        ?? 0,
      totalCustomers:      summary?.totalCustomers      ?? 0,
      avgOrderValue:       summary?.avgOrderValue       ?? 0,
      avgDeliveryTimeMins: summary?.avgDeliveryTimeMins ?? 0,
      customerRating:      summary?.customerRating      ?? 0,
      avgPrepTimeMins:     summary?.avgPrepTimeMins     ?? 0,
    }
  }, [dashData])

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]"><Spinner /></div>
  )

  if (error && !businessProfile) return (
    <div style={{ background: '#fff', border: '1px solid #fde8c9', borderRadius: 16, padding: 24 }}>
      <p style={{ color: '#e53935', fontWeight: 600, margin: 0 }}>Initialization Error</p>
      <p style={{ color: '#b45309', marginTop: 4, fontSize: 14 }}>{error}</p>
    </div>
  )

  // ── GATE 1: PENDING REVIEW WORKFLOW RENDER SCREEN ──
  // 🚀 FIXED: Removed 'suspended' from here so it drops down to the custom suspended layout block cleanly
  if (
    currentStatusString === 'pending_review' || 
    currentStatusString === 'under_review' || 
    currentStatusString === 'pending'
  ) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <DashboardReview business={businessProfile} localSubmissionSync={false} />
      </div>
    )
  }

  // ── GATE 2: REJECTED STATE ONBOARDING BACKTRACK ROUTER ──
  if (currentStatusString === 'rejected') {
    return (
      <div className="p-8 max-w-2xl mx-auto my-12 bg-white border border-red-200 rounded-2xl shadow-sm">
        <span className="bg-red-50 text-red-600 border border-red-200 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
          Rejected
        </span>
        <h2 className="text-2xl font-black text-gray-900 mt-4 mb-2 tracking-tight">Business Verification Rejected</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          Your restaurant account onboarding was declined for the following reason:<br />
          <strong className="text-red-600 block mt-2 text-base font-bold bg-red-50/50 border border-red-100 p-3 rounded-xl">
            "{businessProfile?.rejectionReason || 'Please review compliance requirements and resubmit clean credential files.'}"
          </strong>
        </p>
        <Link href={`/partner-signup/verify-business?businessId=${businessProfile?.id}&businessName=${encodeURIComponent(businessProfile?.name || '')}`}>
          <button className="bg-[#2d5f4f] text-white font-black text-sm px-6 py-3 rounded-xl hover:bg-[#234a3d] transition shadow-sm">
            Update Submission
          </button>
        </Link>
      </div>
    )
  }

  // ── GATE 3: 🔒 ACCOUNT SUSPENDED ROUTING GUARD ──
  if (currentStatusString === 'suspended') {
    return (
      <div className="p-8 max-w-2xl mx-auto my-12 bg-white border border-amber-200 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2">
          <span className="bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
            Account Suspended
          </span>
        </div>
        
        <h2 className="text-2xl font-black text-gray-900 mt-4 mb-2 tracking-tight">
          Your Vendor Access Has Been Suspended
        </h2>
        
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          Compliance operations have temporarily deactivated sales operations for **{businessProfile?.name || 'this restaurant'}**. 
          Please review the official enforcement reason provided below:
          
          <strong className="text-amber-800 block mt-3 text-base font-medium bg-amber-50/60 border border-amber-100 p-4 rounded-xl whitespace-pre-wrap">
            "⚠️ {businessProfile?.rejectionReason || 'Your account is under temporary administrative review. Please contact support operations for compliance parameters.'}"
          </strong>
        </p>

        <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
          <a 
            href="mailto:support@oyaeat.com" 
            className="bg-amber-700 text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-amber-800 transition shadow-sm"
          >
            Contact Compliance Support
          </a>
          <button 
            onClick={() => window.location.reload()} 
            className="border border-gray-300 text-gray-700 font-bold text-sm px-5 py-3 rounded-xl hover:bg-gray-50 transition"
          >
            Check Status Updates
          </button>
        </div>
      </div>
    )
  }

  // ── VIEW 4: APPROVED / FULL LIVE PRODUCTION ANALYTICS VIEW ──
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header Row */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <h1 className="truncate max-w-[80vw] lg:max-w-2xl capitalize" style={{ color: '#1a5c2a', fontWeight: 800, fontSize: 28, margin: 0 }}>
            {businessProfile?.name ? `${businessProfile.name} Dashboard` : 'Dashboard'}
          </h1>
          <p style={{ color: '#4a7c59', fontSize: 13, margin: '4px 0 0' }}>
            Welcome back! Here's your restaurant overview.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#e8f5e9', border: '1px solid #c8e6c9', borderRadius: 20, padding: '6px 14px' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2e7d32', display: 'inline-block', boxShadow: '0 0 0 3px rgba(46,125,50,0.2)' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#2e7d32' }}>Live</span>
        </div>
      </div>

      {/* Analytics Grid Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
        <StatCard title="Total Orders"    value={cards.totalOrders.toLocaleString()}                icon={ShoppingCart} change={0} trend="up" />
        <StatCard title="Revenue Today"   value={`₦${Math.round(cards.revenueToday).toLocaleString()}`} icon={DollarSign}   change={0} trend="up" />
        <StatCard title="Active Orders"   value={cards.activeOrders.toLocaleString()}               icon={Package}    change={0} trend="up" />
        <StatCard title="Total Customers" value={cards.totalCustomers.toLocaleString()}             icon={Users}      change={0} trend="up" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 24 }}>
        <SalesChart data={dashData?.salesSeries || []} />
        <QuickStatsPanel cards={cards} />
      </div>

      <RecentOrders orders={dashData?.recentOrders || []} />
    </div>
  )
}

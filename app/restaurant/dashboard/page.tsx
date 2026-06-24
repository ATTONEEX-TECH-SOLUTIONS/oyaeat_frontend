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

// IMPORT SPLIT COMPONENT LAYERS RIGHT HERE
import { ShadowSuspensionBanner } from './components/dashboard/shadow-suspension-banner'
import { MainSuspensionBlock } from './components/dashboard/main-suspension-block'

export default function DashboardPage() {
  const [businessProfile, setBusinessProfile] = useState<any | null>(null)
  const [dashData, setDashData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // 🚀 EXTRACT AND EVALUATE SUSPENSION LAYERS FROM REJECTION TEXT PATTERNS
  const suspensionStrategy = useMemo(() => {
    if (!businessProfile || businessProfile.status?.trim()?.toLowerCase() !== 'suspended') {
      return { type: '', reason: '' }
    }
    
    const rawReason = String(businessProfile.rejectionReason || '').trim()
    
    if (/^MAIN:/i.test(rawReason)) {
      return {
        type: 'main',
        reason: rawReason.replace(/^MAIN:\s*/i, '')
      }
    }
    
    // Default fallback layer if no strict prefix patterns match
    return {
      type: 'shadow',
      reason: rawReason.replace(/^SHADOW:\s*/i, '')
    }
  }, [businessProfile])

  useEffect(() => {
    let cancelled = false

    const initializeDashboard = async () => {
      try {
        setLoading(true)
        setError('')

        const statusResponse = await vendorApi.getVendorStatus()
        if (cancelled) return

        const biz = statusResponse?.business || (statusResponse as any)?.data?.business || null
        setBusinessProfile(biz)

        const status = biz?.status?.trim()?.toLowerCase() || 'draft'
        
        // Dynamic detection wrapper matching zero-migration parsing schemas
        const rawReason = String(biz?.rejectionReason || '').trim().toUpperCase()
        const computedSuspensionType = status === 'suspended' && rawReason.startsWith('MAIN:') ? 'main' : 'shadow'
        
        if (
          status === 'pending_review' || 
          status === 'under_review' || 
          status === 'pending' ||
          (status === 'suspended' && computedSuspensionType === 'main')
        ) {
          setLoading(false)
          return
        }

        if (status === 'approved' || status === 'live' || (status === 'suspended' && computedSuspensionType === 'shadow')) {
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

  // ── GATE 1: PENDING REVIEW WORKFLOW ──
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

  // ── GATE 2: REJECTED STATE ONBOARDING ──
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
            "{businessProfile?.rejectionReason || 'Please review compliance requirements.'}"
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

  // ── GATE 3: 🔒 ACCOUNT SUSPENDED (MAIN HARD LOCKOUT LAYER) ──
  if (currentStatusString === 'suspended' && suspensionStrategy.type === 'main') {
    return (
      <MainSuspensionBlock 
        businessName={businessProfile?.name} 
        rejectionReason={suspensionStrategy.reason} 
        businessId={businessProfile?.id}
      />
    )
  }

  // ── VIEW 4: APPROVED / FULL LIVE PRODUCTION ANALYTICS ──
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      
      {/* 🚀 INJECTED SUB-LAYER: Renders cleanly using dynamic regex reason filters */}
      {currentStatusString === 'suspended' && suspensionStrategy.type === 'shadow' && (
        <ShadowSuspensionBanner rejectionReason={suspensionStrategy.reason} />
      )}

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
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 7, 
          background: suspensionStrategy.type === 'shadow' ? '#fff3e0' : '#e8f5e9', 
          border: suspensionStrategy.type === 'shadow' ? '1px solid #ffe0b2' : '1px solid #c8e6c9', 
          borderRadius: 20, 
          padding: '6px 14px' 
        }}>
          <span style={{ 
            width: 8, 
            height: 8, 
            borderRadius: '50%', 
            background: suspensionStrategy.type === 'shadow' ? '#ef6c00' : '#2e7d32', 
            display: 'inline-block', 
            boxShadow: suspensionStrategy.type === 'shadow' ? '0 0 0 3px rgba(239,108,0,0.2)' : '0 0 0 3px rgba(46,125,50,0.2)' 
          }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: suspensionStrategy.type === 'shadow' ? '#ef6c00' : '#2e7d32' }}>
            {suspensionStrategy.type === 'shadow' ? 'Hidden Storefront' : 'Live'}
          </span>
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

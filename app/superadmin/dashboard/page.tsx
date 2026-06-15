'use client'

import { useEffect, useMemo, useState } from 'react'
import { Sidebar } from '@/app/superadmin/dashboard/components/sidebar'
import { DashboardOverview } from '@/app/superadmin/dashboard/components/dashboard-overview'
import { PendingBusinessQueue } from '@/app/superadmin/dashboard/components/pending-business-queue'
import AdminLiveMap from './components/AdminLiveMap' // 📡 IMPORT LIVE MAP LOGISTICS VIEW CANVAS

import {
  fetchBusinessStats,
  fetchBusinesses,
  fetchDashboardMetrics,
  type Business,
  type BusinessStats,
  type DashboardMetrics,
} from '@/lib/api/superadmin'

export default function DashboardPage() {
  const [stats, setStats] = useState<BusinessStats | null>(null)
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics | null>(null)
  const [pendingBusinesses, setPendingBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const loadDashboard = async () => {
      try {
        setLoading(true)
        setError('')

        const [statsRes, metricsRes, pendingRes] = await Promise.all([
          fetchBusinessStats(),
          fetchDashboardMetrics(),
          fetchBusinesses({
            status: 'pending_review',
            page: 1,
            limit: 5,
          }),
        ])

        if (cancelled) return

        setStats(statsRes)
        setDashboardMetrics(metricsRes)
        setPendingBusinesses(pendingRes.businesses || [])
      } catch (e: any) {
        if (cancelled) return
        setError(e?.message || 'Failed to load dashboard')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadDashboard()

    return () => {
      cancelled = true
    }
  }, [])

  const metrics: DashboardMetrics = useMemo(() => {
    // prefer backend metrics (includes orders + revenue)
    if (dashboardMetrics) return dashboardMetrics

    // fallback if metrics endpoint fails (keeps UI stable)
    return {
      totalRestaurants: stats?.total ?? 0,
      activeRestaurants: stats?.approved ?? 0,
      pendingApprovals: stats?.pending ?? 0,

      totalRiders: 0,
      activeRiders: 0,
      totalOrders: 0,
      todayOrders: 0,
      totalRevenue: 0,
      avgOrderValue: 0,
    }
  }, [stats, dashboardMetrics])

  const reloadData = async () => {
    const [statsRes, metricsRes, pendingRes] = await Promise.all([
      fetchBusinessStats(),
      fetchDashboardMetrics(),
      fetchBusinesses({
        status: 'pending_review',
        page: 1,
        limit: 5,
      }),
    ])

    setStats(statsRes)
    setDashboardMetrics(metricsRes)
    setPendingBusinesses(pendingRes.businesses || [])
  }

  return (
    <div className="flex min-h-screen bg-card">
      <Sidebar />

      <main className="flex-1 overflow-auto bg-[#f5faf6]">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1a5c2a]">Dashboard</h1>
            <p className="text-primary mt-2">
              Welcome back! Here’s your business overview.
            </p>
          </div>

          {loading && (
            <div className="bg-card rounded-lg border border-[#c8e6c9] p-6">
              <p className="text-primary">Loading dashboard...</p>
            </div>
          )}

          {error && !loading && (
            <div className="bg-card rounded-lg border border-red-200 p-6">
              <p className="text-red-700 font-medium">Failed to load</p>
              <p className="text-red-600 mt-1 text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-8">
              {/* Top Summary Metrics Cards */}
              <DashboardOverview metrics={metrics} />

              {/*  LIVE MAP FLEET POSITION TRACKER OVERLAY ROW */}
              <div className="w-full">
                <AdminLiveMap />
              </div>

              {/* Main Structural Columns split grid layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <PendingBusinessQueue
                    businesses={pendingBusinesses}
                    onChanged={reloadData}
                  />
                </div>

                <div className="space-y-4">
                  <div className="bg-card rounded-lg border border-[#c8e6c9] p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-[#1a5c2a] mb-4">
                      Quick Stats
                    </h3>

                    <div className="space-y-3">
                      {[
                        { label: 'Total Businesses', value: stats?.total ?? 0 },
                        { label: 'Approved', value: stats?.approved ?? 0 },
                        { label: 'Rejected', value: stats?.rejected ?? 0 },
                        { label: 'Suspended', value: stats?.suspended ?? 0 },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between text-sm">
                          <span className="text-primary">{label}</span>
                          <span className="font-semibold text-[#1a5c2a]">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#e8f5e9] rounded-lg border border-[#a5d6a7] p-6">
                    <h3 className="text-lg font-semibold text-[#1a5c2a] mb-2">
                      Action Required
                    </h3>

                    <ul className="space-y-2 text-sm">
                      <li className="text-[#2e7d32]">
                        • {stats?.pending ?? 0} business(es) awaiting approval
                      </li>
                      <li className="text-[#2e7d32]">
                        • {stats?.rejected ?? 0} rejected business(es) to review
                      </li>
                      <li className="text-[#2e7d32]">
                        • {stats?.suspended ?? 0} suspended business(es) to monitor
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

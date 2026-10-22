"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DashboardOverview } from "@/app/superadmin/dashboard/components/dashboard-overview";
import { PendingBusinessQueue } from "@/app/superadmin/dashboard/components/pending-business-queue";
import AdminLiveMap from "./components/AdminLiveMap";
import { ErrorState, PageHeader } from "@/components/shared/states";
import { Panel } from "@/components/superadmin/ui";
import { Skeleton } from "@/components/ui/skeleton";

import {
  fetchBusinessStats,
  fetchBusinesses,
  fetchDashboardMetrics,
  type Business,
  type BusinessStats,
  type DashboardMetrics,
} from "@/lib/api/superadmin";

export default function DashboardPage() {
  const [stats, setStats] = useState<BusinessStats | null>(null);
  const [dashboardMetrics, setDashboardMetrics] =
    useState<DashboardMetrics | null>(null);
  const [pendingBusinesses, setPendingBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, metricsRes, pendingRes] = await Promise.all([
        fetchBusinessStats(),
        fetchDashboardMetrics(),
        fetchBusinesses({ status: "pending_review", page: 1, limit: 5 }),
      ]);
      setStats(statsRes);
      setDashboardMetrics(metricsRes);
      setPendingBusinesses(pendingRes.businesses || []);
    } catch (e: any) {
      setError(e?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const metrics: DashboardMetrics = useMemo(() => {
    // prefer backend metrics (includes orders + revenue)
    if (dashboardMetrics) return dashboardMetrics;

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
    };
  }, [stats, dashboardMetrics]);

  return (
    <div className="space-y-6">
      <PageHeader title="Overview" subtitle="Platform health at a glance." />

      {loading ? (
        <div className="space-y-4" aria-busy="true">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl bg-muted" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-2xl bg-muted" />
        </div>
      ) : error ? (
        <ErrorState title="We couldn't load the dashboard" message={error} onRetry={load} />
      ) : (
        <>
          <DashboardOverview metrics={metrics} />

          <div className="grid gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <PendingBusinessQueue businesses={pendingBusinesses} onChanged={load} />
            </div>
            <Panel title="Businesses">
              <dl className="space-y-3 text-sm">
                {[
                  { label: "Total", value: stats?.total ?? 0 },
                  { label: "Approved", value: stats?.approved ?? 0 },
                  { label: "Pending", value: stats?.pending ?? 0 },
                  { label: "Rejected", value: stats?.rejected ?? 0 },
                  { label: "Suspended", value: stats?.suspended ?? 0 },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="font-extrabold">{value}</dd>
                  </div>
                ))}
              </dl>
            </Panel>
          </div>

          <AdminLiveMap />
        </>
      )}
    </div>
  );
}

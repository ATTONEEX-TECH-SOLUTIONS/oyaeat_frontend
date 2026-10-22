"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Banknote, ChefHat, Clock, Package, Star, Users, Zap } from "lucide-react";
import RecentOrders from "./components/recent-orders";
import SalesChart from "./components/sales-chart";
import DashboardReview from "@/app/restaurant/dashboard/components/dashboard/DashboardReview";
import { ShadowSuspensionBanner } from "./components/dashboard/shadow-suspension-banner";
import { MainSuspensionBlock } from "./components/dashboard/main-suspension-block";
import { ErrorState, PageHeader } from "@/components/shared/states";
import { AdminStat, Badge, Panel } from "@/components/superadmin/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { vendorApi } from "@/lib/api/vendor";

const PENDING = ["pending_review", "under_review", "pending"];

export default function DashboardPage() {
  const [business, setBusiness] = useState<any | null>(null);
  const [dash, setDash] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const status = String(business?.status || "draft").trim().toLowerCase();

  // Suspension is encoded in the rejection reason: "MAIN:" = hard lockout, otherwise shadow (hidden storefront).
  const suspension = useMemo(() => {
    if (status !== "suspended") return { type: "", reason: "" };
    const raw = String(business?.rejectionReason || "").trim();
    return /^MAIN:/i.test(raw)
      ? { type: "main", reason: raw.replace(/^MAIN:\s*/i, "") }
      : { type: "shadow", reason: raw.replace(/^SHADOW:\s*/i, "") };
  }, [business, status]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res: any = await vendorApi.getVendorStatus();
      const biz = res?.business || res?.data?.business || null;
      setBusiness(biz);

      const st = String(biz?.status || "draft").trim().toLowerCase();
      const raw = String(biz?.rejectionReason || "").trim().toUpperCase();
      const mainLock = st === "suspended" && raw.startsWith("MAIN:");

      if (st === "approved" || st === "live" || (st === "suspended" && !mainLock)) {
        const d: any = await vendorApi.getDashboard();
        setDash(d?.dashboard || d);
      }
    } catch (e: any) {
      setError(e?.message || "We couldn't load your dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const s = dash?.summary;
  const money = (n: number) => `₦${Math.round(n || 0).toLocaleString()}`;

  if (loading)
    return (
      <div className="space-y-5" aria-busy="true">
        <Skeleton className="h-10 w-64 bg-muted" />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl bg-muted" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-2xl bg-muted" />
      </div>
    );

  if (error && !business) return <ErrorState title="We couldn't load your dashboard" message={error} onRetry={load} />;

  if (PENDING.includes(status)) return <div className="mx-auto max-w-4xl"><DashboardReview business={business} localSubmissionSync={false} /></div>;

  if (status === "rejected")
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-destructive/20 bg-card p-6 shadow-card sm:p-8">
        <Badge tone="danger">Rejected</Badge>
        <h2 className="font-display mt-4 text-2xl font-extrabold">Verification was rejected</h2>
        <p className="mt-2 text-sm text-muted-foreground">Your restaurant couldn&apos;t be approved for this reason:</p>
        <p className="mt-3 rounded-2xl bg-destructive/10 p-4 text-sm font-semibold text-destructive">
          {business?.rejectionReason || "Please review the compliance requirements."}
        </p>
        <Link
          href={`/partner-signup/verify-business?businessId=${business?.id}&businessName=${encodeURIComponent(business?.name || "")}`}
          className="mt-6 inline-flex h-12 items-center rounded-full bg-cta px-6 text-sm font-extrabold text-cta-foreground transition hover:bg-mango-300"
        >
          Update submission
        </Link>
      </div>
    );

  if (status === "suspended" && suspension.type === "main")
    return <MainSuspensionBlock businessName={business?.name} rejectionReason={suspension.reason} businessId={business?.id} />;

  const hidden = suspension.type === "shadow";
  const active = s?.activeOrders ?? 0;

  return (
    <div className="space-y-5 sm:space-y-6">
      {hidden && <ShadowSuspensionBanner rejectionReason={suspension.reason} />}

      <PageHeader
        title={business?.name || "Dashboard"}
        subtitle="Today at a glance."
        action={<Badge tone={hidden ? "mango" : "success"}>{hidden ? "Hidden storefront" : "Live"}</Badge>}
      />

      {active > 0 && (
        <Link
          href="/restaurant/dashboard/orders"
          className="group flex items-center gap-4 rounded-3xl border border-mango-300 bg-mango-50 p-4 shadow-card transition hover:shadow-pop sm:p-5"
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-cta text-cta-foreground"><ChefHat className="h-6 w-6" /></span>
          <span className="min-w-0 flex-1">
            <span className="block font-display text-lg font-extrabold">{active} active order{active === 1 ? "" : "s"}</span>
            <span className="block text-sm text-mango-800">Open the kitchen view to accept and prepare them.</span>
          </span>
          <ArrowRight className="h-5 w-5 text-primary transition group-hover:translate-x-1" />
        </Link>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <AdminStat label="Revenue today" value={money(s?.revenueToday ?? 0)} icon={Banknote} tone="success" sub={`${money(s?.totalSales ?? 0)} all time`} />
        <AdminStat label="Active orders" value={active} icon={Package} tone="mango" highlight={active > 0} />
        <AdminStat label="Total orders" value={(s?.totalOrders ?? 0).toLocaleString()} icon={ChefHat} />
        <AdminStat label="Customers" value={(s?.totalCustomers ?? 0).toLocaleString()} icon={Users} />
      </div>

      <div className="grid gap-5 xl:grid-cols-3 sm:gap-6">
        <Panel title="Revenue" subtitle="Last 7 days" className="xl:col-span-2">
          <SalesChart data={dash?.salesSeries || []} />
        </Panel>
        <Panel title="Performance">
          <dl className="space-y-4 text-sm">
            {[
              { icon: Banknote, label: "Average order", value: money(s?.avgOrderValue ?? 0) },
              { icon: Zap, label: "Delivery time", value: s?.avgDeliveryTimeMins ? `${s.avgDeliveryTimeMins} min` : "—" },
              { icon: Clock, label: "Prep time", value: s?.avgPrepTimeMins ? `${s.avgPrepTimeMins} min` : "—" },
              { icon: Star, label: "Customer rating", value: s?.customerRating ? `${Number(s.customerRating).toFixed(1)} / 5` : "No ratings yet" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-100 text-violet-700"><Icon className="h-4 w-4" /></span>
                <dt className="flex-1 text-muted-foreground">{label}</dt>
                <dd className="font-extrabold">{value}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      </div>

      <Panel
        title="Recent orders"
        action={<Link href="/restaurant/dashboard/orders" className="text-sm font-bold text-primary hover:underline">View all</Link>}
      >
        <RecentOrders orders={dash?.recentOrders || []} />
      </Panel>
    </div>
  );
}

import { Banknote, Bike, ClipboardCheck, Receipt, ShoppingBag, Store } from "lucide-react";
import type { DashboardMetrics } from "@/lib/api/superadmin";
import { AdminStat } from "@/components/superadmin/ui";

const money = (n: number) =>
  n >= 1_000_000 ? `₦${(n / 1_000_000).toFixed(1)}M` : `₦${Math.round(n || 0).toLocaleString()}`;

export function DashboardOverview({ metrics }: { metrics: DashboardMetrics }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
      <AdminStat label="Orders today" value={metrics.todayOrders} sub={`${metrics.totalOrders.toLocaleString()} all time`} icon={ShoppingBag} />
      <AdminStat label="Revenue" value={money(metrics.totalRevenue)} sub={`Avg order ${money(metrics.avgOrderValue)}`} icon={Banknote} tone="success" />
      <AdminStat label="Awaiting approval" value={metrics.pendingApprovals} sub={metrics.pendingApprovals ? "Review now" : "All clear"} icon={ClipboardCheck} tone="mango" highlight={metrics.pendingApprovals > 0} />
      <AdminStat label="Active restaurants" value={metrics.activeRestaurants} sub={`of ${metrics.totalRestaurants} registered`} icon={Store} />
      <AdminStat label="Riders online" value={metrics.activeRiders} sub={`of ${metrics.totalRiders} riders`} icon={Bike} />
      <AdminStat label="Avg order value" value={money(metrics.avgOrderValue)} icon={Receipt} />
    </div>
  );
}

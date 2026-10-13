"use client";

import { useState } from "react";
import { CheckCircle2, MapPin, Package, Store } from "lucide-react";
import { useRider } from "@/components/rider/RiderProvider";
import { EmptyState, ErrorState, PageHeader } from "@/components/shared/states";
import { Badge } from "@/components/superadmin/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function RiderTripsPage() {
  const { data, loading, error, refresh } = useRider();
  const [tab, setTab] = useState<"active" | "done">("active");

  if (loading) return <div className="space-y-3" aria-busy="true">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-24 rounded-2xl bg-muted" />)}</div>;
  if (error && !data) return <ErrorState title="We couldn't load your trips" message={error} onRetry={refresh} />;

  const active = data?.activeDelivery;
  const done: any[] = data?.recentDeliveries || [];
  const list = tab === "active" ? (active ? [active] : []) : done;

  return (
    <div>
      <PageHeader title="Trips" subtitle="Your current trip and recent deliveries." />

      <div role="tablist" className="mb-5 inline-flex rounded-full bg-violet-50 p-1">
        {([["active", "Current", active ? 1 : 0], ["done", "Recent", done.length]] as const).map(([key, label, n]) => (
          <button key={key} role="tab" aria-selected={tab === key} onClick={() => setTab(key)}
            className={cn("flex h-10 items-center gap-2 rounded-full px-5 text-sm font-bold transition", tab === key ? "bg-card text-primary shadow-sm" : "text-muted-foreground")}>
            {label}
            {n > 0 && <span className={cn("grid h-5 min-w-5 place-items-center rounded-full px-1 text-[11px]", key === "active" ? "bg-cta text-cta-foreground" : "bg-violet-100 text-violet-800")}>{n}</span>}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState icon={Package} title={tab === "active" ? "No current trip" : "No deliveries yet"} body={tab === "active" ? "Go online from Home to receive your next order." : "Completed deliveries will appear here."} />
      ) : (
        <ul className="space-y-3">
          {list.map((t: any, i: number) => (
            <li key={t.id ?? i} className="rounded-3xl border border-border bg-card p-4 shadow-card sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl", tab === "active" ? "bg-mango-100 text-mango-800" : "bg-success-soft text-success")}>
                    {tab === "active" ? <Store className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-bold">{t.restaurant}</p>
                    <p className="text-sm text-muted-foreground">{tab === "active" ? String(t.status || "").replace(/_/g, " ") : t.time}</p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-extrabold">{t.payout}</p>
                  <Badge tone={tab === "active" ? "mango" : "success"}>{tab === "active" ? "In progress" : "Paid"}</Badge>
                </div>
              </div>
              {(t.dropoff || t.address) && (
                <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{t.dropoff || t.address}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

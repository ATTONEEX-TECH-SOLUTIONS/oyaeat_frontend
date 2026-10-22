"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, Loader2, MapPin, Navigation, Radar, ShieldAlert, Store, Wallet } from "lucide-react";
import { useRider } from "@/components/rider/RiderProvider";
import { EmptyState, ErrorState } from "@/components/shared/states";
import { AdminStat, Badge, Panel } from "@/components/superadmin/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const RESTRICTED: Record<string, string> = {
  pending: "Your application is under review. We'll verify your documents and vehicle details shortly.",
  verified: "Your details are verified. Your account is waiting for activation.",
  inactive: "Your account has been deactivated. Please contact support.",
};

export default function RiderHome() {
  const router = useRouter();
  const { data, loading, error, restricted, status, isOnline, busy, toggleShift, accept, complete, refresh } = useRider();
  const [confirmId, setConfirmId] = useState<string | number | null>(null);

  if (loading)
    return (
      <div className="space-y-4" aria-busy="true">
        <Skeleton className="h-44 rounded-3xl bg-muted" />
        <div className="grid grid-cols-3 gap-3"><Skeleton className="h-28 rounded-2xl bg-muted" /><Skeleton className="h-28 rounded-2xl bg-muted" /><Skeleton className="h-28 rounded-2xl bg-muted" /></div>
      </div>
    );

  if (error && !data) return <ErrorState title="We couldn't load your dashboard" message={error} onRetry={refresh} />;

  if (restricted)
    return (
      <div className="mx-auto max-w-md pt-6 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-mango-100 text-mango-700"><ShieldAlert className="h-8 w-8" /></span>
        <h1 className="font-display mt-5 text-2xl font-extrabold">Account not active yet</h1>
        <p className="mt-2 text-muted-foreground">{RESTRICTED[status] || "Your account can't take orders right now."}</p>
        <button
          onClick={() => {
            localStorage.removeItem("riderToken");
            router.replace("/rider/login");
          }}
          className="mt-6 h-12 rounded-full border border-border px-6 text-sm font-bold transition hover:bg-violet-50"
        >
          Back to sign in
        </button>
      </div>
    );

  const active = isOnline ? data?.activeDelivery : null;
  const onTrip = active?.status === "out_for_delivery";
  const stats = data?.stats;
  const first = data?.profile?.firstName;
  const maps = (q: string) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* 1. The one thing to do right now */}
      {active ? (
        <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
          <div className="flex items-start justify-between gap-3 bg-primary p-5 text-primary-foreground">
            <div>
              <Badge tone={onTrip ? "mango" : "violet"}>{onTrip ? "Trip in progress" : "New request"}</Badge>
              <p className="font-display mt-2 text-4xl font-extrabold tracking-tight">{active.payout}</p>
              <p className="text-sm text-violet-200">Estimated earnings</p>
            </div>
            {active.distance && (
              <div className="text-right">
                <p className="font-display text-xl font-extrabold">{active.distance}</p>
                <p className="text-sm text-violet-200">Distance</p>
              </div>
            )}
          </div>

          <ol className="space-y-5 p-5">
            <li className="flex gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-violet-100 text-violet-800"><Store className="h-5 w-5" /></span>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pickup</p>
                <p className="font-bold">{active.restaurant}</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mango-100 text-mango-800"><MapPin className="h-5 w-5" /></span>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Drop-off</p>
                <p className="font-bold">{active.customer}</p>
                <p className="text-sm text-muted-foreground">{active.dropoff}</p>
              </div>
            </li>
          </ol>

          <div className="space-y-3 border-t border-border p-5">
            {active.dropoff && (
              <a href={maps(active.dropoff)} target="_blank" rel="noreferrer" className="flex h-12 items-center justify-center gap-2 rounded-full border border-border text-sm font-bold text-primary transition hover:bg-violet-50">
                <Navigation className="h-4 w-4" /> Navigate to drop-off
              </a>
            )}
            {onTrip ? (
              <button onClick={() => setConfirmId(active.id)} disabled={busy} className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-cta text-base font-extrabold text-cta-foreground shadow-sm transition hover:bg-mango-300 active:scale-[0.98] disabled:opacity-60">
                <CheckCircle2 className="h-5 w-5" /> Confirm delivery
              </button>
            ) : (
              <button onClick={() => accept(active.id)} disabled={busy} className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-cta text-base font-extrabold text-cta-foreground shadow-sm transition hover:bg-mango-300 active:scale-[0.98] disabled:opacity-60">
                {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Navigation className="h-5 w-5" /> Accept order</>}
              </button>
            )}
          </div>
        </section>
      ) : isOnline ? (
        <section className="rounded-3xl border border-border bg-card p-8 text-center shadow-card">
          <span className="relative mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-success-soft text-success">
            <span className="absolute inset-0 animate-ping rounded-2xl bg-success/20" aria-hidden />
            <Radar className="relative h-8 w-8" />
          </span>
          <h1 className="font-display mt-5 text-2xl font-extrabold">Looking for orders</h1>
          <p className="mt-1 text-muted-foreground">Stay on this app. New orders near you will pop up here, even on other screens.</p>
        </section>
      ) : (
        <section className="lp-doodles rounded-3xl p-6 text-white shadow-card sm:p-8">
          <h1 className="font-display text-3xl font-extrabold">{first ? `Hi ${first}, ready to ride?` : "Ready to ride?"}</h1>
          <p className="mt-1 text-violet-100">Go online to start receiving delivery requests.</p>
          <button onClick={toggleShift} disabled={busy} className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-cta text-lg font-extrabold text-cta-foreground shadow-sm transition hover:bg-mango-300 active:scale-[0.98] disabled:opacity-60 sm:w-auto sm:px-10">
            {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : "Go online"}
          </button>
        </section>
      )}

      {/* 2. Today */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <AdminStat label="Earned today" value={stats?.todayEarnings || "₦0"} icon={Wallet} tone="success" />
        <AdminStat label="Trips" value={stats?.completedToday || "0"} icon={CheckCircle2} />
        <AdminStat label="Online" value={stats?.hoursOnline || "0h 0m"} icon={Clock} />
      </div>

      {/* 3. Recent */}
      <Panel title="Recent deliveries">
        {data?.recentDeliveries?.length ? (
          <ul className="divide-y divide-border">
            {data.recentDeliveries.map((d: any, i: number) => (
              <li key={i} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-success-soft text-success"><CheckCircle2 className="h-5 w-5" /></span>
                <span className="min-w-0 flex-1"><span className="block truncate font-bold">{d.restaurant}</span><span className="block text-sm text-muted-foreground">{d.time}</span></span>
                <span className="font-extrabold">{d.payout}</span>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={CheckCircle2} title="No deliveries yet today" body="Completed deliveries show up here with your earnings." className="border-0 py-8" />
        )}
      </Panel>

      <AlertDialog open={confirmId !== null} onOpenChange={(o) => !o && setConfirmId(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm delivery?</AlertDialogTitle>
            <AlertDialogDescription>Only confirm after you&apos;ve handed the order to the customer. This credits your earnings and can&apos;t be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Not yet</AlertDialogCancel>
            <AlertDialogAction className="rounded-full bg-primary" onClick={() => { if (confirmId !== null) complete(confirmId); setConfirmId(null); }}>Yes, delivered</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

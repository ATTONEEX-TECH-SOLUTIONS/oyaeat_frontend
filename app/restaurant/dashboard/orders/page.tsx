"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Bike, ChefHat, Loader2, MapPin, Phone, RefreshCw, StickyNote } from "lucide-react";
import { vendorApi, type Order, type OrderStatus } from "@/lib/api/vendor";
import { EmptyState, ErrorState, PageHeader, TableSkeleton } from "@/components/shared/states";
import { Badge, type Tone } from "@/components/superadmin/ui";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const STATUS: Record<OrderStatus, { label: string; tone: Tone }> = {
  pending: { label: "New", tone: "mango" },
  preparing: { label: "Preparing", tone: "violet" },
  ready: { label: "Ready", tone: "success" },
  out_for_delivery: { label: "On the way", tone: "violet" },
  delivered: { label: "Delivered", tone: "success" },
  cancelled: { label: "Cancelled", tone: "danger" },
};

const NEXT: Partial<Record<OrderStatus, { to: OrderStatus; label: string }>> = {
  pending: { to: "preparing", label: "Accept & start preparing" },
  preparing: { to: "ready", label: "Mark ready for pickup" },
};

const TABS = [
  { key: "active", label: "Active", match: (s: OrderStatus) => ["pending", "preparing", "ready", "out_for_delivery"].includes(s) },
  { key: "pending", label: "New", match: (s: OrderStatus) => s === "pending" },
  { key: "preparing", label: "Preparing", match: (s: OrderStatus) => s === "preparing" },
  { key: "ready", label: "Ready", match: (s: OrderStatus) => s === "ready" || s === "out_for_delivery" },
  { key: "done", label: "History", match: (s: OrderStatus) => s === "delivered" || s === "cancelled" },
] as const;

const naira = (n: number) => `₦${Math.round(Number(n) || 0).toLocaleString("en-NG")}`;
const ago = (iso: string) => {
  const m = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  return m < 1 ? "just now" : m < 60 ? `${m} min ago` : `${Math.floor(m / 60)}h ${m % 60}m ago`;
};

export default function RestaurantOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("active");
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<Set<number>>(new Set());
  const [cancelId, setCancelId] = useState<number | null>(null);
  const [auto, setAuto] = useState(false);
  const [, tick] = useState(0);

  const ordersRef = useRef<Order[]>([]);
  const autoRef = useRef(false);
  const inFlight = useRef<Set<string>>(new Set());

  useEffect(() => {
    try {
      // Off unless the vendor has explicitly switched it on.
      setAuto(localStorage.getItem("vendor_auto_advance") === "1");
    } catch {}
  }, []);
  useEffect(() => {
    autoRef.current = auto;
    try {
      localStorage.setItem("vendor_auto_advance", auto ? "1" : "0");
    } catch {}
  }, [auto]);

  const load = useCallback(async (silent = false) => {
    if (!silent) setSyncing(true);
    try {
      const res = await vendorApi.getOrders();
      const list = res?.orders || [];
      ordersRef.current = list;
      setOrders(list);
      setError("");
    } catch (e: any) {
      if (!silent) setError(e?.message || "We couldn't load your orders.");
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, []);

  const advance = useCallback(
    async (id: number, to: OrderStatus) => {
      const key = `${id}:${to}`;
      if (inFlight.current.has(key)) return;
      inFlight.current.add(key);
      setBusy((b) => new Set(b).add(id));
      try {
        await vendorApi.updateOrderStatus(id, to);
        if (to === "ready") {
          const token = localStorage.getItem("authToken") || localStorage.getItem("vendorToken");
          const r = await fetch(`${API}/orders/${id}/dispatch`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token || ""}`, "Content-Type": "application/json" },
          });
          if (r.ok) {
            const d = await r.json().catch(() => ({}));
            toast.success(`Order #${id} is ready. Alerted ${d.notifiedRidersCount || 0} nearby riders.`);
          }
        }
        await load(true);
      } catch {
        toast.error(`Couldn't update order #${id}. Try again.`);
        inFlight.current.delete(key);
      } finally {
        setBusy((b) => {
          const n = new Set(b);
          n.delete(id);
          return n;
        });
      }
    },
    [load],
  );

  // Poll for fresh orders; re-render so "x min ago" stays current.
  useEffect(() => {
    load(false);
    const sync = setInterval(() => load(true), 5000);
    const clock = setInterval(() => tick((n) => n + 1), 30000);
    return () => {
      clearInterval(sync);
      clearInterval(clock);
    };
  }, [load]);

  // Optional auto-advance (new -> preparing after 1 min, preparing -> ready after 5 min).
  // Runs outside React state and de-duplicates so an order is never dispatched twice.
  useEffect(() => {
    const t = setInterval(() => {
      if (!autoRef.current) return;
      const now = Date.now();
      ordersRef.current.forEach((o) => {
        const mins = (now - new Date(o.createdAt).getTime()) / 60000;
        if (o.status === "pending" && mins >= 1) advance(o.id, "preparing");
        else if (o.status === "preparing" && mins >= 5) advance(o.id, "ready");
      });
    }, 15000);
    return () => clearInterval(t);
  }, [advance]);

  const counts = useMemo(
    () => Object.fromEntries(TABS.map((t) => [t.key, orders.filter((o) => t.match(o.status)).length])) as Record<string, number>,
    [orders],
  );
  const visible = useMemo(() => {
    const t = TABS.find((x) => x.key === tab)!;
    const rank: Record<string, number> = { pending: 0, preparing: 1, ready: 2, out_for_delivery: 3 };
    return orders
      .filter((o) => t.match(o.status))
      .sort((a, b) =>
        tab === "done"
          ? +new Date(b.createdAt) - +new Date(a.createdAt)
          : (rank[a.status] ?? 9) - (rank[b.status] ?? 9) || +new Date(a.createdAt) - +new Date(b.createdAt),
      );
  }, [orders, tab]);

  return (
    <div>
      <PageHeader
        title="Orders"
        subtitle="Accept new orders and move them through the kitchen."
        action={
          <button
            onClick={() => load(false)}
            disabled={syncing}
            aria-label="Refresh orders"
            className="flex h-11 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-bold text-primary transition hover:bg-violet-50 disabled:opacity-60"
          >
            <RefreshCw className={cn("h-4 w-4", syncing && "animate-spin")} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        }
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="tablist" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {TABS.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-bold transition",
                tab === t.key ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-violet-50",
              )}
            >
              {t.label}
              {counts[t.key] > 0 && (
                <span className={cn("grid h-5 min-w-5 place-items-center rounded-full px-1 text-[11px] font-extrabold", t.key === "pending" ? "bg-cta text-cta-foreground" : tab === t.key ? "bg-white/20" : "bg-violet-100 text-violet-800")}>
                  {counts[t.key]}
                </span>
              )}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2 text-sm">
          <Switch checked={auto} onCheckedChange={setAuto} aria-label="Auto-advance orders" />
          <span className="font-semibold" title="Moves new orders to Preparing after 1 min and Ready after 5 min">
            Auto-advance
          </span>
        </label>
      </div>

      {loading ? (
        <TableSkeleton rows={4} />
      ) : error && orders.length === 0 ? (
        <ErrorState title="We couldn't load orders" message={error} onRetry={() => load(false)} />
      ) : visible.length === 0 ? (
        <EmptyState
          icon={ChefHat}
          title={tab === "pending" ? "No new orders" : "Nothing here"}
          body={tab === "active" || tab === "pending" ? "New orders appear here with a sound alert. Keep this tab open while you're open for business." : "Orders will show here as they move through the kitchen."}
        />
      ) : (
        <ul className="grid gap-4 xl:grid-cols-2">
          {visible.map((o) => {
            const cfg = STATUS[o.status] ?? STATUS.pending;
            const next = NEXT[o.status];
            const isBusy = busy.has(o.id);
            const waitMins = (Date.now() - new Date(o.createdAt).getTime()) / 60000;
            const urgent = o.status === "pending" && waitMins >= 3;
            return (
              <li key={o.id} className={cn("flex flex-col rounded-3xl border bg-card p-4 shadow-card sm:p-5", urgent ? "border-mango-400 ring-2 ring-mango-200" : "border-border")}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-display text-lg font-extrabold">
                      #{o.id} <span className="font-semibold text-muted-foreground">· {o.customerName}</span>
                    </p>
                    <p className={cn("text-sm", urgent ? "font-bold text-mango-700" : "text-muted-foreground")}>
                      {ago(o.createdAt)}
                      {urgent && " · waiting for you"}
                    </p>
                  </div>
                  <Badge tone={cfg.tone}>{cfg.label}</Badge>
                </div>

                <ul className="mt-4 space-y-1.5 rounded-2xl bg-violet-50/60 p-3 text-sm">
                  {o.items?.map((i) => (
                    <li key={i.id} className="flex justify-between gap-3">
                      <span className="min-w-0">
                        <b className="mr-1.5 rounded-md bg-card px-1.5 py-0.5 text-xs">{i.quantity}×</b>
                        {i.name}
                      </span>
                      <span className="shrink-0 font-semibold">{naira(i.price * i.quantity)}</span>
                    </li>
                  ))}
                  <li className="flex justify-between border-t border-dashed border-border pt-2 font-extrabold">
                    <span>Total</span>
                    <span className="text-primary">{naira(o.total)}</span>
                  </li>
                </ul>

                {o.notes && (
                  <p className="mt-3 flex gap-2 rounded-2xl bg-mango-50 p-3 text-sm text-mango-900">
                    <StickyNote className="mt-0.5 h-4 w-4 shrink-0" />
                    {o.notes}
                  </p>
                )}

                <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                  {o.address && (
                    <p className="flex gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {o.address}
                    </p>
                  )}
                  {o.customerPhone && (
                    <a href={`tel:${o.customerPhone}`} className="inline-flex items-center gap-2 font-semibold text-primary hover:underline">
                      <Phone className="h-4 w-4" /> {o.customerPhone}
                    </a>
                  )}
                </div>

                {(next || ["pending", "preparing", "ready"].includes(o.status)) && (
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                  {next ? (
                    <button
                      onClick={() => advance(o.id, next.to)}
                      disabled={isBusy}
                      className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-cta px-5 text-base font-extrabold text-cta-foreground shadow-sm transition hover:bg-mango-300 active:scale-[0.98] disabled:opacity-60 sm:flex-none"
                    >
                      {isBusy ? <Loader2 className="h-5 w-5 animate-spin" /> : <>{next.label} <ArrowRight className="h-5 w-5" /></>}
                    </button>
                  ) : o.status === "ready" ? (
                    <p className="flex flex-1 items-center gap-2 rounded-full bg-success-soft px-4 py-3 text-sm font-bold text-success">
                      <Bike className="h-4 w-4" /> Waiting for a rider to pick this up
                    </p>
                  ) : null}
                  {["pending", "preparing", "ready"].includes(o.status) && (
                    <button
                      onClick={() => setCancelId(o.id)}
                      disabled={isBusy}
                      className="h-12 rounded-full border border-destructive/30 px-5 text-sm font-bold text-destructive transition hover:bg-destructive/10 disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  )}
                </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <AlertDialog open={cancelId !== null} onOpenChange={(o) => !o && setCancelId(null)}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel order #{cancelId}?</AlertDialogTitle>
            <AlertDialogDescription>The customer will be notified and this can&apos;t be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Keep order</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (cancelId !== null) advance(cancelId, "cancelled");
                setCancelId(null);
              }}
            >
              Cancel order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

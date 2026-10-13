"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Bike, Check, ChefHat, Clock, Package, PackageCheck, Phone, Receipt, XCircle } from "lucide-react";
import { EmptyState, ErrorState, StatusPill } from "./ui";
import { Skeleton } from "@/components/ui/skeleton";
import CustomerTrackingMap from "@/app/customer/dashboard/orders/[id]/CustomerTrackingMap";
import { ACTIVE_STATUSES, ORDER_STEPS, api, naira } from "@/lib/customer";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ElementType> = {
  pending: Clock,
  preparing: ChefHat,
  ready: Package,
  out_for_delivery: Bike,
  delivered: PackageCheck,
};

const HEADLINE: Record<string, string> = {
  pending: "Waiting for the restaurant",
  confirmed: "Order confirmed",
  preparing: "Your food is being prepared",
  ready: "Ready for pickup",
  out_for_delivery: "Your rider is on the way",
  delivered: "Delivered. Enjoy!",
  cancelled: "Order cancelled",
  rejected: "The restaurant couldn't take this order",
  failed: "Payment failed",
};

export default function OrderDetailView() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(
    async (silent = false) => {
      try {
        const json = await api("/orders/my", { auth: true });
        setOrder((json.data?.orders || []).find((o: any) => o.id === Number(id)) || null);
        setError("");
      } catch (e: any) {
        if (!silent) setError(e.message);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [id],
  );

  const live = !order || ACTIVE_STATUSES.includes(order.status);
  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => load(true), 10000);
    return () => clearInterval(t);
  }, [live, load]);

  const back = (
    <button
      onClick={() => (window.history.length > 1 ? router.back() : router.push("/customer/dashboard/orders"))}
      className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-bold text-primary transition hover:bg-violet-50"
    >
      <ArrowLeft className="h-4 w-4" /> Orders
    </button>
  );

  if (loading)
    return (
      <div className="mx-auto max-w-3xl space-y-4" aria-busy="true">
        <Skeleton className="h-8 w-32 bg-muted" />
        <Skeleton className="h-40 w-full rounded-3xl bg-muted" />
        <Skeleton className="h-56 w-full rounded-3xl bg-muted" />
      </div>
    );

  if (error)
    return (
      <div className="mx-auto max-w-xl">
        {back}
        <ErrorState title="We couldn't load this order" message={error} onRetry={() => load()} />
      </div>
    );

  if (!order)
    return (
      <div className="mx-auto max-w-xl">
        {back}
        <EmptyState icon={Receipt} title="Order not found" body="It may belong to a different account." action={{ label: "View my orders", href: "/customer/dashboard/orders" }} />
      </div>
    );

  const failed = ["cancelled", "rejected", "failed"].includes(order.status);
  const step = Math.max(0, ORDER_STEPS.findIndex((s) => s.id === (order.status === "confirmed" ? "pending" : order.status)));
  const showMap = ["ready", "out_for_delivery"].includes(order.status) && order.rider;
  const subtotal = (order.items || []).reduce((n: number, i: any) => n + (i.price || 0) * i.quantity, 0);

  return (
    <div className="mx-auto max-w-3xl">
      {back}

      <section className="rounded-3xl border border-border bg-card p-5 shadow-card sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-muted-foreground">
              {order.business?.name} · Order #{order.id}
            </p>
            <h1 className="font-display mt-1 text-2xl font-extrabold leading-tight sm:text-3xl">
              {HEADLINE[order.status] || "Order update"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Placed {format(new Date(order.createdAt), "d MMM, h:mm a")}
            </p>
          </div>
          <StatusPill status={order.status} />
        </div>

        {failed ? (
          <div role="alert" className="mt-5 flex items-center gap-3 rounded-2xl bg-destructive/10 p-4 text-sm font-semibold text-destructive">
            <XCircle className="h-5 w-5 shrink-0" /> This order won&apos;t be delivered. If you were charged, it will be refunded.
          </div>
        ) : (
          <ol className="mt-6 grid grid-cols-5" aria-label="Order progress">
            {ORDER_STEPS.map((s, i) => {
              const Icon = ICONS[s.id];
              const done = i < step || order.status === "delivered";
              const current = i === step && order.status !== "delivered";
              return (
                <li key={s.id} className="relative flex flex-col items-center text-center" aria-current={current ? "step" : undefined}>
                  {i > 0 && (
                    <span className={cn("absolute right-1/2 top-5 h-1 w-full -translate-y-1/2 rounded-full", i <= step ? "bg-primary" : "bg-violet-100")} aria-hidden />
                  )}
                  <span
                    className={cn(
                      "relative z-10 grid h-10 w-10 place-items-center rounded-full border-2 transition",
                      done && "border-primary bg-primary text-primary-foreground",
                      current && "border-cta bg-cta text-cta-foreground shadow-pop",
                      !done && !current && "border-violet-100 bg-card text-violet-300",
                    )}
                  >
                    {done ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </span>
                  <span className={cn("mt-2 text-[11px] font-bold leading-tight sm:text-xs", done || current ? "text-foreground" : "text-muted-foreground")}>
                    {s.label}
                  </span>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      {showMap && (
        <section className="mt-4 overflow-hidden rounded-3xl border border-border bg-card shadow-card">
          <CustomerTrackingMap orderId={Number(id)} />
        </section>
      )}

      {order.rider && !failed && (
        <section className="mt-4 flex items-center gap-4 rounded-3xl border border-border bg-card p-4 shadow-card">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-mango-100 text-mango-800">
            <Bike className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Your rider</p>
            <p className="truncate font-bold">{order.rider.firstName} {order.rider.lastName}</p>
            {(order.rider.riderProfile?.vehicleType || order.rider.riderProfile?.plateNumber) && (
              <p className="truncate text-sm text-muted-foreground">
                {[order.rider.riderProfile?.vehicleType, order.rider.riderProfile?.plateNumber].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
          {order.rider.phone && (
            <a href={`tel:${order.rider.phone}`} aria-label="Call rider" className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground transition hover:bg-violet-800">
              <Phone className="h-5 w-5" />
            </a>
          )}
        </section>
      )}

      <section className="mt-4 rounded-3xl border border-border bg-card p-5 shadow-card">
        <h2 className="font-display mb-3 text-lg font-bold">Receipt</h2>
        <ul className="space-y-2 text-sm">
          {order.items?.map((i: any) => (
            <li key={i.id ?? i.menuItemId} className="flex justify-between gap-4">
              <span><b>{i.quantity}×</b> {i.name || "Item"}</span>
              <span className="font-semibold">{naira((i.price || 0) * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1.5 border-t border-dashed border-border pt-4 text-sm text-muted-foreground">
          <div className="flex justify-between"><span>Subtotal</span><span>{naira(subtotal)}</span></div>
          {order.total > subtotal && (
            <div className="flex justify-between"><span>Delivery &amp; fees</span><span>{naira(order.total - subtotal)}</span></div>
          )}
          <div className="flex items-baseline justify-between pt-1 text-foreground">
            <span className="font-bold">Total</span>
            <span className="font-display text-xl font-extrabold text-primary">{naira(order.total)}</span>
          </div>
        </div>
        {order.address && (
          <p className="mt-4 rounded-2xl bg-violet-50 p-3 text-sm text-violet-900"><b>Delivering to:</b> {order.address}</p>
        )}
      </section>

      <Link href="/customer/dashboard/support" className="mt-5 block text-center text-sm font-semibold text-primary hover:underline">
        Problem with this order? Contact support
      </Link>
    </div>
  );
}

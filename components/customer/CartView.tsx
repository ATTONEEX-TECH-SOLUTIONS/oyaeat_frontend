"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Store, Trash2, ShoppingBag } from "lucide-react";
import { EmptyState, PageHeader, QtyStepper } from "./ui";
import { RestaurantImage } from "./RestaurantCard";
import { useCart } from "@/hooks/useCart";
import {
  DELIVERY_FEE_ESTIMATE,
  SERVICE_FEE_ESTIMATE,
  getUser,
  naira,
} from "@/lib/customer";
import { Skeleton } from "@/components/ui/skeleton";

export const CHECKOUT_PATH = "/customer/dashboard/checkout";

export function OrderSummary({
  subtotal,
  className = "",
}: {
  subtotal: number;
  className?: string;
}) {
  const total = subtotal + DELIVERY_FEE_ESTIMATE + SERVICE_FEE_ESTIMATE;
  return (
    <dl className={`space-y-2.5 text-sm ${className}`}>
      <Row label="Subtotal" value={naira(subtotal)} />
      <Row label="Delivery (estimate)" value={naira(DELIVERY_FEE_ESTIMATE)} />
      <Row label="Service fee" value={naira(SERVICE_FEE_ESTIMATE)} />
      <div className="my-3 border-t border-dashed border-border" />
      <div className="flex items-baseline justify-between">
        <dt className="font-bold">Total</dt>
        <dd className="font-display text-2xl font-extrabold text-primary">
          {naira(total)}
        </dd>
      </div>
    </dl>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <dt>{label}</dt>
      <dd className="font-semibold text-foreground">{value}</dd>
    </div>
  );
}

export default function CartView() {
  const cart = useCart();

  if (!cart.ready) {
    return (
      <div className="mx-auto max-w-5xl space-y-3" aria-busy="true">
        <Skeleton className="h-9 w-40 bg-muted" />
        <Skeleton className="h-28 w-full rounded-3xl bg-muted" />
        <Skeleton className="h-28 w-full rounded-3xl bg-muted" />
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl pt-4">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          body="Find something delicious and it'll show up here."
          action={{ label: "Browse restaurants", href: "/customer" }}
        />
      </div>
    );
  }

  const checkoutHref = getUser()
    ? CHECKOUT_PATH
    : `/customer/login?next=${encodeURIComponent(CHECKOUT_PATH)}`;

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Your cart"
        action={
          <button
            onClick={cart.clear}
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-destructive transition hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" /> Clear
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <section className="space-y-4">
          <Link
            href={`/customer/restaurant/${cart.restaurantId}`}
            className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-2 text-sm font-bold text-violet-900 transition hover:bg-violet-100"
          >
            <Store className="h-4 w-4" /> {cart.restaurantName}
            <span className="font-medium text-violet-700">· add more</span>
          </Link>

          <ul className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card shadow-card">
            {cart.items.map((item) => (
              <li key={item.menuItemId} className="flex items-center gap-4 p-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-violet-50">
                  <RestaurantImage src={item.image} alt={item.name} className="h-full w-full" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display line-clamp-2 font-bold leading-snug">
                    {item.name}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {naira(item.price)} each
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <QtyStepper
                      size="sm"
                      quantity={item.quantity}
                      onAdd={() => cart.add(item)}
                      onRemove={() => cart.decrement(item.menuItemId)}
                    />
                    <span className="font-extrabold">
                      {naira(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => cart.remove(item.menuItemId)}
                  aria-label={`Remove ${item.name}`}
                  className="grid h-10 w-10 shrink-0 place-items-center self-start rounded-full text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Summary: sticky card on desktop, docked bar on mobile */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-3xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display mb-4 text-lg font-bold">Order summary</h2>
            <OrderSummary subtotal={cart.subtotal} />
            <Link
              href={checkoutHref}
              className="mt-6 flex h-12 items-center justify-center gap-2 rounded-full bg-cta text-base font-extrabold text-cta-foreground shadow-sm transition hover:bg-mango-300"
            >
              Checkout <ArrowRight className="h-5 w-5" />
            </Link>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Final delivery fee is confirmed at checkout.
            </p>
          </div>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-border bg-card/95 p-4 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Estimated total</p>
            <p className="font-display text-xl font-extrabold">
              {naira(cart.subtotal + DELIVERY_FEE_ESTIMATE + SERVICE_FEE_ESTIMATE)}
            </p>
          </div>
          <Link
            href={checkoutHref}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-cta text-base font-extrabold text-cta-foreground shadow-sm active:scale-[0.98]"
          >
            Checkout <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

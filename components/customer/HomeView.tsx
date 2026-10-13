"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Bike,
  ChefHat,
  Clock,
  Flame,
  Leaf,
  Pizza,
  CupSoda,
  Search,
  Store,
  UtensilsCrossed,
  X,
} from "lucide-react";
import RestaurantCard from "./RestaurantCard";
import {
  EmptyState,
  ErrorState,
  RestaurantCardSkeleton,
  StatusPill,
} from "./ui";
import {
  ACTIVE_STATUSES,
  api,
  getToken,
  getUser,
  naira,
  resolveImg,
  type CustomerUser,
} from "@/lib/customer";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";

const CUISINES = [
  { id: "african", label: "African", icon: Flame },
  { id: "fast food", label: "Fast food", icon: Pizza },
  { id: "healthy", label: "Healthy", icon: Leaf },
  { id: "drinks", label: "Drinks", icon: CupSoda },
  { id: "asian", label: "Asian", icon: UtensilsCrossed },
];

export default function HomeView() {
  const router = useRouter();
  const params = useSearchParams();
  const q = (params.get("q") || "").trim();

  const [user, setUser] = useState<CustomerUser | null>(null);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [promos, setPromos] = useState<any[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const qs = new URLSearchParams({ limit: "24" });
      if (q) qs.set("q", q);
      const json = await api(`/public/restaurants?${qs}`);
      setRestaurants(json.data?.restaurants || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setUser(getUser());
    api("/public/promos/public-feed")
      .then((j) => Array.isArray(j.data) && setPromos(j.data))
      .catch(() => {});
    if (getToken()) {
      api("/orders/my", { auth: true })
        .then((j) => setOrders(j.data?.orders || []))
        .catch(() => {});
    }
  }, []);

  const activeOrder = orders.find((o) => ACTIVE_STATUSES.includes(o.status));

  // "Order again": most-ordered dishes across past orders
  const reorder = (() => {
    const map = new Map<number, any>();
    orders.forEach((o) =>
      o.items?.forEach((it: any) => {
        const prev = map.get(it.menuItemId);
        if (prev) prev.count += 1;
        else
          map.set(it.menuItemId, {
            ...it,
            restaurantId: o.businessId,
            restaurantName: o.business?.name,
            count: 1,
          });
      }),
    );
    return [...map.values()].sort((a, b) => b.count - a.count).slice(0, 8);
  })();

  const setQuery = (value: string) =>
    router.replace(value ? `/customer?q=${encodeURIComponent(value)}` : "/customer", {
      scroll: false,
    });

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* 1. Greeting: orients the user and states the job of this screen */}
      {!q && (
        <section>
          <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            {user?.firstName ? (
              <>
                Hungry, <span className="text-primary">{user.firstName}</span>?
              </>
            ) : (
              <>
                Hot meals, <span className="text-primary">delivered fast.</span>
              </>
            )}
          </h1>
          <p className="mt-1.5 text-muted-foreground">
            Order from restaurants near you.
          </p>
        </section>
      )}

      {/* 2. Live order beats everything else */}
      {activeOrder && !q && <ActiveOrderCard order={activeOrder} />}

      {/* 3. Promotions */}
      {!q && <Promos promos={promos} />}

      {/* 4. Cuisine filter */}
      <section aria-label="Cuisines" className="-mx-4 lg:mx-0">
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-1 lg:px-0">
          <Chip active={!q} onClick={() => setQuery("")}>
            All
          </Chip>
          {CUISINES.map((c) => (
            <Chip
              key={c.id}
              active={q.toLowerCase() === c.id}
              onClick={() => setQuery(c.id)}
              icon={c.icon}
            >
              {c.label}
            </Chip>
          ))}
        </div>
      </section>

      {/* 5. Order again */}
      {!q && reorder.length > 0 && (
        <section>
          <SectionTitle>Order again</SectionTitle>
          <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 lg:mx-0 lg:px-0">
            {reorder.map((it) => (
              <Link
                key={it.menuItemId}
                href={`/customer/restaurant/${it.restaurantId}`}
                className="group w-44 shrink-0 snap-start overflow-hidden rounded-2xl border border-border bg-card shadow-card transition hover:-translate-y-0.5 hover:shadow-pop"
              >
                <div className="h-24 overflow-hidden bg-violet-50">
                  {(it.menuItem?.imageUrl || it.imageUrl) && (
                    <img
                      src={resolveImg(it.menuItem?.imageUrl || it.imageUrl)}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-3">
                  <p className="line-clamp-1 text-sm font-bold">{it.name}</p>
                  <p className="line-clamp-1 text-xs text-muted-foreground">
                    {it.restaurantName || "Restaurant"}
                  </p>
                  {it.price != null && (
                    <p className="mt-1 text-sm font-extrabold text-primary">
                      {naira(it.price)}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 6. Restaurants */}
      <section aria-live="polite">
        <SectionTitle
          action={
            q ? (
              <button
                onClick={() => setQuery("")}
                className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1.5 text-xs font-bold text-violet-900"
              >
                <X className="h-3.5 w-3.5" /> Clear
              </button>
            ) : undefined
          }
        >
          {q ? `Results for “${q}”` : "Restaurants near you"}
        </SectionTitle>

        {loading ? (
          <Grid>
            {Array.from({ length: 8 }).map((_, i) => (
              <RestaurantCardSkeleton key={i} />
            ))}
          </Grid>
        ) : error ? (
          <ErrorState
            title="We couldn't load restaurants"
            message={error}
            onRetry={load}
          />
        ) : restaurants.length === 0 ? (
          q ? (
            <EmptyState
              icon={Search}
              title={`Nothing found for “${q}”`}
              body="Check the spelling, or try a cuisine like African or Fast food."
              action={{ label: "See all restaurants", onClick: () => setQuery("") }}
            />
          ) : (
            <EmptyState
              icon={Store}
              title="No restaurants open yet"
              body="We're onboarding kitchens in your area. Check back soon."
              action={{ label: "Refresh", onClick: load }}
            />
          )
        ) : (
          <Grid>
            {restaurants.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </Grid>
        )}
      </section>
    </div>
  );
}

/* ---------- pieces ---------- */

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
      {children}
    </div>
  );
}

function SectionTitle({
  children,
  action,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="font-display text-xl font-extrabold tracking-tight sm:text-2xl">
        {children}
      </h2>
      {action}
    </div>
  );
}

function Chip({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-bold transition",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-card text-foreground hover:border-violet-300 hover:bg-violet-50",
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  );
}

function ActiveOrderCard({ order }: { order: any }) {
  const Icon =
    order.status === "out_for_delivery"
      ? Bike
      : order.status === "preparing"
        ? ChefHat
        : Clock;
  return (
    <Link
      href={`/customer/dashboard/orders/${order.id}`}
      className="group flex items-center gap-4 rounded-3xl border border-mango-200 bg-mango-50 p-4 shadow-card transition hover:shadow-pop sm:p-5"
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-cta text-cta-foreground">
        <Icon className="h-6 w-6" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <StatusPill status={order.status} />
          <p className="text-xs font-bold uppercase tracking-wider text-mango-800">
            Order in progress
          </p>
        </div>
        <p className="mt-1 truncate font-display text-lg font-bold">
          {order.business?.name || "Your order"}
        </p>
      </div>
      <span className="hidden items-center gap-1 text-sm font-bold text-primary sm:flex">
        Track <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </span>
      <ArrowRight className="h-5 w-5 text-primary sm:hidden" />
    </Link>
  );
}

function Promos({ promos }: { promos: any[] }) {
  const ref = useRef<HTMLDivElement>(null);
  if (!promos.length) {
    return (
      <section className="lp-doodles relative overflow-hidden rounded-3xl p-6 text-white shadow-card sm:p-10">
        <div className="relative max-w-md">
          <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider">
            Fresh &amp; local
          </span>
          <h2 className="font-display mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
            Craving jollof? <span className="text-cta">We deliver it hot.</span>
          </h2>
          <p className="mt-2 text-violet-100">
            Pick a kitchen near you and your meal is on its way.
          </p>
        </div>
      </section>
    );
  }
  return (
    <section aria-label="Promotions" className="-mx-4 lg:mx-0">
      <div
        ref={ref}
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 lg:px-0"
      >
        {promos.map((p, i) => {
          const isImg = /^https?:\/\//.test(p.bgGradient || "");
          return (
            <div
              key={p.id || i}
              className={cn(
                "lp-doodles relative flex min-h-44 shrink-0 snap-start flex-col justify-between overflow-hidden rounded-3xl p-5 text-white shadow-card sm:p-6",
                promos.length === 1 ? "w-full" : "w-[86%] sm:w-[26rem]",
              )}
              style={
                isImg
                  ? {
                      backgroundImage: `linear-gradient(to top, rgba(26,16,51,.85), rgba(26,16,51,.25)), url(${p.bgGradient})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : undefined
              }
            >
              <div>
                {p.business?.name && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-bold backdrop-blur">
                    <Store className="h-3.5 w-3.5" /> {p.business.name}
                  </span>
                )}
                <h3 className="font-display mt-2 line-clamp-2 text-2xl font-extrabold leading-tight">
                  {p.title}
                </h3>
                {p.desc && (
                  <p className="mt-1 line-clamp-2 text-sm text-violet-100">
                    {p.desc}
                  </p>
                )}
              </div>
              {p.businessId && (
                <Link
                  href={`/customer/restaurant/${p.businessId}`}
                  className="mt-4 inline-flex h-10 w-fit items-center gap-2 rounded-full bg-cta px-5 text-sm font-bold text-cta-foreground transition hover:bg-mango-300"
                >
                  Order now <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

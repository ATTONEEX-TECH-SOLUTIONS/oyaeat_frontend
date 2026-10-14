"use client";

import Logo from "@/components/brand/Logo";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  BarChart3,
  Bell,
  Banknote,
  ChefHat,
  Home,
  LifeBuoy,
  LogOut,
  Megaphone,
  Menu as MenuIcon,
  MoreHorizontal,
  Settings,
  Star,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { vendorApi } from "@/lib/api/vendor";
import { cn } from "@/lib/utils";

const BASE = "/restaurant/dashboard";

type Item = { href: string; label: string; icon: React.ElementType; badge?: "orders" | "alerts" };
const GROUPS: { title?: string; items: Item[] }[] = [
  {
    items: [
      { href: BASE, label: "Dashboard", icon: Home },
      { href: `${BASE}/orders`, label: "Orders", icon: ChefHat, badge: "orders" },
      { href: `${BASE}/menu`, label: "Menu", icon: UtensilsCrossed },
    ],
  },
  {
    title: "Grow",
    items: [
      { href: `${BASE}/reviews`, label: "Reviews", icon: Star },
      { href: `${BASE}/advertisements`, label: "Advertisements", icon: Megaphone },
      { href: `${BASE}/analytics`, label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    title: "Business",
    items: [
      { href: `${BASE}/wallet`, label: "Wallet", icon: Banknote },
      { href: `${BASE}/staff`, label: "Staff", icon: Users },
    ],
  },
  {
    title: "Account",
    items: [
      { href: `${BASE}/notifications`, label: "Notifications", icon: Bell, badge: "alerts" },
      { href: `${BASE}/support`, label: "Support", icon: LifeBuoy },
      { href: `${BASE}/settings`, label: "Settings", icon: Settings },
    ],
  },
];
const ALL = GROUPS.flatMap((g) => g.items);
const TABS: Item[] = [ALL[0], ALL[1], ALL[2], { href: `${BASE}/wallet`, label: "Wallet", icon: Banknote }];

const titleFor = (p: string) =>
  [...ALL].sort((a, b) => b.href.length - a.href.length).find((i) => p === i.href || p.startsWith(i.href + "/"))?.label || "Dashboard";

const playNotificationSound = () => {
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const vol = localStorage.getItem("vendor_audio_volume");
    const max = vol !== null ? parseFloat(vol) : 0.5;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(max, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
    osc.onended = () => ctx.close().catch(() => {});
  } catch {}
};

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function VendorShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [dashboard, setDashboard] = useState<any>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [pending, setPending] = useState(0);
  const [unread, setUnread] = useState(0);
  const polling = useRef(false);

  // auth guard + identity
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.replace("/restaurant/login");
      return;
    }
    try {
      const raw = localStorage.getItem("dashboard");
      if (raw) setDashboard(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, [router]);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (pathname.startsWith(`${BASE}/notifications`)) setUnread(0);
  }, [pathname]);

  // business logo
  useEffect(() => {
    const id = dashboard?.businesses?.[0]?.id;
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!id || !token) return;
    fetch(`${API}/vendor/business/${id}/settings`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => j?.data?.profilePicUrl && setLogo(j.data.profilePicUrl))
      .catch(() => {});
  }, [dashboard]);

  // new-order polling: badge, toast and sound
  useEffect(() => {
    if (!ready) return;
    const poll = async () => {
      if (polling.current) return;
      polling.current = true;
      try {
        const data = await vendorApi.getOrders({ page: 1, limit: 50 });
        const orders = Array.isArray(data.orders) ? data.orders : [];
        setPending(orders.filter((o) => o.status === "pending").length);
        const stored = localStorage.getItem("vendor_last_seen_order_id");
        const maxId = orders.reduce((m, o) => Math.max(m, o.id), 0);
        // First visit on this device: remember where we are, don't alert for old orders.
        if (stored === null) {
          localStorage.setItem("vendor_last_seen_order_id", String(maxId));
          return;
        }
        let lastSeen = parseInt(stored, 10) || 0;
        let highest = lastSeen;
        let fresh = 0;
        orders.forEach((o) => {
          if (o.id > lastSeen) {
            fresh++;
            if (o.id > highest) highest = o.id;
          }
        });
        if (fresh > 0) {
          setUnread((n) => n + fresh);
          localStorage.setItem("vendor_last_seen_order_id", String(highest));
          toast.success("New order received", { description: "Open Orders to accept it." });
          playNotificationSound();
        }
      } catch {
      } finally {
        polling.current = false;
      }
    };
    poll();
    const t = setInterval(poll, 10000);
    return () => clearInterval(t);
  }, [ready]);

  const business = dashboard?.businesses?.[0];
  const name = business?.name || "Your restaurant";
  const logout = () => {
    try {
      ["authToken", "dashboard", "vendor_dashboard", "businessData"].forEach((k) => localStorage.removeItem(k));
      sessionStorage.removeItem("businessData");
    } catch {}
    router.replace("/restaurant/login");
  };

  const badgeFor = (b?: Item["badge"]) => (b === "orders" ? pending : b === "alerts" ? unread : 0);

  const sidebar = (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="px-5 pb-3 pt-5">
        <Logo variant="white" className="h-12" />
        <p className="text-[11px] font-semibold uppercase tracking-widest text-violet-300">Restaurant</p>
      </div>
      <div className="mx-3 mb-2 flex items-center gap-3 rounded-2xl bg-white/5 p-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-cta font-display font-extrabold text-cta-foreground">
          {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : name[0]?.toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white">{name}</p>
          <p className="truncate text-xs text-violet-200/70">
            {[dashboard?.firstName, dashboard?.lastName].filter(Boolean).join(" ") || "Owner"}
          </p>
        </div>
      </div>
      <nav className="flex-1 space-y-4 no-scrollbar overflow-y-auto px-3 py-3" aria-label="Restaurant">
        {GROUPS.map((g, gi) => (
          <div key={gi}>
            {g.title && <p className="mb-1.5 px-3 text-[11px] font-bold uppercase tracking-widest text-violet-300/70">{g.title}</p>}
            <ul className="space-y-0.5">
              {g.items.map((item) => {
                const active = item.href === BASE ? pathname === BASE : pathname.startsWith(item.href);
                const count = badgeFor(item.badge);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                        active ? "bg-white/10 text-white" : "text-violet-100/80 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      {active && <span className="absolute inset-y-2 left-0 w-1 rounded-full bg-cta" aria-hidden />}
                      <item.icon className={cn("h-5 w-5 shrink-0", active ? "text-cta" : "text-violet-300")} />
                      <span className="flex-1">{item.label}</span>
                      {count > 0 && (
                        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-cta px-1.5 text-[11px] font-extrabold text-cta-foreground">{count}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-white/10 p-3">
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-violet-100/80 transition hover:bg-white/5 hover:text-white">
          <LogOut className="h-5 w-5 text-violet-300" /> Log out
        </button>
      </div>
    </div>
  );

  if (!ready) return <div className="grid min-h-screen place-items-center bg-background text-sm font-semibold text-muted-foreground" aria-busy="true">Loading…</div>;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">{sidebar}</aside>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 border-none bg-sidebar p-0 [&>button]:text-white">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          {sidebar}
        </SheetContent>
      </Sheet>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/90 px-4 backdrop-blur-xl lg:h-16 lg:px-8">
          <button onClick={() => setOpen(true)} aria-label="Open menu" className="grid h-10 w-10 place-items-center rounded-full bg-violet-50 text-violet-900 lg:hidden">
            <MenuIcon className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <p className="font-display truncate text-lg font-extrabold leading-tight tracking-tight">{titleFor(pathname)}</p>
            <p className="truncate text-xs text-muted-foreground lg:hidden">{name}</p>
          </div>
          <Link href={`${BASE}/notifications`} aria-label={`Notifications${unread ? `, ${unread} new` : ""}`} className="relative ml-auto grid h-10 w-10 place-items-center rounded-full bg-violet-50 text-violet-900 transition hover:bg-violet-100">
            <Bell className="h-5 w-5" />
            {unread > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-cta px-1 text-[10px] font-extrabold text-cta-foreground">{unread}</span>}
          </Link>
        </header>
        <main className="mx-auto w-full max-w-[1400px] px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">{children}</main>
      </div>

      {/* Mobile bottom tabs */}
      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-xl lg:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <ul className="mx-auto grid max-w-md grid-cols-5">
          {TABS.map((t) => {
            const active = t.href === BASE ? pathname === BASE : pathname.startsWith(t.href);
            const count = t.href.endsWith("/orders") ? pending : 0;
            return (
              <li key={t.href}>
                <Link href={t.href} className={cn("flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-bold transition", active ? "text-primary" : "text-muted-foreground")}>
                  <span className={cn("relative grid h-8 w-12 place-items-center rounded-full transition", active && "bg-violet-100")}>
                    <t.icon className="h-5 w-5" />
                    {count > 0 && <span className="absolute -right-0.5 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-cta px-1 text-[10px] font-extrabold text-cta-foreground">{count}</span>}
                  </span>
                  {t.label}
                </Link>
              </li>
            );
          })}
          <li>
            <button onClick={() => setOpen(true)} className="flex h-16 w-full flex-col items-center justify-center gap-1 text-[11px] font-bold text-muted-foreground">
              <span className="grid h-8 w-12 place-items-center"><MoreHorizontal className="h-5 w-5" /></span>
              More
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

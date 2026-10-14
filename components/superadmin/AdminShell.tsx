"use client";

import Logo from "@/components/brand/Logo";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Banknote,
  Bike,
  Building2,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  MessageSquare,
  Settings,
  ShoppingBag,
  Store,
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { fetchBusinessStats } from "@/lib/api/superadmin";
import { cn } from "@/lib/utils";

const BASE = "/superadmin/dashboard";

type Item = { href: string; label: string; icon: React.ElementType; badge?: "pending" };
const GROUPS: { title?: string; items: Item[] }[] = [
  { items: [{ href: BASE, label: "Overview", icon: LayoutDashboard }] },
  {
    title: "Operations",
    items: [
      { href: `${BASE}/businesses`, label: "Business approvals", icon: Building2, badge: "pending" },
      { href: `${BASE}/restaurants`, label: "Restaurants", icon: Store },
      { href: `${BASE}/riders`, label: "Riders", icon: Bike },
      { href: `${BASE}/orders`, label: "Customers & orders", icon: ShoppingBag },
    ],
  },
  {
    title: "Growth & money",
    items: [
      { href: `${BASE}/broadcasts`, label: "Advert broadcasts", icon: Megaphone },
      { href: `${BASE}/payout`, label: "Payouts", icon: Banknote },
    ],
  },
  {
    title: "Support",
    items: [{ href: `${BASE}/chat`, label: "Support inbox", icon: MessageSquare }],
  },
  { title: "System", items: [{ href: `${BASE}/settings`, label: "Settings", icon: Settings }] },
];

const ALL = GROUPS.flatMap((g) => g.items);
const titleFor = (path: string) =>
  [...ALL].sort((a, b) => b.href.length - a.href.length).find((i) => path === i.href || path.startsWith(i.href + "/"))
    ?.label || "Admin";

function NavList({ pending, onNavigate }: { pending: number; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4" aria-label="Admin">
      {GROUPS.map((g, gi) => (
        <div key={gi}>
          {g.title && (
            <p className="mb-1.5 px-3 text-[11px] font-bold uppercase tracking-widest text-violet-300/70">{g.title}</p>
          )}
          <ul className="space-y-0.5">
            {g.items.map((item) => {
              const active = item.href === BASE ? pathname === BASE : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                      active ? "bg-white/10 text-white" : "text-violet-100/80 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    {active && <span className="absolute inset-y-2 left-0 w-1 rounded-full bg-cta" aria-hidden />}
                    <item.icon className={cn("h-5 w-5 shrink-0", active ? "text-cta" : "text-violet-300")} />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge === "pending" && pending > 0 && (
                      <span className="grid h-5 min-w-5 place-items-center rounded-full bg-cta px-1.5 text-[11px] font-extrabold text-cta-foreground">
                        {pending}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-5 py-5">
      <div className="leading-tight">
        <Logo variant="white" className="h-9" />
        <p className="text-[11px] font-semibold uppercase tracking-widest text-violet-300">Admin</p>
      </div>
    </div>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState(0);
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    let token: string | null = null;
    try {
      token = localStorage.getItem("admin_token");
      setAdmin(JSON.parse(localStorage.getItem("admin_user") || "null"));
    } catch {}
    if (!token) {
      router.replace("/superadmin/login");
      return;
    }
    setReady(true);
    fetchBusinessStats().then((s) => setPending(s.pending || 0)).catch(() => {});
  }, [router, pathname]);

  const logout = () => {
    try {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
    } catch {}
    router.replace("/superadmin/login");
  };

  const sidebar = (onNavigate?: () => void) => (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <Brand />
      <NavList pending={pending} onNavigate={onNavigate} />
      <div className="border-t border-white/10 p-3">
        {admin?.email && <p className="truncate px-3 pb-2 text-xs text-violet-200/70">{admin.email}</p>}
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-violet-100/80 transition hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-5 w-5 text-violet-300" /> Log out
        </button>
      </div>
    </div>
  );

  if (!ready) {
    return <div className="grid min-h-screen place-items-center bg-background text-sm font-semibold text-muted-foreground" aria-busy="true">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">{sidebar()}</aside>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 border-none bg-sidebar p-0 [&>button]:text-white">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          {sidebar(() => setOpen(false))}
        </SheetContent>
      </Sheet>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/90 px-4 backdrop-blur-xl lg:h-16 lg:px-8">
          <button
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
            className="grid h-10 w-10 place-items-center rounded-full bg-violet-50 text-violet-900 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <p className="font-display min-w-0 truncate text-lg font-extrabold tracking-tight">{titleFor(pathname)}</p>
          {pending > 0 && pathname !== `${BASE}/businesses` && (
            <Link
              href={`${BASE}/businesses`}
              className="ml-auto hidden shrink-0 items-center gap-2 rounded-full bg-mango-100 sm:inline-flex px-3 py-1.5 text-xs font-bold text-mango-800 transition hover:bg-mango-200"
            >
              <span className="h-2 w-2 rounded-full bg-mango-500" /> {pending} awaiting approval
            </Link>
          )}
        </header>
        <main className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}

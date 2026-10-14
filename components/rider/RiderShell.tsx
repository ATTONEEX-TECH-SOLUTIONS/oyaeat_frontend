"use client";

import Logo from "@/components/brand/Logo";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bike, Home, LifeBuoy, ListChecks, LogOut, Menu as MenuIcon, MoreHorizontal, Navigation, User, Wallet, WifiOff } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { RiderProvider, useRider } from "./RiderProvider";
import IncomingRequestSheet from "./IncomingRequestSheet";
import { cn } from "@/lib/utils";

const BASE = "/rider/dashboard";
const NAV = [
  { href: BASE, label: "Home", icon: Home },
  { href: `${BASE}/deliveries`, label: "Trips", icon: ListChecks },
  { href: `${BASE}/earnings`, label: "Earnings", icon: Wallet },
  { href: `${BASE}/profile`, label: "Profile", icon: User },
  { href: `${BASE}/support`, label: "Support", icon: LifeBuoy },
];
const TABS = NAV.slice(0, 4);
const titleFor = (p: string) => [...NAV].sort((a, b) => b.href.length - a.href.length).find((i) => p === i.href || p.startsWith(i.href + "/"))?.label || "Home";
const initials = (n: string) => n.split(" ").map((x) => x[0]).join("").toUpperCase().slice(0, 2) || "R";

function OnlineSwitch() {
  const { isOnline, busy, toggleShift, restricted } = useRider();
  if (restricted) return null;
  return (
    <button
      role="switch"
      aria-checked={isOnline}
      aria-label={isOnline ? "Online. Tap to go offline" : "Offline. Tap to go online"}
      onClick={toggleShift}
      disabled={busy}
      className={cn(
        "flex h-11 items-center gap-2.5 rounded-full border pl-3 pr-1.5 text-sm font-extrabold transition disabled:opacity-60",
        isOnline ? "border-success/30 bg-success-soft text-success" : "border-border bg-card text-muted-foreground",
      )}
    >
      <span>{isOnline ? "Online" : "Offline"}</span>
      <span className={cn("relative h-8 w-14 rounded-full transition", isOnline ? "bg-success" : "bg-violet-200")}>
        <span className={cn("absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all", isOnline ? "left-7" : "left-1")} />
      </span>
    </button>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data, loading, isOnline, gpsIssue } = useRider();
  const [open, setOpen] = useState(false);
  const name = data?.profile?.firstName ? `${data.profile.firstName} ${data.profile.lastName || ""}`.trim() : "Rider";
  const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
  const avatar = data?.profile?.avatarUrl ? (data.profile.avatarUrl.startsWith("http") ? data.profile.avatarUrl : `${API}${data.profile.avatarUrl}`) : null;

  useEffect(() => setOpen(false), [pathname]);

  const logout = () => {
    localStorage.removeItem("riderToken");
    router.replace("/rider/login");
  };

  const sidebar = (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="px-5 pb-3 pt-5">
        <Logo variant="white" className="h-12" />
        <p className="text-[11px] font-semibold uppercase tracking-widest text-violet-300">Rider</p>
      </div>
      <div className="mx-3 mb-2 flex items-center gap-3 rounded-2xl bg-white/5 p-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-cta font-display font-extrabold text-cta-foreground">
          {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : initials(name)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white">{name}</p>
          <p className="flex items-center gap-1.5 text-xs text-violet-200/80">
            <span className={cn("h-2 w-2 rounded-full", isOnline ? "bg-success" : "bg-violet-300/60")} /> {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-3" aria-label="Rider">
        {NAV.map((item) => {
          const active = item.href === BASE ? pathname === BASE : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined}
              className={cn("relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition", active ? "bg-white/10 text-white" : "text-violet-100/80 hover:bg-white/5 hover:text-white")}>
              {active && <span className="absolute inset-y-2 left-0 w-1 rounded-full bg-cta" aria-hidden />}
              <item.icon className={cn("h-5 w-5 shrink-0", active ? "text-cta" : "text-violet-300")} /> {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-3">
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-violet-100/80 transition hover:bg-white/5 hover:text-white">
          <LogOut className="h-5 w-5 text-violet-300" /> Log out
        </button>
      </div>
    </div>
  );

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
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/90 px-4 backdrop-blur-xl lg:px-8">
          <button onClick={() => setOpen(true)} aria-label="Open menu" className="grid h-10 w-10 place-items-center rounded-full bg-violet-50 text-violet-900 lg:hidden">
            <MenuIcon className="h-5 w-5" />
          </button>
          <p className="font-display min-w-0 flex-1 truncate text-lg font-extrabold tracking-tight">{titleFor(pathname)}</p>
          {!loading && <OnlineSwitch />}
        </header>

        {gpsIssue && (
          <div role="alert" className="flex items-center gap-2 border-b border-mango-300 bg-mango-50 px-4 py-2.5 text-sm font-semibold text-mango-900 lg:px-8">
            <WifiOff className="h-4 w-4 shrink-0" /> {gpsIssue}
          </div>
        )}

        <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">{children}</main>
      </div>

      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-xl lg:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <ul className="mx-auto grid max-w-md grid-cols-5">
          {TABS.map((t) => {
            const active = t.href === BASE ? pathname === BASE : pathname.startsWith(t.href);
            return (
              <li key={t.href}>
                <Link href={t.href} className={cn("flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-bold transition", active ? "text-primary" : "text-muted-foreground")}>
                  <span className={cn("grid h-8 w-12 place-items-center rounded-full transition", active && "bg-violet-100")}><t.icon className="h-5 w-5" /></span>
                  {t.label}
                </Link>
              </li>
            );
          })}
          <li>
            <button onClick={() => setOpen(true)} className="flex h-16 w-full flex-col items-center justify-center gap-1 text-[11px] font-bold text-muted-foreground">
              <span className="grid h-8 w-12 place-items-center"><MoreHorizontal className="h-5 w-5" /></span> More
            </button>
          </li>
        </ul>
      </nav>

      <IncomingRequestSheet />
    </div>
  );
}

export default function RiderShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem("riderToken")) {
      router.replace("/rider/login");
      return;
    }
    setReady(true);
  }, [router]);
  if (!ready) return <div className="grid min-h-screen place-items-center bg-background text-sm font-semibold text-muted-foreground" aria-busy="true">Loading…</div>;
  return (
    <RiderProvider>
      <Frame>{children}</Frame>
    </RiderProvider>
  );
}

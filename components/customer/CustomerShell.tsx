"use client";

import Logo from "@/components/brand/Logo";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Heart,
  Home,
  LifeBuoy,
  LogOut,
  MapPin,
  Receipt,
  Search,
  Settings,
  ShoppingBag,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/hooks/useCart";
import {
  clearSession,
  getUser,
  naira,
  type CustomerUser,
} from "@/lib/customer";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/customer", label: "Home", icon: Home, exact: true },
  { href: "/customer/dashboard/orders", label: "Orders", icon: Receipt },
  { href: "/customer/cart", label: "Cart", icon: ShoppingBag, cart: true },
  { href: "/customer/dashboard/favorites", label: "Saved", icon: Heart },
  { href: "/customer/dashboard/settings", label: "Account", icon: User },
];

// Routes that need a signed-in customer.
const needsAuth = (path: string) =>
  path.startsWith("/customer/dashboard") || path.startsWith("/customer/checkout");
const isAuthScreen = (path: string) =>
  path === "/customer/login" || path === "/customer/signup";

function useLocationName() {
  const [name, setName] = useState("Set location");
  useEffect(() => {
    const cached = sessionStorage.getItem("oyaeat_city");
    if (cached) return setName(cached);
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`,
          );
          const data = await res.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.state ||
            "Near you";
          sessionStorage.setItem("oyaeat_city", city);
          setName(city);
        } catch {
          setName("Near you");
        }
      },
      () => setName("Set location"),
      { timeout: 8000 },
    );
  }, []);
  return name;
}

export default function CustomerShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { count, subtotal } = useCart();
  const location = useLocationName();
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [checked, setChecked] = useState(false);
  const [q, setQ] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const u = getUser();
    setUser(u);
    setChecked(true);
    if (!u && needsAuth(pathname)) {
      router.replace(`/customer/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [pathname, router]);

  if (isAuthScreen(pathname)) return <>{children}</>;

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(q.trim() ? `/customer?q=${encodeURIComponent(q.trim())}` : "/customer");
  };

  const logout = () => {
    clearSession();
    setUser(null);
    router.push("/customer/login");
  };

  const initials =
    `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase() ||
    "U";
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  // Guests tapping a member-only tab go to login, then come back.
  const hrefFor = (href: string) =>
    !user && needsAuth(href)
      ? `/customer/login?next=${encodeURIComponent(href)}`
      : href;

  const blocked = checked && !user && needsAuth(pathname);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:gap-5 lg:px-6">
          <Link href="/customer" aria-label="OyaEat home" className="shrink-0">
            <Logo className="h-9" />
          </Link>

          <div
            className="flex min-w-0 items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-sm font-semibold text-violet-900"
            title="Delivery location"
          >
            <MapPin className="h-4 w-4 shrink-0 text-primary" />
            <span className="max-w-[7.5rem] truncate sm:max-w-[11rem]">
              {location}
            </span>
          </div>

          <form
            onSubmit={onSearch}
            role="search"
            className="relative ml-2 hidden max-w-xl flex-1 md:block"
          >
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={searchRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search restaurants, cuisines or dishes"
              className="h-11 w-full rounded-full border border-transparent bg-violet-50 pl-11 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:bg-card focus:ring-4 focus:ring-ring/15"
              aria-label="Search"
            />
          </form>

          <nav className="ml-auto hidden items-center gap-1 lg:flex">
            {NAV.filter((n) => !n.cart && n.href !== "/customer" && n.label !== "Account").map(
              (n) => (
                <Link
                  key={n.href}
                  href={hrefFor(n.href)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-semibold transition",
                    isActive(n.href)
                      ? "bg-violet-100 text-violet-900"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  {n.label}
                </Link>
              ),
            )}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Link
              href="/customer/cart"
              aria-label={`Cart, ${count} items`}
              className="relative hidden h-11 items-center gap-2 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground transition hover:bg-violet-800 md:flex"
            >
              <ShoppingBag className="h-4 w-4" />
              {count > 0 ? (
                <>
                  <span>{naira(subtotal)}</span>
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-cta px-1 text-[11px] font-extrabold text-cta-foreground">
                    {count}
                  </span>
                </>
              ) : (
                <span>Cart</span>
              )}
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    aria-label="Account menu"
                    className="grid h-11 w-11 place-items-center rounded-full bg-violet-100 text-sm font-extrabold text-violet-900 outline-none ring-offset-2 transition hover:bg-violet-200 focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {initials}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60 rounded-2xl p-2">
                  <DropdownMenuLabel className="px-3 py-2">
                    <p className="text-sm font-bold">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="truncate text-xs font-normal text-muted-foreground">
                      {user.email}
                    </p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="rounded-lg">
                    <Link href="/customer/dashboard/orders">
                      <Receipt className="mr-2 h-4 w-4" /> My orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg">
                    <Link href="/customer/dashboard/favorites">
                      <Heart className="mr-2 h-4 w-4" /> Saved
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg">
                    <Link href="/customer/dashboard/support">
                      <LifeBuoy className="mr-2 h-4 w-4" /> Help &amp; support
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg">
                    <Link href="/customer/dashboard/settings">
                      <Settings className="mr-2 h-4 w-4" /> Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="rounded-lg text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  href="/customer/login"
                  className="hidden h-11 items-center rounded-full px-4 text-sm font-bold text-primary transition hover:bg-violet-50 sm:flex"
                >
                  Log in
                </Link>
                <Link
                  href="/customer/signup"
                  className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-violet-800"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile search: only where browsing starts */}
        {pathname === "/customer" && (
          <form onSubmit={onSearch} role="search" className="px-4 pb-3 md:hidden">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="What are you craving?"
                className="h-11 w-full rounded-full bg-violet-50 pl-11 pr-4 text-base outline-none focus:ring-4 focus:ring-ring/15"
                aria-label="Search"
              />
            </div>
          </form>
        )}
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 pb-28 pt-5 sm:pt-7 md:pb-12 lg:px-6">
        {blocked ? null : children}
      </main>

      {/* Mobile bottom tabs */}
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-xl md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="mx-auto grid max-w-md grid-cols-5">
          {NAV.map((n) => {
            const active = isActive(n.href, n.exact);
            return (
              <li key={n.href}>
                <Link
                  href={hrefFor(n.href)}
                  className={cn(
                    "relative flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-bold transition",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "relative grid h-8 w-12 place-items-center rounded-full transition",
                      active && "bg-violet-100",
                    )}
                  >
                    <n.icon className="h-5 w-5" />
                    {n.cart && count > 0 && (
                      <span className="absolute -right-0.5 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-cta px-1 text-[10px] font-extrabold text-cta-foreground">
                        {count}
                      </span>
                    )}
                  </span>
                  {n.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

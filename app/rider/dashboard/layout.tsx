"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutGrid,
  MapPin,
  Wallet,
  User,
  MessageSquare,
  LogOut,
  Menu,
  Bell,
  Bike
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { icon: LayoutGrid, label: "Dashboard", href: "/rider/dashboard" },
  { icon: MapPin, label: "Deliveries", href: "/rider/dashboard/deliveries" },
  { icon: Wallet, label: "Earnings", href: "/rider/dashboard/earnings" },
  { icon: User, label: "Profile", href: "/rider/dashboard/profile" },
  { icon: MessageSquare, label: "Support", href: "/rider/dashboard/support" },
];

export default function RiderDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [riderName, setRiderName] = useState("Rider");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  // Reusable function to fetch live status and profile metadata for layout synchronization
  const syncLayoutState = useCallback(async () => {
    try {
      const token = localStorage.getItem("riderToken");
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/rider/dashboard`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setIsOnline(!!data.isOnline);
        setRiderName(data.profile?.firstName ? `${data.profile.firstName} ${data.profile.lastName || ""}`.trim() : "Rider");
        
        // Handle database image attachment string pathing safely
        if (data.profile?.avatarUrl) {
          setAvatarUrl(data.profile.avatarUrl.startsWith("http") ? data.profile.avatarUrl : `${API_BASE_URL}${data.profile.avatarUrl}`);
        } else {
          setAvatarUrl(null);
        }
      }
    } catch (err) {
      console.error("Layout context state polling error", err);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    syncLayoutState();
    
    // Interval polling engine to keep sidebar metrics fresh across screen movements
    const layoutSyncInterval = setInterval(syncLayoutState, 6000);
    return () => clearInterval(layoutSyncInterval);
  }, [syncLayoutState, pathname]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("riderToken");
    router.replace("/rider/login");
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2) || "R";
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "#F5FAF6" }}>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`w-64 flex flex-col fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:static lg:h-screen"
        } border-r border-[#1B4332] shadow-2xl lg:shadow-none`}
        style={{ backgroundColor: "#1B4332" }}
      >
        {/* Logo */}
        <div className="px-5 py-6 flex items-center gap-3">
          <div className="flex flex-col leading-none">
            <span
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "2rem",
                letterSpacing: "0.02em",
                lineHeight: 1,
              }}
            >
            <span className="text-3xl font-black leading-none tracking-tight">
              <span className="text-[#2d5f4f]">Oya</span>
              <span className={`transition-colors duration-300 scrolled ? "text-gray-800" : "text-gray-900"`}>Eat</span>
            </span>
            </span>
            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
                fontSize: "0.6rem",
                letterSpacing: "0.15em",
                color: "#a5d6a7",
                marginTop: "4px",
                textTransform: "uppercase"
              }}
            >
              Rider Portal
            </span>
          </div>
        </div>

        {/* Rider Identity Card */}
        <div className="p-4 mb-2">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-[#a5d6a7]/20 shadow-inner">
            <div className="w-12 h-12 rounded-full bg-[#2D6A4F] flex-shrink-0 flex items-center justify-center overflow-hidden border-2 border-[#4ade80] relative">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="Profile"
                  fill
                  sizes="48px"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <span className="text-white text-sm font-black tracking-wider">
                  {getInitials(riderName)}
                </span>
              )}
            </div>
            <div className="flex flex-col min-w-0 overflow-hidden">
              <span className="text-sm font-bold text-white truncate">
                {riderName}
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={cn("w-2 h-2 rounded-full transition-colors duration-300", isOnline ? "bg-green-400" : "bg-gray-400")} />
                <span className="text-[11px] text-[#a5d6a7] font-medium truncate">
                  {isOnline ? "Online Now" : "Offline"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 pb-4 pt-1 flex flex-col space-y-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 text-sm font-semibold group",
                  isActive
                    ? "bg-[#2D6A4F] text-white shadow-md border border-[#4a7c59]/50"
                    : "text-white/80 hover:bg-white/10 hover:text-white border border-transparent"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-5 h-5 flex-shrink-0 transition-colors",
                      isActive ? "text-[#4ade80]" : "text-[#a5d6a7] group-hover:text-white"
                    )}
                  />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}

          <Link
            href="/rider/dashboard/notifications"
            onClick={() => {
              setMobileMenuOpen(false);
              setUnreadNotifications(0);
            }}
            className={cn(
              "flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 text-sm font-semibold group",
              pathname === "/rider/dashboard/notifications"
                ? "bg-[#2D6A4F] text-white shadow-md border border-[#4a7c59]/50"
                : "text-white/80 hover:bg-white/10 hover:text-white border border-transparent"
            )}
          >
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-[#a5d6a7] group-hover:text-white transition-colors" />
              <span>Notifications</span>
            </div>
            {unreadNotifications > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                {unreadNotifications}
              </span>
            )}
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold text-red-200 hover:bg-red-500/20 hover:text-red-100 transition-colors mt-auto"
          >
            <LogOut className="w-5 h-5 text-red-300" /> Logout
          </button>

          <div className="pt-6 pb-2 text-xs text-[#a5d6a7]/60 text-center font-medium">
            <p className="tracking-wider">OyaEat Rider App v1.0</p>
          </div>
        </nav>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0" style={{ backgroundColor: "#F5FAF6" }}>
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 shrink-0 shadow-sm z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 text-[#1a5c2a] bg-[#1a5c2a]/10 hover:bg-[#1a5c2a]/20 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-extrabold text-gray-900 tracking-tight leading-none text-lg font-['Bebas_Neue']">
              <span className="text-[#1a5c2a]">Oya</span>Eat
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#1B4332] flex items-center justify-center border-2 border-[#4ade80] shadow-sm relative overflow-hidden">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="Mobile Profile"
                fill
                sizes="36px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <span className="text-white text-xs font-black">{getInitials(riderName)}</span>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto w-full relative">
          {children}
        </div>
      </main>
    </div>
  );
}

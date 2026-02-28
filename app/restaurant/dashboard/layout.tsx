'use client';
import React, { useEffect, useState } from "react"
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutGrid,
  UtensilsCrossed,
  ShoppingCart,
  BarChart3,
  Users,
  Settings,
  Bell,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { icon: LayoutGrid,      label: 'Dashboard',       href: '/restaurant/dashboard' },
  { icon: UtensilsCrossed, label: 'Menu Management', href: '/restaurant/dashboard/menu' },
  { icon: ShoppingCart,    label: 'Orders',           href: '/restaurant/dashboard/orders' },
  { icon: BarChart3,       label: 'Analytics',        href: '/restaurant/dashboard/analytics' },
  { icon: Users,           label: 'Staff',            href: '/restaurant/dashboard/staff' },
  { icon: Settings,        label: 'Settings',         href: '/restaurant/dashboard/settings' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [dashboard, setDashboard] = useState<any>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('dashboard');
      if (raw) setDashboard(JSON.parse(raw));
    } catch {}
  }, []);

  const business     = dashboard?.businesses?.[0];
  const businessName = business?.name || 'Vendor Dashboard';
  const phoneVerified = dashboard?.phoneVerified === true;
  const role          = dashboard?.role;

  const handleLogout = () => {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('dashboard');
    } catch {}
    router.replace('/restaurant/login');
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: '#f5faf6' }}>

      {/* ── Sidebar ── */}
      <aside
        className="w-64 h-screen flex flex-col sticky top-0 border-r border-[#14491f]"
        style={{ backgroundColor: '#1a5c2a' }}
      >
        {/* Logo */}
        <div
          className="px-5 py-5 border-b border-[#14491f] flex items-center gap-3"
          style={{ backgroundColor: '#14491f' }}
        >
          {/* White pill so PNG logo is always visible on dark green */}
          <div className="flex-shrink-0 rounded-xl p-2" style={{ backgroundColor: '#ffffff' }}>
            {/* <img
              src="/flash (2).png"
              alt="OyaEats icon"
              className="h-7 w-7 object-contain"
            /> */}
          </div>

          {/* Wordmark */}
          <div className="flex flex-col leading-none">
            <span style={{
              fontFamily: "'Montserrat', 'DM Sans', sans-serif",
              fontWeight: 800,
              fontSize: '1.15rem',
              letterSpacing: '-0.01em',
              lineHeight: 1.1,
            }}>
              <span style={{ color: '#ffffff' }}>Oya</span>
              <span style={{ color: '#4ade80' }}>Eat</span>
            </span>
            <span style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600,
              fontSize: '0.5rem',
              letterSpacing: '0.18em',
              color: '#a5d6a7',
              marginTop: '2px',
            }}>
              FAST DELIVERY
            </span>
          </div>
        </div>

        {/* Restaurant Admin label */}
        <div className="px-5 py-2 border-b border-[#14491f]" style={{ backgroundColor: '#14491f' }}>
          <p className="text-xs" style={{ color: '#a5d6a7', fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.05em' }}>
            Restaurant Admin
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150 text-sm font-medium',
                  isActive
                    ? 'bg-[#2e7d32] text-white shadow-sm'
                    : 'text-white hover:bg-[#14491f]'
                )}
              >
                <Icon className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-white' : 'text-[#a5d6a7]')} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-[#14491f] space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white hover:bg-[#14491f] transition-colors">
            <Bell className="w-5 h-5 text-[#a5d6a7]" />
            Notifications
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white hover:bg-[#14491f] transition-colors"
          >
            <LogOut className="w-5 h-5 text-[#a5d6a7]" />
            Logout
          </button>
          <div className="pt-2 text-xs" style={{ color: '#a5d6a7' }}>
            <p>Admin Portal v1.0</p>
            <p className="mt-1">© 2024 OyaEat</p>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header
          className="border-b px-8 py-4 flex items-center justify-between h-16 flex-shrink-0"
          style={{ backgroundColor: '#ffffff', borderColor: '#c8e6c9' }}
        >
          <h1 className="text-lg font-bold truncate" style={{ color: '#1a5c2a' }}>
            {businessName}
          </h1>

          <div className="flex items-center gap-3">
            {/* Phone verification badge */}
            {phoneVerified ? (
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold border"
                style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', borderColor: '#a5d6a7' }}
              >
                Phone Verified
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-rose-50 text-rose-600 border-rose-200">
                Phone Unverified
              </span>
            )}

            {/* Role badge */}
            {role && (
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold border"
                style={{ backgroundColor: '#f5faf6', color: '#4a7c59', borderColor: '#c8e6c9' }}
              >
                {role}
              </span>
            )}

            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
              style={{ backgroundColor: '#1a5c2a' }}
            >
              {businessName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-8" style={{ backgroundColor: '#f5faf6' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
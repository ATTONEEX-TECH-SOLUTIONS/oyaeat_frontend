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

const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();

  const [dashboard, setDashboard]         = useState<any>(null);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('dashboard');
      if (raw) setDashboard(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    const businessId = dashboard?.businesses?.[0]?.id;
    if (!businessId) return;
    const token = localStorage.getItem('authToken');
    if (!token) return;
    fetch(`${API}/vendor/business/${businessId}/settings`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : null)
      .then(json => { if (json?.data?.profilePicUrl) setProfilePicUrl(json.data.profilePicUrl); })
      .catch(() => {});
  }, [dashboard]);

  const business      = dashboard?.businesses?.[0];
  const businessName  = business?.name || 'Vendor Dashboard';
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
          <div className="flex-shrink-0 rounded-xl p-2" style={{ backgroundColor: '#ffffff' }}>
            {/* <img src="/flash (2).png" alt="OyaEats icon" className="h-7 w-7 object-contain" /> */}
          </div>
          <div className="flex flex-col leading-none">
            <span style={{
              fontFamily: "'Montserrat', 'DM Sans', sans-serif",
              fontWeight: 800, fontSize: '1.15rem',
              letterSpacing: '-0.01em', lineHeight: 1.1,
            }}>
              <span style={{ color: '#ffffff' }}>Oya</span>
              <span style={{ color: '#4ade80' }}>Eat</span>
            </span>
            <span style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600, fontSize: '0.5rem',
              letterSpacing: '0.18em', color: '#a5d6a7', marginTop: '2px',
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

        {/* Business identity card */}
        <div
          className="px-5 py-4 border-b border-[#14491f] flex items-center gap-3"
          style={{ backgroundColor: '#163f22' }}
        >
          <div
            className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center font-bold text-white text-sm"
            style={{ backgroundColor: '#2e7d32' }}
          >
            {profilePicUrl
              ? <img src={profilePicUrl} alt={businessName} className="w-full h-full object-cover" />
              : businessName.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: '#ffffff', fontFamily: "'Montserrat', sans-serif" }}>
              {businessName}
            </p>
            <div className="flex items-center gap-1.5 flex-wrap">
              {phoneVerified ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold border"
                  style={{ backgroundColor: '#1e4d26', color: '#4ade80', borderColor: '#2e7d32' }}>
                  ✓ Verified
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold border bg-rose-900/40 text-rose-300 border-rose-700">
                  Unverified
                </span>
              )}
              {role && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold border"
                  style={{ backgroundColor: '#1e4d26', color: '#a5d6a7', borderColor: '#2e7d32' }}>
                  {role}
                </span>
              )}
            </div>
          </div>
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
                  isActive ? 'bg-[#2e7d32] text-white shadow-sm' : 'text-white hover:bg-[#14491f]'
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
            <Bell className="w-5 h-5 text-[#a5d6a7]" /> Notifications
          </button>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white hover:bg-[#14491f] transition-colors">
            <LogOut className="w-5 h-5 text-[#a5d6a7]" /> Logout
          </button>
          <div className="pt-2 text-xs" style={{ color: '#a5d6a7' }}>
            <p>Admin Portal v1.0</p>
            <p className="mt-1">© 2024 OyaEat</p>
          </div>
        </div>
      </aside>

      {/* ── Main content — NO padding, pages own their own spacing ── */}
      <main className="flex-1 overflow-y-auto p-4" style={{ backgroundColor: '#f0f7f1' }}>
        {children}
      </main>
    </div>
  );
}
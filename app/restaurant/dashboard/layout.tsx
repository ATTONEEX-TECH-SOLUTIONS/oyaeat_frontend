'use client';
import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';
import { vendorApi } from '@/lib/api/vendor';
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
  AlertCircle,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';


const NAV_ITEMS = [
  { icon: LayoutGrid, label: 'Dashboard', href: '/restaurant/dashboard' },
  { icon: UtensilsCrossed, label: 'Menu Management', href: '/restaurant/dashboard/menu' },
  { icon: ShoppingCart, label: 'Orders', href: '/restaurant/dashboard/orders' },
  { icon: Search, label: 'Reviews', href: '/restaurant/dashboard/reviews' },
  { icon: Wallet, label: 'Wallet', href: '/restaurant/dashboard/wallet' },
  { icon: MessageSquare, label: 'Support', href: '/restaurant/dashboard/support' },
  { icon: Settings, label: 'Settings', href: '/restaurant/dashboard/settings' },
];

const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

const playNotificationSound = () => {
  try {
    const audioCtxClass = window.AudioContext || (window as any).webkitAudioContext
    const audioCtx = new audioCtxClass()
    const osc = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()

    // Fetch user volume preference natively
    const volStr = localStorage.getItem('vendor_audio_volume')
    const maxVol = volStr !== null ? parseFloat(volStr) : 0.5

    osc.connect(gainNode)
    gainNode.connect(audioCtx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(800, audioCtx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1)

    gainNode.gain.setValueAtTime(0, audioCtx.currentTime)
    gainNode.gain.linearRampToValueAtTime(maxVol, audioCtx.currentTime + 0.05)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3)

    osc.start(audioCtx.currentTime)
    osc.stop(audioCtx.currentTime + 0.3)
  } catch (e) {
    console.error("Audio API failed:", e)
  }
}


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [dashboard, setDashboard] = useState<any>(null);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const prevCountRef = useRef(0);
  const hasLoadedRef = useRef(false);

  // Global polling for new orders notification
  useEffect(() => {
    const pollForOrders = async () => {
      try {
        const data = await vendorApi.getOrders({ page: 1, limit: 50 });
        const newOrders = Array.isArray(data.orders) ? data.orders : [];
        const activeCount = newOrders.filter(o => ['pending', 'preparing', 'ready', 'out_for_delivery'].includes(o.status)).length;
        const pendingCount = newOrders.filter(o => o.status === 'pending').length;

        setPendingOrdersCount(pendingCount);

        // Only notify for genuinely new Order IDs
        const lastSeenStr = localStorage.getItem('vendor_last_seen_order_id') || '0';
        let lastSeenId = parseInt(lastSeenStr, 10);
        let highestNewId = lastSeenId;
        let newUnreadCount = 0;

        newOrders.forEach(o => {
          if (o.id > lastSeenId) {
            newUnreadCount++;
            if (o.id > highestNewId) highestNewId = o.id;
          }
        });

        if (newUnreadCount > 0) {
          setUnreadNotifications(prev => prev + newUnreadCount);
          localStorage.setItem('vendor_last_seen_order_id', highestNewId.toString());

          toast.success("New Order Received!", {
            description: "You have a new incoming order to fulfill."
          });
          playNotificationSound()
        }
      } catch (e) { }
    };

    pollForOrders();
    const timer = setInterval(pollForOrders, 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('dashboard');
      if (raw) setDashboard(JSON.parse(raw));
    } catch { }
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
      .catch(() => { });
  }, [dashboard]);

  const business = dashboard?.businesses?.[0];
  const businessName = business?.name || 'Vendor Dashboard';
  const phoneVerified = dashboard?.phoneVerified === true;
  const role = dashboard?.role;

  const handleLogout = () => {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('dashboard');
    } catch { }
    router.replace('/restaurant/login');
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#f5faf6' }}>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`w-64 flex flex-col fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:static lg:h-screen'} border-r border-[#1B4332] shadow-2xl lg:shadow-none`}
        style={{ backgroundColor: '#1B4332' }}
      >
        {/* Logo */}
        <div className="px-5 py-5 flex items-center gap-3">
       
          <div className="flex flex-col leading-none">
            <span style={{
              fontFamily: "'Montserrat', 'DM Sans', sans-serif",
              fontWeight: 800, fontSize: '1.15rem',
              letterSpacing: '-0.01em', lineHeight: 1.1,
            }}>
              <span style={{ color: '#ffffff' }}>Oya</span>
              <span style={{ color: '#4ade80' }}>-Eat</span>
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
        <div className="px-5 py-1">
          <p className="text-xs" style={{ color: '#a5d6a7', fontFamily: "'Montserrat', sans-serif", letterSpacing: '0.05em' }}>
            Restaurant Admin
          </p>
        </div>

        {/* Business identity card */}
        <div className="p-4">
          <div className="flex items-center gap-3 p-2.5">
            <div className="w-10 h-10 rounded-full bg-black/20 flex-shrink-0 flex items-center justify-center overflow-hidden border border-[#a5d6a7]/30 shadow-sm">
              {profilePicUrl ? (
                <img src={profilePicUrl} alt={businessName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-bold text-sm">{businessName.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div className="flex flex-col min-w-0 overflow-hidden">
              <span className="text-sm font-extrabold text-white truncate">{businessName}</span>
              <span className="text-[11px] text-[#a5d6a7] font-medium truncate mt-0.5">
                {dashboard?.firstName || 'Restaurant'} {dashboard?.lastName || 'Admin'}
              </span>
            </div>
          </div>
        </div>

        <nav 
          className="flex-1 px-4 pb-4 pt-1 flex flex-col space-y-1 overflow-hidden" 
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-150 text-sm font-medium group',
                  isActive ? 'bg-[#2D6A4F] text-white shadow-sm' : 'text-white/90 hover:bg-white/10 hover:text-white'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-white' : 'text-[#a5d6a7] group-hover:text-white transition-colors')} />
                  <span>{item.label}</span>
                </div>
                {item.label === 'Orders' && pendingOrdersCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                    {pendingOrdersCount}
                  </span>
                )}
              </Link>
            );
          })}
          
          <Link
            href="/restaurant/dashboard/notifications"
            onClick={() => { setMobileMenuOpen(false); setUnreadNotifications(0); }}
            className={cn(
              'flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-150 text-sm font-medium group',
              pathname === '/restaurant/dashboard/notifications' ? 'bg-[#2D6A4F] text-white shadow-sm' : 'text-white/90 hover:bg-white/10 hover:text-white'
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
          
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-100 hover:bg-red-500/10 hover:text-red-400 transition-colors">
            <LogOut className="w-5 h-5 text-[#a5d6a7]" /> Logout
          </button>
          
          <div className="mt-auto pt-6 pb-2 text-xs text-[#a5d6a7]/60 text-center">
            <p className="font-semibold text-[#a5d6a7]/80">Admin Portal v1.0</p>
            <p className="mt-1">© 2024 OyaEat</p>
          </div>
        </nav>
      </aside>

      {/* ── Main content — NO padding, pages own their own spacing ── */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0" style={{ backgroundColor: '#f0f7f1' }}>
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-card border-b border-gray-200 shrink-0 shadow-sm z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="p-2 -ml-2 text-[#1a5c2a] bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <span className="font-extrabold text-gray-900 tracking-tight leading-none text-lg">
              <span className="text-[#2e7d32]">Oya</span>Eat
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#2e7d32] text-white flex items-center justify-center font-bold text-xs ring-2 ring-white shadow-sm">
            {profilePicUrl
              ? <img src={profilePicUrl} alt={businessName} className="w-full h-full object-cover rounded-full" />
              : businessName.charAt(0).toUpperCase()}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
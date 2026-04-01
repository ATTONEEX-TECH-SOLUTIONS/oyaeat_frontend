'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, ShoppingBag, Heart, Settings, Bell, Search, Menu, LogOut, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationName, setLocationName] = useState('Detecting location...');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();
            const city = data.address?.city || data.address?.town || data.address?.state || 'Your Location';
            setLocationName(city);
          } catch {
             setLocationName('Location found');
          }
        },
        () => setLocationName('Location access denied')
      );
    } else {
      setLocationName('Location not supported');
    }

    const userData = localStorage.getItem('customer_user');
    if (!userData) {
      router.push('/customer/login');
    } else {
      setUser(JSON.parse(userData));
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [router]);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer_user');
    router.push('/customer/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/customer/dashboard?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/customer/dashboard`);
    }
  };

  const navigation = [
    { name: 'Overview', href: '/customer/dashboard', icon: Home },
    { name: 'Orders', href: '/customer/dashboard/orders', icon: ShoppingBag },
    { name: 'Favorites', href: '/customer/dashboard/favorites', icon: Heart },
    { name: 'Settings', href: '/customer/dashboard/settings', icon: Settings },
  ];

  if (!user) return <div className="min-h-screen bg-gray-50 flex items-center justify-center font-semibold text-gray-500">Loading...</div>;

  const initials = `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar Navigation */}
      <aside className={`w-64 bg-white border-r border-gray-100 flex flex-col fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:static lg:h-screen'} shadow-[4px_0_24px_rgba(0,0,0,0.02)]`}>
        <div className="p-6 pb-2 border-b border-gray-50">
          <Link href="/customer" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-[#2d5f4f] flex items-center justify-center text-white font-extrabold shadow-md group-hover:scale-105 transition-transform">
              O
            </div>
            <span className="text-xl font-extrabold text-[#2d5f4f] tracking-tight">oyaeat</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Menu</div>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-bold ${
                  isActive 
                    ? 'bg-[#2d5f4f] text-white shadow-md shadow-[#2d5f4f]/20' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 group'
                }`}
              >
                <item.icon className={`h-4 w-4 ${isActive ? 'text-white' : 'group-hover:text-gray-900 transition-colors'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-gray-50">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 font-bold transition-all shadow-sm border border-transparent hover:border-red-100 group">
            <LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen lg:max-w-[calc(100vw-16rem)] overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-40 transition-all">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)} className="lg:hidden text-gray-700 bg-gray-50 rounded-full">
              <Menu className="h-4 w-4" />
            </Button>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 hidden sm:block tracking-tight">
              {pathname.includes('cart') ? 'Your Cart' : 
               pathname.includes('checkout') ? 'Checkout' : 
               'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <form onSubmit={handleSearch} className="relative hidden xl:block w-72 group">
               <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#2d5f4f] transition-colors" />
               <Input 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Search restaurants, food..." 
                 className="w-full pl-10 h-10 bg-gray-100/50 border-gray-200 focus-visible:ring-2 focus-visible:ring-[#2d5f4f]/20 rounded-full shadow-inner font-medium text-sm transition-all"
               />
            </form>

            <Link href="/customer/dashboard/cart" className="relative text-gray-600 hover:text-[#2d5f4f] bg-gray-50 hover:bg-[#2d5f4f]/10 rounded-full h-10 w-10 flex items-center justify-center transition-all cursor-pointer">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
            </Link>

            <Link href="/customer" className="hidden sm:flex text-gray-500 hover:text-gray-900 text-sm font-bold items-center gap-1 group bg-gray-50 px-3 py-2 rounded-full transition-colors border border-gray-100 hover:border-gray-300">
              <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Main Store
            </Link>

            <div className="flex items-center gap-3 pl-4 border-l border-gray-100 hidden sm:flex">
              <div className="text-right">
                <p className="text-sm font-extrabold text-gray-900 leading-tight">{user.firstName} {user.lastName}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{user.phone ? 'Verified ✓' : 'Customer'}</p>
              </div>
              <div className="relative" ref={dropdownRef}>
                <div 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2d5f4f] to-[#1e4035] text-white flex items-center justify-center font-bold text-sm shadow-md border-2 border-white ring-2 ring-gray-50 cursor-pointer hover:scale-105 transition-transform"
                >
                  {initials}
                </div>
                
                {/* Profile Dropdown */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-5 py-3 border-b border-gray-50 mb-1">
                      <p className="text-sm font-extrabold text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="text-xs font-medium text-gray-500 truncate mt-0.5">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link href="/customer/dashboard/orders" onClick={() => setDropdownOpen(false)} className="flex items-center px-5 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-[#2d5f4f] transition-colors">
                        <ShoppingBag className="w-4 h-4 mr-3 text-gray-400" /> My Orders
                      </Link>
                      <Link href="/customer/dashboard/settings" onClick={() => setDropdownOpen(false)} className="flex items-center px-5 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-[#2d5f4f] transition-colors">
                        <Settings className="w-4 h-4 mr-3 text-gray-400" /> Settings
                      </Link>
                    </div>
                    <div className="border-t border-gray-50 mt-1 pt-1">
                      <button onClick={handleLogout} className="w-full flex items-center px-5 py-2 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut className="w-4 h-4 mr-3" /> Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-3 sm:p-5 overflow-auto bg-gray-50/50">
          {children}
        </div>
      </main>
    </div>
  );
}

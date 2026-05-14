'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BarChart3, Users, Bike, ShoppingCart, Settings, LogOut, Building2, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/superadmin/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/superadmin/dashboard/businesses', label: 'Businesses', icon: Building2 },
  { href: '/superadmin/dashboard/restaurants', label: 'Restaurants', icon: Users },
  { href: '/superadmin/dashboard/riders', label: 'Riders', icon: Bike },
  { href: '/superadmin/dashboard/orders', label: 'Customers & Orders', icon: ShoppingCart },
  { href: '/superadmin/dashboard/chat', label: 'Support Inbox', icon: MessageSquare },
  { href: '/superadmin/dashboard/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    try {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
    } catch { }
    router.replace('/superadmin/login')
  }

  return (
    <aside
      className="w-64 h-screen flex flex-col sticky top-0 border-r border-[#14491f]"
      style={{ backgroundColor: '#1a5c2a' }}
    >
      {/* ── Logo area ── */}
      <div
        className="px-5 py-5 border-b border-[#14491f] flex items-center gap-3"
        style={{ backgroundColor: '#14491f' }}
      >
        {/* Icon pill — white background so PNG is always visible */}
        <div
          className="flex-shrink-0 rounded-xl"
          style={{ backgroundColor: '#ffffff' }}
        >
          {/* <img
            src="/flash (2).png"
            alt="OyaEats icon"
            className="h-17 w-17 object-contain"
          /> */}
        </div>

        {/* Wordmark beside the icon */}
        <div className="flex flex-col leading-none">
          <span
            style={{
              fontFamily: "'Montserrat', 'DM Sans', sans-serif",
              fontWeight: 800,
              fontSize: '1.15rem',
              letterSpacing: '-0.01em',
              lineHeight: 1.1,
            }}
          >
            <span style={{ color: '#ffffff' }}>Oya</span>
            <span style={{ color: '#4ade80' }}>Eat</span>
          </span>
          <span
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600,
              fontSize: '0.5rem',
              letterSpacing: '0.18em',
              color: '#a5d6a7',
              marginTop: '2px',
            }}
          >
            FAST DELIVERY
          </span>
        </div>
      </div>

      {/* Super Admin label */}
      <div className="px-5 py-2 border-b border-[#14491f]" style={{ backgroundColor: '#14491f' }}>
        <p
          className="text-xs"
          style={{
            color: '#a5d6a7',
            fontFamily: "'Montserrat', sans-serif",
            letterSpacing: '0.05em',
          }}
        >
          Super Admin
        </p>
      </div>

      {/* ── Navigation ──
          Inactive: white text, subtle green icon
          Active:   green background pill, white text & icon
      */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-150 text-sm font-medium',
                isActive
                  ? 'bg-[#2e7d32] text-white shadow-sm'
                  : 'text-white hover:bg-[#14491f] hover:text-white'
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5 flex-shrink-0',
                  isActive ? 'text-white' : 'text-[#a5d6a7]'
                )}
              />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* ── Footer ── */}
      <div className="p-4 border-t border-[#14491f] shrink-0 mt-auto">
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-[#14491f] hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-2 text-[#a5d6a7]" />
          Logout
        </Button>
        <div className="mt-3 text-xs" style={{ color: '#a5d6a7' }}>
          <p>Admin Portal v1.0</p>
          <p className="mt-1">© 2024 OyaEat</p>
        </div>
      </div>
    </aside>
  )
}
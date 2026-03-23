import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  change: number
  icon: LucideIcon
  trend: 'up' | 'down'
}

export default function StatCard({ title, value, change, icon: Icon, trend }: StatCardProps) {
  const isUp = trend === 'up'

  return (
    <div
      style={{
        backgroundColor: '#fff',
        border: '1px solid #c8e6c9',
        borderRadius: 16,
        padding: '20px 22px',
        boxShadow: '0 1px 4px rgba(26,92,42,0.06)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        position: 'relative',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s, transform 0.2s',
      }}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 20px rgba(26,92,42,0.12)'
        ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(26,92,42,0.06)'
        ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
      }}
    >
      {/* subtle bg decoration */}
      <div
        style={{
          position: 'absolute',
          top: -18,
          right: -18,
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: '#f0faf1',
          opacity: 0.8,
        }}
      />

      {/* Top row: title + icon */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#4a7c59', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
          {title}
        </span>
        <div
          style={{
            backgroundColor: '#e8f5e9',
            borderRadius: 10,
            padding: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Icon size={18} color="#2e7d32" strokeWidth={2} />
        </div>
      </div>

      {/* Value */}
      <p style={{ fontSize: 28, fontWeight: 800, color: '#1a5c2a', margin: 0, lineHeight: 1 }}>
        {value}
      </p>

      {/* Trend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        {isUp
          ? <TrendingUp size={13} color="#2e7d32" strokeWidth={2.5} />
          : <TrendingDown size={13} color="#e53935" strokeWidth={2.5} />
        }
        <span style={{ fontSize: 12, fontWeight: 600, color: isUp ? '#2e7d32' : '#e53935' }}>
          {change === 0 ? '0%' : `${change > 0 ? '+' : ''}${change}%`}
        </span>
        <span style={{ fontSize: 12, color: '#4a7c59', opacity: 0.7 }}>vs last period</span>
      </div>
    </div>
  )
}
'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  CheckCircle, Clock, Truck, Printer, RefreshCw,
  ChevronDown, ChevronUp, MapPin, Phone, User,
  CreditCard, FileText, ArrowRight, XCircle, Package,
} from 'lucide-react'
import { vendorApi, type Order, type OrderStatus } from '@/lib/api/vendor'

// ── Brand tokens ──────────────────────────────────────────────────────────────
const C = {
  green:      '#1B4332',
  greenMid:   '#2D6A4F',
  greenLight: '#52B788',
  amber:      '#D4860B',
  amberLight: '#F4A620',
  bg:         '#F5F1EB',
  white:      '#FFFFFF',
  textDark:   '#111C14',
  textMuted:  '#6B7C6E',
  border:     '#D8E4DC',
  error:      '#C0392B',
}

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CFG: Record<OrderStatus, {
  label: string; color: string; bg: string; icon: React.ElementType
}> = {
  pending:          { label: 'Pending',          color: C.amber,    bg: '#FEF3CD', icon: Clock        },
  preparing:        { label: 'Preparing',        color: '#1A5276',  bg: '#D6EAF8', icon: Package      },
  ready:            { label: 'Ready for Pickup', color: C.greenMid, bg: '#D8F0E4', icon: CheckCircle  },
  out_for_delivery: { label: 'Out for Delivery', color: '#6D4C41',  bg: '#FBE9E7', icon: Truck        },
  delivered:        { label: 'Delivered',        color: C.green,    bg: '#D8F0E4', icon: CheckCircle  },
  cancelled:        { label: 'Cancelled',        color: C.error,    bg: '#FDECEA', icon: XCircle      },
}

function getCfg(status: OrderStatus) {
  return STATUS_CFG[status] ?? STATUS_CFG.pending
}

function nextStatus(status: OrderStatus): OrderStatus | null {
  if (status === 'pending')          return 'preparing'
  if (status === 'preparing')        return 'ready'
  if (status === 'ready')            return 'out_for_delivery'
  if (status === 'out_for_delivery') return 'delivered'
  return null
}

const ALL_STATUSES: Array<{ key: OrderStatus | 'all'; label: string }> = [
  { key: 'all',              label: 'All'             },
  { key: 'pending',          label: 'Pending'         },
  { key: 'preparing',        label: 'Preparing'       },
  { key: 'ready',            label: 'Ready'           },
  { key: 'out_for_delivery', label: 'Out for Delivery'},
  { key: 'delivered',        label: 'Delivered'       },
  { key: 'cancelled',        label: 'Cancelled'       },
]

// ── Stat chip ─────────────────────────────────────────────────────────────────
function StatChip({ label, value, color, bg }: { label: string; value: number; color: string; bg: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border px-4 py-3"
         style={{ borderColor: C.border, backgroundColor: C.white }}>
      <p className="text-xl font-black tracking-tight" style={{ color: C.textDark }}>{value}</p>
      <p className="text-xs font-semibold uppercase tracking-widest" style={{ color }}>{label}</p>
    </div>
  )
}

// ── Order card ────────────────────────────────────────────────────────────────
function OrderCard({
  order, expanded, onToggle, onUpdateStatus,
}: {
  order: Order
  expanded: boolean
  onToggle: () => void
  onUpdateStatus: (status: OrderStatus) => void
}) {
  const cfg  = getCfg(order.status)
  const next = nextStatus(order.status)
  const nextCfg = next ? getCfg(next) : null
  const StatusIcon = cfg.icon
  const canCancel = order.status !== 'cancelled' && order.status !== 'delivered'

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow hover:shadow-md"
         style={{ borderColor: C.border }}>

      {/* ── Row header ───────────────────────────────── */}
      <div
        className="flex cursor-pointer items-center gap-4 px-5 py-4"
        onClick={onToggle}
      >
        {/* Order # badge */}
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-xs font-black text-white"
             style={{ backgroundColor: C.greenMid }}>
          #{order.id}
        </div>

        {/* Customer + meta */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold truncate" style={{ color: C.textDark }}>
            {order.customerName}
          </p>
          <p className="text-xs mt-0.5 truncate" style={{ color: C.textMuted }}>
            {new Date(order.createdAt).toLocaleString('en-NG', {
              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
            })}
            {order.address ? `  ·  ${order.address}` : ''}
          </p>
        </div>

        {/* Status + total + chevron */}
        <div className="flex flex-shrink-0 items-center gap-3">
          <div className="text-right">
            <div className="flex items-center justify-end gap-1.5 mb-0.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-full"
                   style={{ backgroundColor: cfg.bg }}>
                <StatusIcon className="h-3.5 w-3.5" style={{ color: cfg.color }} />
              </div>
              <span className="text-sm font-bold" style={{ color: cfg.color }}>
                {cfg.label}
              </span>
            </div>
            <p className="text-base font-black" style={{ color: C.textDark }}>
              {'\u20A6'}{Number(order.total || 0).toLocaleString('en-NG')}
            </p>
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg"
               style={{ backgroundColor: C.bg }}>
            {expanded
              ? <ChevronUp   className="h-4 w-4" style={{ color: C.textMuted }} />
              : <ChevronDown className="h-4 w-4" style={{ color: C.textMuted }} />
            }
          </div>
        </div>
      </div>

      {/* ── Expanded panel ───────────────────────────── */}
      {expanded && (
        <div className="border-t px-5 py-5 space-y-5"
             style={{ borderColor: C.border, backgroundColor: C.bg }}>

          {/* Customer + delivery */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: C.textMuted }}>
                Customer
              </p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm" style={{ color: C.textMuted }}>
                  <User className="h-3.5 w-3.5 flex-shrink-0" style={{ color: C.greenMid }} />
                  {order.customerName}
                </div>
                {order.customerPhone && (
                  <div className="flex items-center gap-2 text-sm" style={{ color: C.textMuted }}>
                    <Phone className="h-3.5 w-3.5 flex-shrink-0" style={{ color: C.greenMid }} />
                    {order.customerPhone}
                  </div>
                )}
                {order.address && (
                  <div className="flex items-center gap-2 text-sm" style={{ color: C.textMuted }}>
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0" style={{ color: C.greenMid }} />
                    {order.address}
                  </div>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: C.textMuted }}>
                Payment
              </p>
              <div className="flex items-center gap-2 text-sm" style={{ color: C.textMuted }}>
                <CreditCard className="h-3.5 w-3.5 flex-shrink-0" style={{ color: C.greenMid }} />
                {order.paymentMethod || '—'}
              </div>
              {order.notes && (
                <div className="mt-2 flex items-start gap-2 text-sm" style={{ color: C.textMuted }}>
                  <FileText className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" style={{ color: C.greenMid }} />
                  {order.notes}
                </div>
              )}
            </div>
          </div>

          {/* Items */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: C.textMuted }}>
              Items
            </p>
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: C.border }}>
              {(order.items || []).map((it, i) => (
                <div
                  key={it.id}
                  className="flex items-center justify-between px-4 py-3"
                  style={{
                    borderBottom: i < (order.items?.length ?? 0) - 1 ? `1px solid ${C.border}` : undefined,
                    backgroundColor: C.white,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-black text-white"
                         style={{ backgroundColor: C.greenMid }}>
                      {it.quantity}
                    </div>
                    <span className="text-sm font-medium" style={{ color: C.textDark }}>{it.name}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: C.textDark }}>
                    {'\u20A6'}{Number(it.price || 0).toLocaleString('en-NG')}
                  </span>
                </div>
              ))}
              {/* Total row */}
              <div className="flex items-center justify-between px-4 py-3"
                   style={{ backgroundColor: '#F0F7F3', borderTop: `1px solid ${C.border}` }}>
                <span className="text-sm font-bold" style={{ color: C.textDark }}>Total</span>
                <span className="text-base font-black" style={{ color: C.green }}>
                  {'\u20A6'}{Number(order.total || 0).toLocaleString('en-NG')}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-1">
            {/* Print */}
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors"
              style={{ borderColor: C.border, backgroundColor: C.white, color: C.textMuted }}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = '#F0F7F3')}
              onMouseOut={e  => (e.currentTarget.style.backgroundColor = C.white)}
            >
              <Printer className="h-4 w-4" />
              Print Receipt
            </button>

            {/* Advance status */}
            {next && nextCfg && (
              <button
                onClick={() => onUpdateStatus(next)}
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: C.green }}
              >
                <ArrowRight className="h-4 w-4" />
                Move to: {nextCfg.label}
              </button>
            )}

            {/* Cancel */}
            {canCancel && (
              <button
                onClick={() => onUpdateStatus('cancelled')}
                className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition-colors"
                style={{ borderColor: '#FECACA', backgroundColor: '#FEF2F2', color: C.error }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = '#FEE2E2')}
                onMouseOut={e  => (e.currentTarget.style.backgroundColor = '#FEF2F2')}
              >
                <XCircle className="h-4 w-4" />
                Cancel Order
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function OrdersPage() {
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null)
  const [orders, setOrders]               = useState<Order[]>([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState('')
  const [statusFilter, setStatusFilter]   = useState<OrderStatus | 'all'>('all')

  const load = async () => {
    setError('')
    setLoading(true)
    try {
      const data = await vendorApi.getOrders({
        status: statusFilter === 'all' ? undefined : statusFilter,
        page: 1,
        limit: 50,
      })
      setOrders(Array.isArray(data.orders) ? data.orders : [])
    } catch (e: any) {
      setError(e?.message || 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [statusFilter])

  const counts = useMemo(() => {
    const active    = orders.filter(o => ['pending','preparing','ready','out_for_delivery'].includes(o.status)).length
    const delivered = orders.filter(o => o.status === 'delivered').length
    const pending   = orders.filter(o => o.status === 'pending').length
    const cancelled = orders.filter(o => o.status === 'cancelled').length
    return { active, delivered, pending, cancelled, total: orders.length }
  }, [orders])

  const updateStatus = async (orderId: number, newStatus: OrderStatus) => {
    try {
      const res = await vendorApi.updateOrderStatus(orderId, newStatus)
      setOrders(prev => prev.map(o => o.id === orderId ? res.order : o))
    } catch (e: any) {
      alert(e?.message || 'Failed to update order status')
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.bg }}>
      <div className="p-6">

        {/* ── Page header ─────────────────────────────── */}
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-1" style={{ color: C.greenLight }}>
            Vendor Portal
          </p>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: C.textDark }}>
            Order Management
          </h1>
          <p className="mt-1 text-sm" style={{ color: C.textMuted }}>
            View and manage all customer orders.
          </p>
        </div>

        {/* ── Stat chips ──────────────────────────────── */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <StatChip label="Total"     value={counts.total}     color={C.green}    bg="#D8F0E4" />
          <StatChip label="Active"    value={counts.active}    color="#1A5276"    bg="#D6EAF8" />
          <StatChip label="Delivered" value={counts.delivered} color={C.greenMid} bg="#D8F0E4" />
          <StatChip label="Cancelled" value={counts.cancelled} color={C.error}    bg="#FDECEA" />
        </div>

        {/* ── Filter + refresh ─────────────────────────── */}
        <div className="flex gap-3 mb-5">
          {/* Tab strip */}
          <div className="flex gap-1 rounded-2xl p-1.5 border flex-1 overflow-x-auto shadow-sm"
               style={{ backgroundColor: C.white, borderColor: C.border }}>
            {ALL_STATUSES.map(s => (
              <button
                key={s.key}
                onClick={() => setStatusFilter(s.key as any)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 whitespace-nowrap flex-shrink-0"
                style={{
                  backgroundColor: statusFilter === s.key ? C.green : 'transparent',
                  color:           statusFilter === s.key ? C.white : C.textMuted,
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 h-10 rounded-xl border px-4 text-sm font-semibold transition-colors flex-shrink-0"
            style={{ borderColor: C.border, backgroundColor: C.white, color: C.greenMid }}
            onMouseOver={e => (e.currentTarget.style.backgroundColor = '#F0F7F3')}
            onMouseOut={e  => (e.currentTarget.style.backgroundColor = C.white)}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {/* ── Error ───────────────────────────────────── */}
        {error && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium"
               style={{ borderColor: '#FECACA', backgroundColor: '#FEF2F2', color: C.error }}>
            <XCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* ── Results count ─────────────────────────────── */}
        {!loading && (
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: C.textMuted }}>
            {orders.length} {orders.length === 1 ? 'order' : 'orders'}
          </p>
        )}

        {/* ── Loading ──────────────────────────────────── */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <RefreshCw className="h-6 w-6 animate-spin" style={{ color: C.greenMid }} />
              <p className="text-sm font-medium" style={{ color: C.textMuted }}>Loading orders...</p>
            </div>
          </div>
        )}

        {/* ── Empty ────────────────────────────────────── */}
        {!loading && orders.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border py-16 text-center"
               style={{ borderColor: C.border, backgroundColor: C.white }}>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full"
                 style={{ backgroundColor: C.border }}>
              <Package className="h-6 w-6" style={{ color: C.textMuted }} />
            </div>
            <p className="text-base font-bold" style={{ color: C.textDark }}>No orders found</p>
            <p className="mt-1 text-sm" style={{ color: C.textMuted }}>
              Orders will appear here once customers start placing them.
            </p>
          </div>
        )}

        {/* ── Orders list ──────────────────────────────── */}
        {!loading && orders.length > 0 && (
          <div className="space-y-3">
            {orders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                expanded={expandedOrder === order.id}
                onToggle={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                onUpdateStatus={(s) => updateStatus(order.id, s)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
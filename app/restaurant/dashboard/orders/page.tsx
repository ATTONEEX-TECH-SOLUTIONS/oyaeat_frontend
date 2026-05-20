'use client'

import { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import { toast } from 'sonner'
import {
  CheckCircle, Clock, Truck, Printer, RefreshCw,
  ChevronDown, ChevronUp, MapPin, Phone, User,
  XCircle, Package, ArrowRight, Loader2
} from 'lucide-react'
import { vendorApi, type Order, type OrderStatus } from '@/lib/api/vendor'

const playNotificationSound = () => {
  try {
    const audioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    const audioCtx = new audioCtxClass();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    
    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.3);
  } catch (e) {
    console.error("Audio API failed:", e);
  }
}

const C = {
  green:      '#1B4332',
  greenMid:   '#2D6A4F',
  greenLight: '#52B788',
  amber:      '#D4860B',
  amberLight: '#F4A620',
  bg:         '#F5F1EB',
  white:      '#FFFFFF',
  textDark:   'inherit',
  textMuted:  '#6B7C6E',
  border:     '#D8E4DC',
  error:      '#C0392B',
}

const STATUS_CFG: Record<OrderStatus, {
  label: string; color: string; bg: string; icon: React.ElementType
}> = {
  pending:          { label: 'Pending',          color: C.amber,    bg: '#FEF3CD', icon: Clock        },
  preparing:        { label: 'Preparing',        color: '#1A5276',  bg: '#D6EAF8', icon: Package      },
  ready:            { label: 'Ready for Pickup', color: C.greenMid, bg: '#D8F0E4', icon: CheckCircle  },
  out_for_delivery: { label: 'Out for Delivery', color: '#6D4C41',  bg: '#FBE9E7', icon: Truck        },
  delivered:        { label: 'Delivered',        color: C.green,    bg: '#D8F0E4', icon: CheckCircle  },
  cancelled:        { label: 'Cancelled',        color: '#C0392B',  bg: '#FADBD8', icon: XCircle      },
}

function getCfg(status: OrderStatus) {
  return STATUS_CFG[status] ?? STATUS_CFG.pending
}

function nextStatus(status: OrderStatus): OrderStatus | null {
  if (status === 'pending')          return 'preparing'
  if (status === 'preparing')        return 'ready'
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

export default function RestaurantOrdersDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [expandedOrders, setExpandedOrders] = useState<Record<number, boolean>>({});
  const [isSyncing, setIsSyncing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  const baselineOrderIds = useRef<Set<number>>(new Set());
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  // Fixed fetch wrapper to accurately read your nested { orders: Order[] } shape
  const fetchOrders = useCallback(async (silent = false) => {
    if (!silent) setIsSyncing(true);
    try {
      const responsePayload = await vendorApi.getOrders();
      const freshOrders: Order[] = responsePayload?.orders || [];
      
      if (baselineOrderIds.current.size > 0) {
        const hasNewPending = freshOrders.some(
          (o) => !baselineOrderIds.current.has(o.id) && o.status === 'pending'
        );
        
        if (hasNewPending) {
          playNotificationSound();
          toast.success("New Incoming Order!", {
            description: "An automated workflow step sequence has been queued.",
            duration: 5000
          });
        }
      }

      baselineOrderIds.current = new Set(freshOrders.map((o) => o.id));
      setOrders(freshOrders);
    } catch (err: any) {
      console.error("API Fetch Error:", err);
    } finally {
      if (!silent) setIsSyncing(false);
      setInitialLoading(false);
    }
  }, []);

  // ── UPDATED: INJECTS SPATIAL MATCH DISPATCH PINGS UPON ADVANCING ──
  const handleUpdateStatus = async (orderId: number, targetStatus: OrderStatus) => {
    try {
      setIsSyncing(true);
      await vendorApi.updateOrderStatus(orderId, targetStatus);
      
      // If advanced to READY, trigger proximity search algorithms down Express server [INDEX]
      if (targetStatus === 'ready') {
        const token = localStorage.getItem("authToken") || localStorage.getItem("vendorToken");
        
        const dispatchResponse = await fetch(`${API_BASE_URL}/orders/${orderId}/dispatch`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token || ""}`,
            "Content-Type": "application/json"
          }
        });

        if (dispatchResponse.ok) {
          const dispatchData = await dispatchResponse.json();
          toast.success(`Food Ready! Alerted ${dispatchData.notifiedRidersCount || 0} nearby online riders via sockets.`, {
            duration: 4000
          });
        }
      }

      await fetchOrders(true);
    } catch (err) {
      toast.error("Failed to advance order lifecycle status step.");
    } finally {
      setIsSyncing(false);
    }
  };

  // Automated Polling Engine: Automatically advances statuses over time
  useEffect(() => {
    fetchOrders(false);

    const syncInterval = setInterval(() => {
      fetchOrders(true);
    }, 5000); // Polls every 5 seconds for instant rider-accept visibility

    const autoPipelineInterval = setInterval(() => {
      setOrders((currentOrders) => {
        currentOrders.forEach((order) => {
          const now = Date.now();
          const creationTime = new Date(order.createdAt).getTime();
          const elapsedMinutes = (now - creationTime) / 60000;

          // Auto-confirm: Move from pending to preparing after 1 minute
          if (order.status === 'pending' && elapsedMinutes >= 1) {
            handleUpdateStatus(order.id, 'preparing');
          }
          // Auto-ready: Move from preparing to ready after 5 minutes
          else if (order.status === 'preparing' && elapsedMinutes >= 5) {
            handleUpdateStatus(order.id, 'ready');
          }
        });
        return currentOrders;
      });
    }, 15000); // Check order age thresholds every 15 seconds

    return () => {
      clearInterval(syncInterval);
      clearInterval(autoPipelineInterval);
    };
  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    if (filterStatus === 'all') return orders;
    return orders.filter((o) => o.status === filterStatus);
  }, [orders, filterStatus]);

  if (initialLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F5F1EB]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-800" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: C.bg }}>
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border" style={{ borderColor: C.border }}>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Kitchen Display Engine</h1>
            <p className="text-xs font-bold text-green-700 mt-1 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
              Automated State Machine & Rider Pipeline Active
            </p>
          </div>
          <button 
            onClick={() => fetchOrders(false)}
            disabled={isSyncing}
            className="flex items-center gap-2 text-sm font-bold border px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 disabled:opacity-50"
            style={{ borderColor: C.border }}
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} style={{ color: C.greenMid }} />
            Sync Now
          </button>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap gap-2">
          {ALL_STATUSES.map((status) => (
            <button
              key={status.key}
              onClick={() => setFilterStatus(status.key)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl border transition-colors ${
                filterStatus === status.key ? 'text-white border-transparent' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              style={filterStatus === status.key ? { backgroundColor: C.green } : { borderColor: C.border }}
            >
              {status.label}
            </button>
          ))}
        </div>

        {/* Orders Layout Grid */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const expanded = !!expandedOrders[order.id];
              const cfg = getCfg(order.status);
              const next = nextStatus(order.status);
              const nextCfg = next ? getCfg(next) : null;

              return (
                <div key={order.id} className="overflow-hidden rounded-2xl border bg-white shadow-sm hover:shadow-md transition-shadow" style={{ borderColor: C.border }}>
                  <div className="flex cursor-pointer items-center gap-4 px-5 py-4" onClick={() => setExpandedOrders(p => ({ ...p, [order.id]: !p[order.id] }))}>
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-xs font-black text-white" style={{ backgroundColor: C.greenMid }}>
                      #{order.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{order.customerName}</p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">
                        {new Date(order.createdAt).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}
                        {order.address ? ` · ${order.address}` : ''}
                      </p>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full inline-block mb-1" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                          {cfg.label}
                        </span>
                        <p className="text-sm font-black text-gray-900">
                          ₦{Number(order.total || 0).toLocaleString('en-NG')}
                        </p>
                      </div>
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50">
                        {expanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                      </div>
                    </div>
                  </div>

                  {expanded && (
                    <div className="border-t px-5 py-5 space-y-4 bg-gray-50" style={{ borderColor: C.border }}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
                        <div className="space-y-1">
                          <p className="flex items-center gap-2"><User className="w-3.5 h-3.5 text-gray-400" /> <span className="font-bold">Customer:</span> {order.customerName}</p>
                          <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-gray-400" /> <span className="font-bold">Phone:</span> {order.customerPhone || "N/A"}</p>
                          <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-gray-400" /> <span className="font-bold">Destination:</span> {order.address || "N/A"}</p>
                        </div>
                        <div className="bg-white p-3 rounded-xl border space-y-1" style={{ borderColor: C.border }}>
                          <p className="font-bold text-gray-700 border-b pb-1 mb-1">Items Summary:</p>
                          {order.items?.map((item) => (
                            <p key={item.id} className="text-[11px] flex justify-between">
                              <span>{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                              <span className="font-semibold">₦{(item.price * item.quantity).toLocaleString()}</span>
                            </p>
                          ))}
                        </div>
                      </div>
                      
                      {order.notes && (
                        <div className="text-xs bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-xl">
                          <span className="font-bold text-amber-900">Kitchen Notes:</span> {order.notes}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 pt-2 border-t" style={{ borderColor: C.border }}>
                        {next && nextCfg ? (
                          <button
                            onClick={() => handleUpdateStatus(order.id, next)}
                            className="flex items-center gap-2 text-xs font-bold text-white px-4 py-2.5 rounded-xl hover:brightness-110 shadow-sm"
                            style={{ backgroundColor: nextCfg.color }}
                          >
                            Advance to {nextCfg.label} <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        ) : order.status === 'ready' ? (
                          // ── DESIGN STATE INJECTION: ALERTS MATCHES VISUALLY ON TRUCKING LOG LAYOUTS ──
                          <div className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-4 py-2.5 rounded-xl flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            Broadcasted to Marketplace. Scanning for nearby online Riders...
                          </div>
                        ) : null}

                        {order.status !== 'cancelled' && order.status !== 'delivered' && order.status !== 'out_for_delivery' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'cancelled')}
                            className="text-xs font-bold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-xl ml-auto"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border text-gray-400 text-sm" style={{ borderColor: C.border }}>
              No orders found matching this tab criteria.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

'use client'

import { useEffect, useState } from 'react'
import { vendorApi, type WalletData } from '@/lib/api/vendor'
import { Wallet, ArrowDownLeft, ArrowUpRight, Clock, RefreshCw, XCircle, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'

const C = {
  green:      '#1B4332',
  greenMid:   '#2D6A4F',
  greenLight: '#52B788',
  bg:         '#f0f7f1',
  white:      '#FFFFFF',
  textDark:   '#111827',
  textMuted:  '#6B7C6E',
  border:     '#c8e6c9',
  error:      '#C0392B',
}

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [withdrawing, setWithdrawing] = useState(false)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await vendorApi.getWallet()
      setWallet(res.wallet || null)
    } catch (e: any) {
      if (e?.message?.toLowerCase().includes('not found') || e?.message?.includes('404')) {
        // Treat 404 as "no wallet setup yet" or empty state
        setWallet(null)
      } else {
        setError(e?.message || 'Failed to load wallet data')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleWithdraw = async () => {
    if (!wallet || wallet.balance <= 0) return
    setWithdrawing(true)
    try {
      await vendorApi.requestWithdrawal(wallet.balance)
      alert("Withdrawal request submitted successfully!")
      load()
    } catch (e: any) {
      alert(e?.message || "Failed to submit withdrawal request")
    } finally {
      setWithdrawing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <RefreshCw className="h-8 w-8 animate-spin" style={{ color: C.greenMid }} />
        <p className="font-medium" style={{ color: C.textMuted }}>Loading wallet...</p>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6 pb-10">
      
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-black tracking-tight" style={{ color: C.green }}>Wallet & Earnings</h1>
        <p className="mt-1 text-sm font-medium" style={{ color: C.textMuted }}>Manage your restaurant earnings and request payouts.</p>
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border p-12 text-center shadow-sm" style={{ backgroundColor: C.white, borderColor: C.border }}>
          <XCircle className="mb-3 h-12 w-12" style={{ color: C.error }} />
          <h2 className="text-xl font-bold" style={{ color: C.textDark }}>Failed to load wallet</h2>
          <p className="mt-2 text-sm" style={{ color: C.textMuted }}>{error}</p>
          <Button onClick={load} className="mt-6" variant="outline" style={{ borderColor: C.greenMid, color: C.greenMid }}>
            Try Again
          </Button>
        </div>
      ) : !wallet ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border p-12 text-center shadow-sm" style={{ backgroundColor: C.white, borderColor: C.border }}>
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: C.bg }}>
            <Wallet className="h-8 w-8" style={{ color: C.greenMid }} />
          </div>
          <h2 className="text-xl font-bold" style={{ color: C.textDark }}>No Wallet Data</h2>
          <p className="mt-2 max-w-md text-sm" style={{ color: C.textMuted }}>Your wallet tracking will begin automatically once your first orders are delivered and paid.</p>
          <Button onClick={load} className="mt-6 gap-2" style={{ backgroundColor: C.green, color: C.white }}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>
      ) : (
        <>
          {/* ── Balance Cards ── */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Available */}
            <div className="flex flex-col justify-between rounded-2xl border p-6 shadow-sm relative overflow-hidden" style={{ backgroundColor: C.green, borderColor: C.green }}>
              <div className="absolute right-0 top-0 opacity-10">
                <DollarSign className="h-48 w-48 -mr-10 -mt-10" />
              </div>
              <div className="relative z-10 space-y-1">
                <p className="text-sm font-bold uppercase tracking-widest text-[#a5d6a7]">Available Balance</p>
                <div className="flex items-end gap-2">
                  <p className="text-4xl font-black text-white">
                    ₦{Math.round(wallet.balance).toLocaleString('en-NG')}
                  </p>
                </div>
              </div>
              <div className="relative z-10 mt-8">
                <Button 
                  onClick={handleWithdraw} 
                  disabled={wallet.balance <= 0 || withdrawing}
                  className="w-full sm:w-auto font-bold transition-all disabled:opacity-50"
                  style={{ backgroundColor: C.white, color: C.green }}
                >
                  {withdrawing ? 'Processing...' : 'Request Payout'}
                </Button>
              </div>
            </div>

            {/* Pending */}
            <div className="flex flex-col justify-between rounded-2xl border p-6 shadow-sm" style={{ backgroundColor: C.white, borderColor: C.border }}>
               <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <p className="text-sm font-bold uppercase tracking-widest" style={{ color: C.textMuted }}>Pending Payouts</p>
                </div>
                <p className="text-3xl font-black" style={{ color: C.textDark }}>
                  ₦{Math.round(wallet.pendingPayouts).toLocaleString('en-NG')}
                </p>
              </div>
              <div className="mt-4">
                 <p className="text-xs" style={{ color: C.textMuted }}>These funds are currently being processed by the system.</p>
              </div>
            </div>
          </div>

          {/* ── Transactions ── */}
          <div className="rounded-2xl border shadow-sm overflow-hidden" style={{ backgroundColor: C.white, borderColor: C.border }}>
            <div className="border-b px-6 py-4" style={{ borderColor: C.border }}>
              <h3 className="font-bold text-lg" style={{ color: C.textDark }}>Recent Transactions</h3>
            </div>
            
            {wallet.transactions.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-sm font-medium" style={{ color: C.textMuted }}>No transactions found.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#e8f5e9]">
                {wallet.transactions.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full" 
                           style={{ backgroundColor: t.type === 'credit' ? '#D8F0E4' : '#FDECEA' }}>
                        {t.type === 'credit' 
                          ? <ArrowDownLeft className="h-5 w-5" style={{ color: C.greenMid }} />
                          : <ArrowUpRight  className="h-5 w-5" style={{ color: C.error }} />}
                      </div>
                      <div>
                        <p className="font-bold text-sm" style={{ color: C.textDark }}>{t.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs" style={{ color: C.textMuted }}>
                            {new Date(t.createdAt).toLocaleString()}
                          </p>
                          <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded"
                                style={{ 
                                  backgroundColor: t.status === 'completed' ? '#D8F0E4' : t.status === 'pending' ? '#FEF3CD' : '#FDECEA',
                                  color: t.status === 'completed' ? C.greenMid : t.status === 'pending' ? '#D4860B' : C.error
                                }}>
                            {t.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-base" style={{ color: t.type === 'credit' ? C.greenMid : C.textDark }}>
                        {t.type === 'credit' ? '+' : '-'}₦{Math.round(t.amount).toLocaleString('en-NG')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

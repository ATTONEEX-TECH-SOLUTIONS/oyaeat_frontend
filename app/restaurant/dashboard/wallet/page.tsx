'use client'

import { useEffect, useState } from 'react'
import { vendorApi, type WalletData } from '@/lib/api/vendor'
import { Wallet, RefreshCw, XCircle, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'

import BalanceCard from '../components/wallet/BalanceCard'
import TransactionList from '../components/wallet/TransactionList'

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [withdrawing, setWithdrawing] = useState(false)
  
  const [hasBankDetails, setHasBankDetails] = useState(false)
  const [linkedBankText, setLinkedBankText] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await vendorApi.getWallet()
      setWallet(res.wallet || null)
      setHasBankDetails(res.hasBankDetails || false)
      setLinkedBankText(res.linkedBankAccount || '')
    } catch (e: any) {
      if (e?.message?.toLowerCase().includes('not found') || e?.message?.includes('404')) {
        setWallet(null)
      } else {
        setError(e?.message || 'Failed to load wallet data')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

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
        <RefreshCw className="h-8 w-8 animate-spin text-[#2D6A4F]" />
        <p className="font-medium text-[#6B7C6E]">Loading wallet...</p>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-[#1B4332]">Wallet & Earnings</h1>
        <p className="mt-1 text-sm font-medium text-[#6B7C6E]">Manage your restaurant earnings and request payouts.</p>
      </div>

      {/* ── 🌟 NEW: INFORMATIONAL BANNER DISPLAYING BOUND BANK DETAILS FROM ADMIN EMAIL LINKING ── */}
      <div className={`rounded-xl p-4 flex items-start gap-3 max-w-xl border ${
        hasBankDetails ? 'bg-gray-50 border-gray-200' : 'bg-red-50 border-red-200'
      }`}>
        <Info className={`w-5 h-5 mt-0.5 flex-shrink-0 ${hasBankDetails ? 'text-[#2D6A4F]' : 'text-red-600'}`} />
        <div>
          <h4 className="text-sm font-bold text-gray-900">Settlement Destination Profile</h4>
          <p className={`text-xs mt-1 ${hasBankDetails ? 'text-gray-600' : 'text-red-600 font-semibold'}`}>
            {hasBankDetails 
              ? `Your wallet payouts are pinned to: ${linkedBankText}.` 
              : "No verified settlement bank linked yet. Please submit your business bank details to support via email."}
          </p>
        </div>
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border p-12 text-center bg-white border-[#c8e6c9]">
          <XCircle className="mb-3 h-12 w-12 text-[#C0392B]" />
          <h2 className="text-xl font-bold text-gray-900">Failed to load wallet</h2>
          <p className="mt-2 text-sm text-[#6B7C6E]">{error}</p>
          <Button onClick={load} className="mt-6" variant="outline" style={{ borderColor: '#2D6A4F', color: '#2D6A4F' }}>Try Again</Button>
        </div>
      ) : !wallet ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border p-12 text-center bg-white border-[#c8e6c9]">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f0f7f1]">
            <Wallet className="h-8 w-8 text-[#2D6A4F]" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">No Wallet Data</h2>
          <p className="mt-2 max-w-md text-sm text-[#6B7C6E]">Your wallet tracking will begin automatically once your first orders are delivered and paid.</p>
          <Button onClick={load} className="mt-6 gap-2 bg-[#1B4332] text-white"><RefreshCw className="h-4 w-4" /> Refresh</Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <BalanceCard 
              type="available" 
              amount={wallet.balance} 
              hasBankDetails={hasBankDetails} 
              withdrawing={withdrawing} 
              onWithdraw={handleWithdraw} 
              onLinkBank={() => alert("Please submit your updated bank information to support via your registered email.")} 
            />
            <BalanceCard type="pending" amount={wallet.pendingPayouts} />
          </div>

          <TransactionList transactions={wallet.transactions} />
        </>
      )}
    </div>
  )
}
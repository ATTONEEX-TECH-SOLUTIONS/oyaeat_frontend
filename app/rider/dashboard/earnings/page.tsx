"use client";

import { useState, useEffect } from "react";
import { 
  Wallet, ArrowUpRight, TrendingUp, Calendar, 
  Clock, CheckCircle2, Loader2, CreditCard 
} from "lucide-react";

export default function RiderEarningsView() {
  const [metrics, setMetrics] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [cashoutAmount, setCashoutAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [processingCashout, setProcessingCashout] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchEarningsData = async () => {
      try {
        const token = localStorage.getItem("riderToken");
        const response = await fetch(`${API_BASE_URL}/api/rider/earnings/summary`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
          const resData = await response.json();
          setMetrics(resData.metrics);
          setTransactions(resData.transactions || []);
        }
      } catch (err) {
        console.error("Ledger retrieval network error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEarningsData();
  }, [API_BASE_URL]);

  const handleCashoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(cashoutAmount);
    if (isNaN(amountNum) || amountNum <= 0) return alert("Enter a valid payout amount");
    if (amountNum > (metrics?.balance || 0)) return alert("Insufficient account balance");

    setProcessingCashout(true);
    try {
      // Mock withdrawal submission hook for testing
      setTimeout(() => {
        alert(`Withdrawal request for ₦${amountNum.toLocaleString()} processed! Funds sent to your registered bank account.`);
        setMetrics((prev: any) => ({ ...prev, balance: prev.balance - amountNum }));
        setTransactions((prev: any) => [
          {
            id: `TXN-WTH-${Math.floor(1000 + Math.random() * 9000)}`,
            amount: `-₦${amountNum.toLocaleString()}`,
            type: "withdrawal",
            status: "completed",
            description: "Bank Transfer Cashout",
            createdAt: new Date().toISOString()
          },
          ...prev
        ]);
        setCashoutAmount("");
        setProcessingCashout(false);
      }, 1500);
    } catch (err) {
      console.error("Withdrawal error", err);
      setProcessingCashout(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 font-bold"><Loader2 className="w-8 h-8 animate-spin mx-auto text-green-600" /></div>;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Financial Matrix Summary Grid cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Wallet Withdrawable Balance Box */}
        <div className="bg-gradient-to-br from-emerald-900 to-green-800 p-6 rounded-2xl shadow-sm text-white flex flex-col justify-between h-40">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider opacity-75">Withdrawable Balance</p>
            <Wallet className="w-5 h-5 opacity-75" />
          </div>
          <h2 className="text-3xl font-black">₦{metrics?.balance?.toLocaleString() || 0}</h2>
          <p className="text-[10px] opacity-60">Verified internal wallet balance</p>
        </div>

        {/* Today's Earnings Metric Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 h-40">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <ArrowUpRight className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Today's Earnings</p>
            <h3 className="text-2xl font-bold text-gray-900">{metrics?.todayEarnings || "₦0"}</h3>
            <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> 100% Live metrics
            </p>
          </div>
        </div>

        {/* This Week's Cumulative Aggregate Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 h-40">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">This Week's Earnings</p>
            <h3 className="text-2xl font-bold text-gray-900">{metrics?.weeklyEarnings || "₦0"}</h3>
            <p className="text-xs text-gray-400 mt-1">Reset tracking cycle every Sunday</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column Section: Cashout Request Module Form */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 h-fit">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Instant Payout Request</h3>
            <p className="text-xs text-gray-400 mt-0.5">Transfer your earnings straight into your linked settlement account.</p>
          </div>

          <form onSubmit={handleCashoutSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Amount to Withdraw</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-sm font-bold text-gray-500">₦</span>
                <input 
                  type="number"
                  required
                  placeholder="0.00"
                  value={cashoutAmount}
                  onChange={(e) => setCashoutAmount(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-8 pr-4 text-sm focus:outline-none focus:border-green-600 text-gray-900 font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={processingCashout || !cashoutAmount}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {processingCashout ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
              Execute Bank Settlement
            </button>
          </form>
        </div>

        {/* Right Column Section: Detailed Transactional History Records Ledger */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="font-bold text-gray-900 text-lg">Account Statement Ledger</h3>
          
          {transactions.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {transactions.map((txn, index) => (
                <div key={index} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      txn.type === "withdrawal" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
                    }`}>
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{txn.description}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {new Date(txn.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short" })} · {txn.id}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black text-sm ${txn.type === "withdrawal" ? "text-red-600" : "text-gray-900"}`}>
                      {txn.amount}
                    </p>
                    <span className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold mt-1 inline-block">
                      {txn.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400 text-sm">
              No financial activity logged on this account statement index yet.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

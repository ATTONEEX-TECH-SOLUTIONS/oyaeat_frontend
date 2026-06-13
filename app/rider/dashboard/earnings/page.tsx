'use client'

import { useState, useEffect } from "react";
import { walletApi } from "@/lib/api/walletService"; 
import { RefreshCw, ShieldCheck, AlertCircle, HelpCircle } from "lucide-react";
import FinancialGrid from "../components/rider/FinaincialGrid";
import CashoutForm from "../components/rider/CashoutForm";
import LedgerHistory from "../components/rider/LedgerHistory";

export default function RiderEarningsView() {
  const [metrics, setMetrics] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [linkedBankText, setLinkedBankText] = useState("");
  const [hasBankDetails, setHasBankDetails] = useState(false);
  const [processingCashout, setProcessingCashout] = useState(false);
  const [loading, setLoading] = useState(true);

    const fetchRiderLedger = async () => {
    try {
      setLoading(true);
      const data = await walletApi.getWalletSummary("riderToken"); 
      
      setMetrics({
        balance: data.wallet?.balance || 0,
        todayEarnings: data.todayEarnings || "₦0", 
        weeklyEarnings: data.weeklyEarnings || "₦0"
      });
      setTransactions(data.wallet?.transactions || []);
      
      // 🌟 FIX: Updated from data.linkedBankAccount to match your backend JSON key!
      setLinkedBankText(data.linkedBankAccount || ""); 
      setHasBankDetails(data.hasBankDetails || false);
    } catch (err) {
      console.error("Failed to track rider statement details", err);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchRiderLedger();
  }, []);

  const handleCashoutSubmission = async (amountNum: number) => {
    setProcessingCashout(true);
    try {
      await walletApi.submitWithdrawal(amountNum, "riderToken");
      alert("Withdrawal request dispatched to admin pool successfully!");
      fetchRiderLedger(); 
    } catch (err: any) {
      alert(err.message || "Failed to process transaction dispatch");
    } finally {
      setProcessingCashout(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <RefreshCw className="h-8 w-8 animate-spin text-emerald-700" />
        <p className="text-sm font-medium text-gray-500">Loading your earnings engine...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Page Title & Context Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-gray-950">Earnings & Payout Control</h1>
        <p className="mt-1 text-sm font-medium text-gray-500">Track your delivery order split balances and request manual payouts.</p>
      </div>

      {/* ─LIVE BANK ACCOUNT BINDING CARD ── */}
      <div className={`border rounded-2xl p-4 flex items-start gap-3 transition-all ${
        hasBankDetails 
          ? "bg-emerald-50/60 border-emerald-100" 
          : "bg-amber-50/60 border-amber-100"
      }`}>
        <div className="mt-0.5 flex-shrink-0">
          {hasBankDetails 
            ? <ShieldCheck className="w-5 h-5 text-emerald-700" /> 
            : <AlertCircle className="w-5 h-5 text-amber-600" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-gray-900">Settlement Account Node</h4>
          <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
            {hasBankDetails 
              ? `Your delivery payouts are currently bound to: ` 
              : "No bank verification records found. To receive split cashouts, send your banking parameters to your super-admin via email."}
            {hasBankDetails && <span className="font-mono bg-emerald-100 text-emerald-950 px-1.5 py-0.5 rounded font-bold text-[11px] inline-block mt-1 sm:mt-0">{linkedBankText}</span>}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-[11px] text-gray-400 font-semibold cursor-help bg-white border px-2.5 py-1 rounded-lg shadow-xs">
          <HelpCircle className="w-3.5 h-3.5" /> Security Note
        </div>
      </div>

      {/* Financial Numbers Component */}
      <FinancialGrid metrics={metrics} />

      {/* Main Structural Columns split grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-1">
          <CashoutForm 
            balance={metrics?.balance || 0} 
            onCashout={handleCashoutSubmission} 
            processing={processingCashout}
            linkedAccountText={hasBankDetails ? linkedBankText : "No Account Linked"} 
          />
        </div>
        <div className="lg:col-span-2">
          <LedgerHistory transactions={transactions} />
        </div>
      </div>

    </div>
  );
}

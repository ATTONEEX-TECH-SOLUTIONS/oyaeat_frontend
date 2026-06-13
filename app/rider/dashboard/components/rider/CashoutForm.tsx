'use client'

import { useState } from "react";
import { Loader2, CreditCard, Info } from "lucide-react";

interface CashoutFormProps {
  balance: number;
  onCashout: (amount: number) => Promise<void>;
  processing: boolean;
  linkedAccountText?: string; // e.g., "Zenith Bank (****5678)"
}

export default function CashoutForm({ balance, onCashout, processing, linkedAccountText = "Registered Email Account" }: CashoutFormProps) {
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) return alert("Enter a valid payout amount");
    if (amountNum > balance) return alert("Insufficient account balance");
    
    onCashout(amountNum).then(() => setAmount(""));
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 h-fit">
      <div>
        <h3 className="font-bold text-gray-900 text-lg">Instant Payout Request</h3>
        <p className="text-xs text-gray-400 mt-0.5">Transfer your automated order split shares straight into your pocket.</p>
      </div>

      {/* Read-Only Account indicator since details are managed over email */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
        <div className="text-[11px] text-gray-600 leading-tight">
          Destined for: <span className="font-bold text-gray-900">{linkedAccountText}</span>. To update settlement records, message support.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Amount to Withdraw</label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-sm font-bold text-gray-500">₦</span>
            <input 
              type="number"
              required
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-8 pr-4 text-sm focus:outline-none focus:border-green-600 text-gray-900 font-bold"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={processing || !amount}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
          Execute Bank Settlement
        </button>
      </form>
    </div>
  );
}

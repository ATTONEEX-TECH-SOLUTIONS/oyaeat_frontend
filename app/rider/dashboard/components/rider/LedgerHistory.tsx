'use client'

import { Clock, CheckCircle2, ArrowUpRight } from "lucide-react";

interface Transaction {
  id: string;
  amount: string | number;
  type: string;
  status: string;
  description: string;
  createdAt: string;
}

export default function LedgerHistory({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-50">
        <h3 className="font-bold text-gray-900 text-lg">Earning & Payout Ledger</h3>
      </div>

      {transactions.length === 0 ? (
        <div className="p-8 text-center text-sm text-gray-400">No accounting movements recorded.</div>
      ) : (
        <div className="divide-y divide-gray-50">
          {transactions.map((txn) => (
            <div key={txn.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  txn.type === 'withdrawal' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {txn.type === 'withdrawal' ? <Clock className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{txn.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-gray-400">{new Date(txn.createdAt).toLocaleString()}</p>
                    <span className={`text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${
                      txn.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {txn.status === 'completed' && <CheckCircle2 className="w-2.5 h-2.5" />}
                      {txn.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-black text-base ${txn.type === 'withdrawal' ? 'text-gray-900' : 'text-green-600'}`}>
                  {txn.amount}
                </p>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">{txn.id}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

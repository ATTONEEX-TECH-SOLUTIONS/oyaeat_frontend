'use client'

import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'

interface Transaction {
  id: string | number;
  type: 'credit' | 'debit' | 'withdrawal';
  description: string;
  createdAt: string | Date;
  status: 'completed' | 'pending' | 'failed';
  amount: number;
}

export default function TransactionList({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="rounded-2xl border shadow-sm overflow-hidden bg-white border-[#c8e6c9]">
      <div className="border-b px-6 py-4 border-[#c8e6c9]">
        <h3 className="font-bold text-lg text-gray-900">Recent Transactions</h3>
      </div>
      
      {transactions.length === 0 ? (
        <div className="p-10 text-center">
          <p className="text-sm font-medium text-[#6B7C6E]">No transactions found.</p>
        </div>
      ) : (
        <div className="divide-y divide-[#e8f5e9]">
          {transactions.map((t) => (
            <div key={t.id} className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full" 
                     style={{ backgroundColor: t.type === 'credit' ? '#D8F0E4' : '#FDECEA' }}>
                  {t.type === 'credit' 
                    ? <ArrowDownLeft className="h-5 w-5 text-[#2D6A4F]" />
                    : <ArrowUpRight  className="h-5 w-5 text-[#C0392B]" />}
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900">{t.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-[#6B7C6E]">{new Date(t.createdAt).toLocaleString()}</p>
                    <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded"
                          style={{ 
                            backgroundColor: t.status === 'completed' ? '#D8F0E4' : t.status === 'pending' ? '#FEF3CD' : '#FDECEA',
                            color: t.status === 'completed' ? '#2D6A4F' : t.status === 'pending' ? '#D4860B' : '#C0392B'
                          }}>
                      {t.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-base" style={{ color: t.type === 'credit' ? '#2D6A4F' : '#111827' }}>
                  {t.type === 'credit' ? '+' : '-'}₦{Math.round(t.amount).toLocaleString('en-NG')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

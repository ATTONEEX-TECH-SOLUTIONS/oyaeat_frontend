'use client'

import { CheckCircle2, User, Building2, Truck, HelpCircle } from "lucide-react";

interface PayoutRequest {
  id: string;
  recipientName: string;
  recipientEmail: string;
  type: 'restaurant' | 'rider';
  requestedAmount: number;
  bankDetails: string;
  orderReference: string;
  originalOrderTotal: number;
  adminSplitPercentage: number;
  createdAt: string;
}

interface TableProps {
  requests: PayoutRequest[];
  onApprove: (id: string) => Promise<void>;
}

export default function PendingPayoutsTable({ requests, onApprove }: TableProps) {
  const formatCurrency = (val: number) => `₦${Math.round(val).toLocaleString('en-NG')}`;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-900 text-base">Pending Withdrawal Verification Queue</h3>
      </div>

      {requests.length === 0 ? (
        <div className="p-8 text-center text-xs text-gray-400">All withdrawal request queues are empty.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-400 font-bold border-b border-gray-100">
                <th className="p-4">Party Reference</th>
                <th className="p-4">Linked Bank Details</th>
                <th className="p-4">Original Order Metrics</th>
                <th className="p-4">Admin Fee Cut</th>
                <th className="p-4">Net Payable Payout</th>
                <th className="p-4 text-right">Settlement Trigger</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                  {/* Party */}
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                        r.type === 'restaurant' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {r.type === 'restaurant' ? <Building2 className="w-3.5 h-3.5" /> : <Truck className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{r.recipientName}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5 font-mono">{r.recipientEmail}</p>
                      </div>
                    </div>
                  </td>

                  {/* Bank info derived from email onboarding */}
                  <td className="p-4 font-medium max-w-[180px] truncate">
                    <p className="text-gray-900 font-bold">{r.bankDetails.split(' - ')[0]}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 font-mono">{r.bankDetails.split(' - ')[1] || 'No setup completed'}</p>
                  </td>

                  {/* Splits Metrics */}
                  <td className="p-4">
                    <p className="font-bold text-gray-900">{formatCurrency(r.originalOrderTotal)}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 font-mono">Ref: {r.orderReference}</p>
                  </td>

                  {/* Admin percentage cut */}
                  <td className="p-4 font-bold text-emerald-800">
                    <p>{formatCurrency(r.originalOrderTotal * (r.adminSplitPercentage / 100))}</p>
                    <p className="text-[10px] font-normal text-gray-400 mt-0.5">({r.adminSplitPercentage}% system rule)</p>
                  </td>

                  {/* Net Payable */}
                  <td className="p-4">
                    <p className="text-sm font-black text-gray-900">{formatCurrency(r.requestedAmount)}</p>
                    <span className="text-[9px] bg-amber-50 text-amber-800 border border-amber-100 px-1 rounded font-bold uppercase tracking-wider">Awaiting Dispatch</span>
                  </td>

                  {/* Action */}
                  <td className="p-4 text-right">
                    <button
                      onClick={() => onApprove(r.id)}
                      className="inline-flex items-center gap-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-3 py-1.5 rounded-lg transition-colors text-[11px]"
                    >
                      <CheckCircle2 className="w-3 h-3" /> Confirm Transfer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

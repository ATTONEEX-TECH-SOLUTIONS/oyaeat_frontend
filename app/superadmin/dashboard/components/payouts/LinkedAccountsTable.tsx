'use client'

import { Landmark, Building2, Truck, Calendar } from "lucide-react";

interface LinkedAccount {
  id: string;
  name: string;
  email: string;
  type: 'restaurant' | 'rider';
  bankString: string;
  updatedAt: string;
}

export default function LinkedAccountsTable({ accounts }: { accounts: LinkedAccount[] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/30">
        <h3 className="font-bold text-gray-900 text-sm">Active Onboarded Bank Mappings</h3>
        <p className="text-xs text-gray-400 mt-0.5">Live view of banking profiles manually verified and bound via email strings.</p>
      </div>

      {accounts.length === 0 ? (
        <div className="p-6 text-center text-xs text-gray-400">No linked bank mapping records found in database.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-400 font-bold border-b border-gray-100">
                <th className="p-3 pl-6">Ecosystem Partner</th>
                <th className="p-3">Bound Account Parameters</th>
                <th className="p-3 pr-6 text-right">Last Linked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {accounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="p-3 pl-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        acc.type === 'restaurant' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {acc.type === 'restaurant' ? <Building2 className="w-3 h-3" /> : <Truck className="w-3 h-3" />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{acc.name}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{acc.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-medium">
                    <div className="flex items-center gap-1.5 text-gray-900 font-bold bg-gray-50 border border-gray-100 px-2 py-1 rounded-md w-fit">
                      <Landmark className="w-3 h-3 text-gray-400" />
                      <span className="font-mono text-[11px]">{acc.bankString}</span>
                    </div>
                  </td>
                  <td className="p-3 pr-6 text-right text-gray-400 text-[10px] font-medium">
                    <div className="flex items-center justify-end gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(acc.updatedAt).toLocaleDateString()}
                    </div>
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

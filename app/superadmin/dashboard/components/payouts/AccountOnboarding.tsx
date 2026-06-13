'use client'

import { useState } from "react";
import { Link2, Loader2 } from "lucide-react";

interface OnboardingProps {
  onSave: (data: any) => Promise<void>;
  processing: boolean;
}

export default function AccountOnboarding({ onSave, processing }: OnboardingProps) {
  const [form, setForm] = useState({
    userEmail: "",
    userType: "restaurant",
    bankName: "",
    accountNumber: "",
    accountName: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.accountNumber.length !== 10) return alert("Account number must be 10 digits");
    onSave(form).then(() => {
      setForm({ userEmail: "", userType: "restaurant", bankName: "", accountNumber: "", accountName: "" });
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
      <div>
        <h3 className="text-base font-bold text-gray-900">Manual Email Account Linker</h3>
        <p className="text-xs text-gray-400 mt-0.5">Link bank validation keys manually compiled from user onboarding email requests.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Account Owner Email</label>
          <input 
            type="email" required placeholder="partner@email.com" value={form.userEmail}
            onChange={e => setForm({...form, userEmail: e.target.value})}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none focus:border-emerald-800 text-gray-900"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Account Holder Category</label>
            <select 
              value={form.userType} onChange={e => setForm({...form, userType: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none"
            >
              <option value="restaurant">Restaurant Vendor</option>
              <option value="rider">Logistics Rider</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Bank Institution</label>
            <input 
              type="text" required placeholder="e.g. GTBank, Opay" value={form.bankName}
              onChange={e => setForm({...form, bankName: e.target.value})}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none text-gray-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Account Number (10 digits)</label>
            <input 
              type="text" maxLength={10} required placeholder="0123456789" value={form.accountNumber}
              onChange={e => setForm({...form, accountNumber: e.target.value.replace(/\D/g, '')})}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none text-gray-900 font-mono"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Account Name String</label>
            <input 
              type="text" required placeholder="CHUKWU OKORO" value={form.accountName}
              onChange={e => setForm({...form, accountName: e.target.value.toUpperCase()})}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none text-gray-900"
            />
          </div>
        </div>

        <button
          type="submit" disabled={processing}
          className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
        >
          {processing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Link2 className="w-3.5 h-3.5" />}
          Commit Bank Linking Record
        </button>
      </form>
    </div>
  );
}

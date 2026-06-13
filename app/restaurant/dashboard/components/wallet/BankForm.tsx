'use client'

import { useState } from 'react'
import { Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const NIGERIAN_BANKS = [
  "Access Bank", "First Bank", "Fidelity Bank", "GTBank", "Kuda Bank", 
  "Moniepoint MFB", "Opay", "Palmpay", "Sterling Bank", "UBA", "Wema Bank", "Zenith Bank"
]

interface BankFormProps {
  onSave: (data: { bankName: string; accountNumber: string; accountName: string }) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function BankForm({ onSave, onCancel, isLoading }: BankFormProps) {
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    accountName: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.accountNumber.length !== 10) return
    onSave(formData)
  }

  return (
    <div className="max-w-md rounded-2xl border p-6 shadow-sm animate-in fade-in-50 duration-200 bg-white border-[#c8e6c9]">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="h-5 w-5 text-[#2D6A4F]" />
        <h2 className="text-lg font-bold text-gray-900">Link Settlement Account</h2>
      </div>
      <p className="text-xs text-[#6B7C6E] mb-4">Specify the settlement destination where funds should be processed during payouts.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Select Bank</label>
          <select 
            value={formData.bankName} 
            onChange={e => setFormData({...formData, bankName: e.target.value})}
            className="w-full p-2.5 border rounded-lg bg-gray-50 text-sm focus:outline-none" required
          >
            <option value="">-- Choose Bank --</option>
            {NIGERIAN_BANKS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Account Number</label>
          <input 
            type="text" maxLength={10} placeholder="0123456789"
            value={formData.accountNumber}
            onChange={e => setFormData({...formData, accountNumber: e.target.value.replace(/\D/g, '')})}
            className="w-full p-2.5 border rounded-lg bg-gray-50 text-sm focus:outline-none" required
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">Account Holder Name</label>
          <input 
            type="text" placeholder="CHUKWU OKORO ENTERPRISE"
            value={formData.accountName}
            onChange={e => setFormData({...formData, accountName: e.target.value.toUpperCase()})}
            className="w-full p-2.5 border rounded-lg bg-gray-50 text-sm focus:outline-none" required
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={onCancel} className="w-full">Cancel</Button>
          <Button type="submit" disabled={isLoading} className="w-full bg-[#1B4332] text-white">
            {isLoading ? 'Saving...' : 'Save Account'}
          </Button>
        </div>
      </form>
    </div>
  )
}

'use client'

import { Sidebar } from '@/app/superadmin/dashboard/components/sidebar'
import { Save, Shield, Globe } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-[#F5FAF6]">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="p-8 max-w-4xl">
          <div className="mb-8 flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#52B788] mb-1">
                Super Admin
              </p>
              <h1 className="text-3xl font-black tracking-tight text-[#111C14]">Platform Settings</h1>
              <p className="text-[#4a7c59] mt-2">Manage global configuration across all restaurants and riders.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#D8E4DC] p-8 shadow-sm">
             <div className="flex items-center gap-3 border-b border-[#D8E4DC] pb-4 mb-6">
                <Shield className="w-6 h-6 text-[#2e7d32]" />
                <h2 className="text-xl font-bold text-[#111C14]">Core Configuration</h2>
             </div>

             <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#4a7c59] mb-2">Platform Name</label>
                    <input type="text" defaultValue="OyaEat" className="w-full px-4 py-3 rounded-xl border border-[#D8E4DC] bg-[#F5FAF6] text-[#111C14] font-semibold outline-none focus:border-[#1B4332] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[#4a7c59] mb-2">Support Email</label>
                    <input type="email" defaultValue="support@oyaeat.com" className="w-full px-4 py-3 rounded-xl border border-[#D8E4DC] bg-[#F5FAF6] text-[#111C14] font-semibold outline-none focus:border-[#1B4332] transition-colors" />
                  </div>
                </div>

                <div>
                   <label className="block text-xs font-bold uppercase tracking-widest text-[#4a7c59] mb-2">Customer Web Address</label>
                   <div className="relative">
                      <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7C6E]" />
                      <input type="text" defaultValue="https://oyaeat.com" className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D8E4DC] bg-[#F5FAF6] text-[#111C14] font-semibold outline-none focus:border-[#1B4332] transition-colors" />
                   </div>
                </div>

                <div className="flex items-center justify-between pt-6 mt-6 border-t border-[#D8E4DC]">
                  <div>
                    <p className="font-bold text-[#111C14] text-lg">Maintenance Mode</p>
                    <p className="text-sm font-medium text-[#6B7C6E]">Temporarily disable customer ordering platform-wide.</p>
                  </div>
                  <button className="px-5 py-2.5 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-500 font-bold text-sm hover:bg-gray-100 transition-colors">Disabled</button>
                </div>
             </div>

             <div className="mt-8 pt-6 border-t border-[#D8E4DC] flex justify-end">
                <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1a5c2a] text-white font-bold hover:bg-[#14491f] shadow-sm transition-all focus:ring-4 focus:ring-[#1a5c2a]/20">
                   <Save className="w-4 h-4" /> Save Configuration
                </button>
             </div>
          </div>
        </div>
      </main>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Sidebar } from '@/app/superadmin/dashboard/components/sidebar'
import { Save, Shield, Globe, DollarSign, Bell, Wallet, Activity } from 'lucide-react'

// Helper toggle component
const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <div 
    onClick={onChange}
    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${checked ? 'bg-[#2e7d32]' : 'bg-gray-300'}`}
  >
    <div className={`bg-card w-4 h-4 rounded-full shadow-md transform transition-transform ${checked ? 'translate-x-6' : ''}`} />
  </div>
)

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)
  
  // Core
  const [platformName, setPlatformName] = useState("OyaEat")
  const [supportEmail, setSupportEmail] = useState("support@oyaeat.com")
  const [webAddress, setWebAddress] = useState("https://oyaeat.com")
  const [maintenanceMode, setMaintenanceMode] = useState(false)

  // Commission & Fees
  const [platformCommission, setPlatformCommission] = useState(15) // %
  const [baseRiderFee, setBaseRiderFee] = useState(1200) // NGN

  // Payout Policies
  const [restaurantPayoutThreshold, setRestaurantPayoutThreshold] = useState(10000)
  const [riderPayoutThreshold, setRiderPayoutThreshold] = useState(5000)
  const [payoutSchedule, setPayoutSchedule] = useState("weekly")

  // Global Notifications
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [dailyReports, setDailyReports] = useState(true)

  const handleSave = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    alert("Configuration saved successfully!")
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="p-8 max-w-4xl mx-auto">
          {/* Sticky Header */}
          <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md px-8 py-6 mb-8 border-b border-border flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#52B788] mb-1">
                Super Admin
              </p>
              <h1 className="text-3xl font-black tracking-tight text-foreground">Platform Settings</h1>
              <p className="text-muted-foreground mt-2">Manage global configuration across all restaurants and riders.</p>
            </div>
            
            <button 
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-sm transition-all focus:ring-4 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
               {saving ? (
                 <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
               ) : (
                 <Save className="w-5 h-5" />
               )}
               {saving ? "Saving Changes..." : "Save Configuration"}
            </button>
          </div>

          <div className="space-y-6">
            {/* Core Configuration */}
            <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
               <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
                  <Shield className="w-6 h-6 text-[#2e7d32]" />
                  <h2 className="text-xl font-bold text-foreground">Core Configuration</h2>
               </div>

               <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-primary mb-2">Platform Name</label>
                      <input type="text" value={platformName} onChange={e => setPlatformName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground font-semibold outline-none focus:border-[#1B4332] transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-primary mb-2">Support Email</label>
                      <input type="email" value={supportEmail} onChange={e => setSupportEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground font-semibold outline-none focus:border-[#1B4332] transition-colors" />
                    </div>
                  </div>

                  <div>
                     <label className="block text-xs font-bold uppercase tracking-widest text-primary mb-2">Customer Web Address</label>
                     <div className="relative">
                        <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input type="text" value={webAddress} onChange={e => setWebAddress(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground font-semibold outline-none focus:border-[#1B4332] transition-colors" />
                     </div>
                  </div>
               </div>
            </div>

            {/* Commission & Fees */}
            <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
               <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
                  <DollarSign className="w-6 h-6 text-[#2e7d32]" />
                  <h2 className="text-xl font-bold text-foreground">Commission & Fees</h2>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-xs font-bold uppercase tracking-widest text-primary mb-2">Global Platform Commission (%)</label>
                   <input type="number" value={platformCommission} onChange={e => setPlatformCommission(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground font-semibold outline-none focus:border-[#1B4332] transition-colors" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold uppercase tracking-widest text-primary mb-2">Base Rider Delivery Fee (₦)</label>
                   <input type="number" value={baseRiderFee} onChange={e => setBaseRiderFee(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground font-semibold outline-none focus:border-[#1B4332] transition-colors" />
                 </div>
               </div>
            </div>

            {/* Payout Policies */}
            <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
               <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
                  <Wallet className="w-6 h-6 text-[#2e7d32]" />
                  <h2 className="text-xl font-bold text-foreground">Payout Policies</h2>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 <div>
                   <label className="block text-xs font-bold uppercase tracking-widest text-primary mb-2">Restaurant Min Payout (₦)</label>
                   <input type="number" value={restaurantPayoutThreshold} onChange={e => setRestaurantPayoutThreshold(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground font-semibold outline-none focus:border-[#1B4332] transition-colors" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold uppercase tracking-widest text-primary mb-2">Rider Min Payout (₦)</label>
                   <input type="number" value={riderPayoutThreshold} onChange={e => setRiderPayoutThreshold(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground font-semibold outline-none focus:border-[#1B4332] transition-colors" />
                 </div>
               </div>

               <div>
                 <label className="block text-xs font-bold uppercase tracking-widest text-primary mb-2">Automatic Payout Schedule</label>
                 <select value={payoutSchedule} onChange={e => setPayoutSchedule(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground font-semibold outline-none focus:border-[#1B4332] transition-colors">
                   <option value="daily">Daily</option>
                   <option value="weekly">Weekly</option>
                   <option value="biweekly">Bi-Weekly</option>
                   <option value="monthly">Monthly</option>
                 </select>
               </div>
            </div>

            {/* Global Notifications */}
            <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
               <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
                  <Bell className="w-6 h-6 text-[#2e7d32]" />
                  <h2 className="text-xl font-bold text-foreground">Global Notifications</h2>
               </div>

               <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-border">
                   <div>
                     <p className="font-bold text-foreground">Order Confirmation Emails</p>
                     <p className="text-xs font-medium text-muted-foreground mt-0.5">Automated receipt emails to customers upon confirmed payment.</p>
                   </div>
                   <Toggle checked={emailNotifications} onChange={() => setEmailNotifications(!emailNotifications)} />
                 </div>

                 <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-border">
                   <div>
                     <p className="font-bold text-foreground">Rider Dispatch SMS</p>
                     <p className="text-xs font-medium text-muted-foreground mt-0.5">Send SMS alerts to assigned riders for immediate availability.</p>
                   </div>
                   <Toggle checked={smsNotifications} onChange={() => setSmsNotifications(!smsNotifications)} />
                 </div>

                 <div className="flex items-center justify-between p-4 bg-background rounded-xl border border-border">
                   <div>
                     <p className="font-bold text-foreground">Daily Superadmin Reports</p>
                     <p className="text-xs font-medium text-muted-foreground mt-0.5">Summary of platform sales and active riders sent to support email.</p>
                   </div>
                   <Toggle checked={dailyReports} onChange={() => setDailyReports(!dailyReports)} />
                 </div>
                 
                 <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100 mt-4">
                   <div>
                     <p className="font-bold text-red-900 flex items-center gap-2">
                       <Activity className="w-4 h-4" /> 
                       Maintenance Mode
                     </p>
                     <p className="text-xs font-medium text-red-600 mt-0.5">Temporarily disable customer ordering platform-wide globally.</p>
                   </div>
                   <Toggle checked={maintenanceMode} onChange={() => setMaintenanceMode(!maintenanceMode)} />
                 </div>
               </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}

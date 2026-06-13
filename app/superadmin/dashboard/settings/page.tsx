'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/app/superadmin/dashboard/components/sidebar';
import { Save, Loader2 } from 'lucide-react';
import { CoreConfiguration } from '../components/CoreConfiguration';
import { CommissionFees } from '../components/CommissionFees';
import { PayoutPolicies } from '../components/PayoutPolicies';
import { GlobalNotifications } from '../components/GlobalNotifications';


 const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function SettingsPage() {
 const [loading, setLoading] = useState(true);


  const [saving, setSaving] = useState(false);
  
  // 1. Core Config States
  const [platformName, setPlatformName] = useState("OyaEat");
  const [supportEmail, setSupportEmail] = useState("support@oyaeat.com");
  const [webAddress, setWebAddress] = useState("https://oyaeat.com");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // 2. Commission States
  const [platformCommission, setPlatformCommission] = useState(15);
  const [baseRiderFee, setBaseRiderFee] = useState(1200);

  // 3. Payout Policy States
  const [restaurantPayoutThreshold, setRestaurantPayoutThreshold] = useState(10000);
  const [riderPayoutThreshold, setRiderPayoutThreshold] = useState(5000);
  const [payoutSchedule, setPayoutSchedule] = useState("weekly");

  // 4. Global Notification States
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [dailyReports, setDailyReports] = useState(true);

  // Place this inside your master SettingsPage component structure:
useEffect(() => {
  const loadInitialConfigurations = async () => {
    try {
      const token = localStorage.getItem('admin_token') || localStorage.getItem('authToken');
      const res = await fetch(`${API_BASE_URL}/admin/settings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      
      if (json.success) {
        const d = json.data;
        setPlatformName(d["core.platformName"]);
        setSupportEmail(d["core.supportEmail"]);
        setWebAddress(d["core.webAddress"]);
        setMaintenanceMode(d["core.maintenanceMode"]);
        setPlatformCommission(d["fees.platformCommission"]);
        setBaseRiderFee(d["fees.baseRiderFee"]);
        setRestaurantPayoutThreshold(d["payouts.restaurantThreshold"]);
        setRiderPayoutThreshold(d["payouts.riderThreshold"]);
        setPayoutSchedule(d["payouts.schedule"]);
        setEmailNotifications(d["notifications.emailEnabled"]);
        setSmsNotifications(d["notifications.smsEnabled"]);
        setDailyReports(d["notifications.dailyReports"]);
      }
    } catch (err) {
      console.error("Error connecting settings database records:", err);
    } finally {
      setLoading(false);
    }
  };

  loadInitialConfigurations();
}, []);


// Inside your frontend settings page.tsx -> handleSave function:
const handleSave = async () => {
  setSaving(true);
  try {
    const token = localStorage.getItem('admin_token') || localStorage.getItem('authToken');
    
    // 🌟 FIX: Fetch using 'PATCH' to perfectly align with your backend router config!
    const res = await fetch(`${API_BASE_URL}/admin/settings`, {
      method: 'PATCH', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        "core.platformName": platformName,
        "core.supportEmail": supportEmail,
        "core.webAddress": webAddress,
        "core.maintenanceMode": maintenanceMode, // Passes toggle state
        "fees.platformCommission": platformCommission,
        "fees.baseRiderFee": baseRiderFee,
        "payouts.restaurantThreshold": restaurantPayoutThreshold,
        "payouts.riderThreshold": riderPayoutThreshold,
        "payouts.schedule": payoutSchedule,
        "notifications.emailEnabled": emailNotifications,
        "notifications.smsEnabled": smsNotifications,
        "notifications.dailyReports": dailyReports
      })
    });
    
    if (res.ok) {
      alert("Configuration uploaded and synchronized across OyaEat systems successfully!");
    } else {
      const errorJson = await res.json().catch(() => ({}));
      alert(`Failed to save configuration: ${errorJson.message || res.statusText}`);
    }
  } catch (err) {
    console.error("Network error updating configurations:", err);
  } finally {
    setSaving(false);
  }
};



  return (
    <div className="flex h-screen w-screen bg-slate-50/50 overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 min-w-0 flex flex-col h-full">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md px-8 py-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#52B788] mb-1">
              Super Admin
            </p>
            <h1 className="text-2xl font-black tracking-tight text-gray-900">Platform Settings</h1>
            <p className="text-gray-500 text-xs sm:text-sm font-medium mt-1">Manage global configuration across all restaurants and riders.</p>
          </div>
          
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1a5c2a] hover:bg-[#13441e] text-white font-bold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm shrink-0 cursor-pointer"
          >
             {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
             {saving ? "Saving..." : "Save Configuration"}
          </button>
        </div>

        {/* Scrollable Workspace Panels */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 w-full">
          
          <CoreConfiguration 
            platformName={platformName}
            setPlatformName={setPlatformName}
            supportEmail={supportEmail}
            setSupportEmail={setSupportEmail}
            webAddress={webAddress}
            setWebAddress={setWebAddress}
          />

          <CommissionFees 
            platformCommission={platformCommission}
            setPlatformCommission={setPlatformCommission}
            baseRiderFee={baseRiderFee}
            setBaseRiderFee={setBaseRiderFee}
          />

          <PayoutPolicies 
            restaurantPayoutThreshold={restaurantPayoutThreshold}
            setRestaurantPayoutThreshold={setRestaurantPayoutThreshold}
            riderPayoutThreshold={riderPayoutThreshold}
            setRiderPayoutThreshold={setRiderPayoutThreshold}
            payoutSchedule={payoutSchedule}
            setPayoutSchedule={setPayoutSchedule}
          />

          <GlobalNotifications 
            emailNotifications={emailNotifications}
            setEmailNotifications={setEmailNotifications}
            smsNotifications={smsNotifications}
            setSmsNotifications={setSmsNotifications}
            dailyReports={dailyReports}
            setDailyReports={setDailyReports}
            maintenanceMode={maintenanceMode}
            setMaintenanceMode={setMaintenanceMode}
          />

        </div>
      </main>
    </div>
  );
}

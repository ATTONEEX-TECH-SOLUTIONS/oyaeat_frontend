'use client';

import React from 'react';
import { Bell, Activity } from 'lucide-react';

interface GlobalNotificationsProps {
  emailNotifications: boolean;
  setEmailNotifications: (val: boolean) => void;
  smsNotifications: boolean;
  setSmsNotifications: (val: boolean) => void;
  dailyReports: boolean;
  setDailyReports: (val: boolean) => void;
  maintenanceMode: boolean;
  setMaintenanceMode: (val: boolean) => void;
}

// Reusable animated sliding switch component
const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button
    type="button"
    onClick={onChange}
    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors shrink-0优化 outline-none ${
      checked ? 'bg-[#1a5c2a]' : 'bg-gray-200'
    }`}
  >
    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
      checked ? 'translate-x-6' : 'translate-x-0'
    }`} />
  </button>
);

export function GlobalNotifications({
  emailNotifications,
  setEmailNotifications,
  smsNotifications,
  setSmsNotifications,
  dailyReports,
  setDailyReports,
  maintenanceMode,
  setMaintenanceMode,
}: GlobalNotificationsProps) {
  return (
    <div className="bg-card rounded-2xl border border-gray-100 p-8 shadow-sm bg-white w-full">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
        <Bell className="w-6 h-6 text-[#1a5c2a]" />
        <h2 className="text-xl font-bold text-gray-900">Global Notifications & Platform State</h2>
      </div>

      <div className="space-y-4">
        {/* Email Alerts */}
        <div className="flex items-center justify-between p-4 bg-gray-50/30 rounded-xl border border-gray-100 gap-4">
          <div>
            <p className="font-extrabold text-gray-900 text-sm">Order Confirmation Emails</p>
            <p className="text-xs font-semibold text-gray-400 mt-0.5 leading-relaxed">Automated receipt emails to customers upon confirmed payment.</p>
          </div>
          <Toggle checked={emailNotifications} onChange={() => setEmailNotifications(!emailNotifications)} />
        </div>

        {/* SMS Dispatch Alerts */}
        <div className="flex items-center justify-between p-4 bg-gray-50/30 rounded-xl border border-gray-100 gap-4">
          <div>
            <p className="font-extrabold text-gray-900 text-sm">Rider Dispatch SMS</p>
            <p className="text-xs font-semibold text-gray-400 mt-0.5 leading-relaxed">Send SMS alerts to assigned riders for immediate availability.</p>
          </div>
          <Toggle checked={smsNotifications} onChange={() => setSmsNotifications(!smsNotifications)} />
        </div>

        {/* Admin Analytical Summaries */}
        <div className="flex items-center justify-between p-4 bg-gray-50/30 rounded-xl border border-gray-100 gap-4">
          <div>
            <p className="font-extrabold text-gray-900 text-sm">Daily Superadmin Reports</p>
            <p className="text-xs font-semibold text-gray-400 mt-0.5 leading-relaxed">Summary of platform sales and active riders sent to support email.</p>
          </div>
          <Toggle checked={dailyReports} onChange={() => setDailyReports(!dailyReports)} />
        </div>
        
        {/* ── 🌟 LIVE MAINTENANCE EMERGENCY SWITCH ── */}
        <div className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 mt-6 gap-4 ${
          maintenanceMode 
            ? "bg-red-50/80 border-red-200 text-red-950 shadow-xs" 
            : "bg-gray-50 border-gray-100 text-gray-900"
        }`}>
          <div>
            <p className={`font-extrabold flex items-center gap-2 text-sm ${maintenanceMode ? "text-red-950" : "text-gray-900"}`}>
              <Activity className={`w-4 h-4 ${maintenanceMode ? "text-red-700 animate-pulse" : "text-gray-400"}`} /> 
              Emergency System Maintenance Mode
            </p>
            <p className={`text-xs font-semibold mt-0.5 leading-relaxed ${maintenanceMode ? "text-red-700/90" : "text-gray-400"}`}>
              Temporarily lock down the customer checkout ordering tunnel platform-wide globally. Existing order runs remain safe.
            </p>
          </div>
          <Toggle checked={maintenanceMode} onChange={() => setMaintenanceMode(!maintenanceMode)} />
        </div>
      </div>
    </div>
  );
}

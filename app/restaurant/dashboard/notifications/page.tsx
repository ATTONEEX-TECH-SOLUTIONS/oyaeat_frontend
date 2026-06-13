'use client';

import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchNotifications(true);

    const pollingTimer = setInterval(() => {
      fetchNotifications(false); 
    }, 30000); 

    return () => clearInterval(pollingTimer);
  }, []);

  const getAuthToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('vendor_token') || localStorage.getItem('authToken');
  };

  const fetchNotifications = async (showSpinner: boolean) => {
    if (showSpinner) setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/vendor/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      
      if (json.success) {
        setNotifications(json.data || []);
      }
    } catch (err) {
      console.error('Failed loading vendor notification rows:', err);
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      setNotifications(notifications.map(n => ({ ...n, read: true })));

      await fetch(`${API_BASE_URL}/vendor/notifications/mark-read`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Error executing global mark read update:', err);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-[#2d6a4f]" />
        <span className="text-xs font-bold text-slate-500">Synchronizing notification arrays...</span>
      </div>
    );
  }

  return (
    // 🚀 FIXED: Swapped min-h-screen and explicit background colors for fluid container setups
    <div className="w-full h-full flex flex-col pb-20">
       <div className="flex items-center justify-between mb-8 shrink-0">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-1 text-[#52b788]">Vendor Portal</p>
            <h1 className="text-2xl font-black tracking-tight text-[#111c14]">Notifications</h1>
          </div>
          {notifications.some(n => !n.read) && (
            <button 
              onClick={handleMarkAllRead} 
              className="bg-white border border-[#d8e4dc] px-4 py-2 rounded-xl text-sm font-bold text-[#2d6a4f] shadow-sm flex items-center gap-2 hover:bg-[#f0f7f3] transition-colors cursor-pointer"
            >
               <CheckCircle2 className="w-4 h-4" /> Mark all read
            </button>
          )}
       </div>
       
       {/* 🚀 FIXED: Removed 'max-w-3xl' so cards span 100% of the right-hand layout dashboard width channel */}
       <div className="w-full space-y-3 flex-1 overflow-y-auto">
          {notifications.map(n => (
             <div 
               key={n.id} 
               className={`border border-[#d8e4dc] bg-white rounded-2xl p-5 shadow-sm flex gap-4 transition-all ${
                 n.read ? 'opacity-60' : 'border-l-4 border-l-[#2d6a4f]'
               }`}
             >
                 <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                   n.read ? 'bg-slate-100 text-slate-400' : 'bg-[#e8f5ed] text-[#2d6a4f]'
                 }`}>
                    <Bell className="w-6 h-6" />
                 </div>
                 <div className="flex-1 min-w-0">
                    <h3 className="font-extrabold text-[#111c14] text-base sm:text-lg truncate">{n.title}</h3>
                    <p className="font-medium text-[#6b7c6e] mt-1 text-xs sm:text-sm leading-relaxed">{n.text}</p>
                    <span className="text-[10px] font-bold text-slate-400 mt-3 inline-block uppercase tracking-wider">
                      {n.createdAt ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }) : 'Just now'}
                    </span>
                 </div>
             </div>
          ))}

          {notifications.length === 0 && (
            <div className="text-center py-20 text-slate-400 border border-dashed rounded-3xl text-sm font-medium bg-white w-full">
              No notifications logs are currently registered to your business.
            </div>
          )}
       </div>
    </div>
  );
}

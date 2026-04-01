'use client';
import { Bell, CheckCircle2 } from 'lucide-react';
import React, { useState } from 'react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
     { id: 1, title: 'Welcome to OyaEat', text: 'You can track all your orders and payouts here.', time: 'Just now', read: false },
  ]);
  
  return (
    <div className="min-h-screen bg-[#f0f7f1] p-4 sm:p-6 pb-20">
       <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-1 text-[#52b788]">Vendor Portal</p>
            <h1 className="text-2xl font-black tracking-tight text-[#111c14]">Notifications</h1>
          </div>
          <button onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))} className="bg-white border border-[#d8e4dc] px-4 py-2 rounded-xl text-sm font-bold text-[#2d6a4f] shadow-sm flex items-center gap-2 hover:bg-[#f0f7f3]">
             <CheckCircle2 className="w-4 h-4" /> Mark all read
          </button>
       </div>
       
       <div className="max-w-3xl space-y-3">
          {notifications.map(n => (
             <div key={n.id} className={`border border-[#d8e4dc] bg-white rounded-2xl p-5 shadow-sm flex gap-4 ${n.read ? 'opacity-60' : ''}`}>
                 <div className="bg-[#e8f5ed] w-12 h-12 rounded-full flex items-center justify-center text-[#2d6a4f] shrink-0">
                    <Bell className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="font-extrabold text-[#111c14] text-lg">{n.title}</h3>
                    <p className="font-medium text-[#6b7c6e] mt-1 text-sm leading-relaxed">{n.text}</p>
                    <span className="text-xs font-bold text-[#a5d6a7] mt-3 inline-block uppercase tracking-wider">{n.time}</span>
                 </div>
             </div>
          ))}
       </div>
    </div>
  )
}

'use client'

import React from 'react'
import { Sidebar } from '@/app/superadmin/dashboard/components/sidebar' // 🚀 Ensure this path points to your layout sidebar asset
import { ChatInterface } from '@/components/chat/chat-interface'

export default function SuperadminChatPage() {
  return (
    // 💡 FIXED: Wrapped with the structural flex layout container row to lock the Sidebar to the screen border
    <div className="flex min-h-screen bg-slate-100">
      {/* 🚀 Persistent Master Admin Layout Sidebar anchor block */}
      <Sidebar />

      {/* Main viewport canvas content body layout container */}
      <main className="flex-1 overflow-auto p-8 flex flex-col h-screen">
        <div className="mb-4 flex-shrink-0">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">Support Inbox</h1>
          <p className="text-slate-600 mt-2 font-medium">Manage incoming compliance requests and customer tickets.</p>
        </div>

        {/* Outer frame container sets up the internal view height constraints for the messenger interface scroll loops */}
        <div className="flex-1 w-full max-w-6xl flex flex-col h-[calc(100vh-160px)]">
          <ChatInterface role="admin" />
        </div>
      </main>
    </div>
  )
}

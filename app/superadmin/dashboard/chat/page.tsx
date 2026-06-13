'use client'

import React from 'react'
import { Sidebar } from '@/app/superadmin/dashboard/components/sidebar' 
import { ChatInterface } from '@/components/chat/chat-interface'

export default function SuperadminChatPage() {
  return (
    <div className="flex h-screen w-screen bg-slate-100 overflow-hidden">
      {/* Persistent Master Admin Layout Sidebar anchor block */}
      <Sidebar />

      
      <main className="flex-1 flex flex-col h-full p-8 min-w-0">
        
        {/* Header Section */}
        <div className="mb-6 flex-shrink-0">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">Support Inbox</h1>
          <p className="text-slate-600 mt-2 font-medium">Manage incoming compliance requests and customer tickets.</p>
        </div>

        
        <div className="flex-1 w-full min-h-0 flex flex-col">
          <ChatInterface role="admin" />
        </div>
        
      </main>
    </div>
  )
}

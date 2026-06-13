'use client'

import React from 'react'
import { ChatInterface } from '@/components/chat/chat-interface'

export default function VendorSupportPage() {
  return (
    
    <div className="w-full flex flex-col h-[calc(100vh-60px)] pb-6 overflow-hidden">
      
      {/* Header Info Area */}
      <div className="mb-6 shrink-0">
        <h1 className="text-2xl font-black tracking-tight text-[#1B4332]">Vendor Support</h1>
        <p className="mt-1 text-sm font-medium text-[#6B7C6E]">Contact superadmin for compliance requests or general assistance.</p>
      </div>
      
      
      <div 
        className="flex-1 min-h-0 flex flex-col rounded-2xl border shadow-sm overflow-hidden bg-white" 
        style={{ borderColor: '#c8e6c9' }}
      >
        <ChatInterface role="vendor" />
      </div>

    </div>
  )
}

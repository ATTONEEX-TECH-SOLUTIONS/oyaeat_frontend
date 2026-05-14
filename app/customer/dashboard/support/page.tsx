'use client'

import React from 'react'
import { ChatInterface } from '@/components/chat/chat-interface'

export default function CustomerSupportPage() {
  return (
    <div className="w-full flex flex-col h-[calc(100vh-120px)]">
      <div className="mb-4">
        <h1 className="text-2xl font-extrabold text-gray-900">Support Center</h1>
        <p className="text-sm text-gray-500 font-bold">Chat directly with the administration team.</p>
      </div>
      <ChatInterface role="customer" />
    </div>
  )
}

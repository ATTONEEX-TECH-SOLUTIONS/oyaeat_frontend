'use client'

import React from 'react'
import { ChatInterface } from '@/components/chat/chat-interface'

export default function SuperadminChatPage() {
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col h-[calc(100vh-120px)] mt-4 px-4">
      <div className="mb-4">
        <h1 className="text-2xl font-extrabold text-gray-900">Support Inbox</h1>
        <p className="text-sm text-gray-500 font-bold">Manage incoming compliance requests and customer tickets.</p>
      </div>
      <ChatInterface role="admin" />
    </div>
  )
}

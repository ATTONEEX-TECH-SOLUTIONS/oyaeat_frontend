'use client'

import React, { useEffect, useState, useRef } from 'react'
import { chatApi } from '@/lib/api/chat'
import { type Thread, type Message } from '@/lib/types/chat'
import { ChatSidebar } from './ChatSidebar'
import { ChatWindow } from './ChatWindow'

interface ChatInterfaceProps {
  role: 'customer' | 'admin' | 'vendor' | 'rider'
  currentUserId?: string;
}

export function ChatInterface({ role, currentUserId }: ChatInterfaceProps) {
  const [threads, setThreads] = useState<Thread[]>([])
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loadingThreads, setLoadingThreads] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [inputText, setInputText] = useState('')
  const [sending, setSending] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newSubject, setNewSubject] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const fetchThreads = async () => {
    try {
      const res = await chatApi.getThreads(role)
      setThreads(res.data || [])
      if (!activeThreadId && res.data?.length > 0) {
        setActiveThreadId(res.data[0].id)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingThreads(false)
    }
  }

  const fetchMessages = async (threadId: string) => {
    setLoadingMessages(true)
    try {
      const res = await chatApi.getMessages(role, threadId)
      setMessages(res.data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingMessages(false)
    }
  }

  useEffect(() => {
    fetchThreads()
    const polling = setInterval(fetchThreads, 15000)
    return () => clearInterval(polling)
  }, [role])

  useEffect(() => {
    if (activeThreadId) {
      fetchMessages(activeThreadId)
      const polling = setInterval(() => {
        chatApi.getMessages(role, activeThreadId).then(res => {
          setMessages(res.data || [])
        }).catch(() => {})
      }, 5000)
      return () => clearInterval(polling)
    } else {
      setMessages([])
    }
  }, [activeThreadId, role])

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSubject.trim()) return
    setSending(true)
    try {
      const res = await chatApi.createSupportThread(role, newSubject, 'support')
      setActiveThreadId(res.data.id)
      setIsCreating(false)
      setNewSubject('')
      fetchThreads()
    } catch (e) {
      console.error(e)
    } finally {
      setSending(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || !activeThreadId) return
    setSending(true)
    try {
      await chatApi.sendMessage(role, activeThreadId, inputText)
      setInputText('')
      await fetchMessages(activeThreadId)
      fetchThreads() 
    } catch (e) {
      console.error(e)
    } finally {
      setSending(false)
    }
  }

  const filteredThreads = threads.filter(thread => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    const matchSubject = thread.subject?.toLowerCase().includes(query);
    const matchParticipants = thread.participants?.some(p => {
      const fullName = `${p.firstName || ''} ${p.lastName || ''}`.toLowerCase();
      return fullName.includes(query) || p.role?.toLowerCase().includes(query);
    });
    return matchSubject || matchParticipants;
  });

  return (
    <div className="flex h-[calc(100vh-120px)] bg-card rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full">
      <ChatSidebar
        role={role}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        loadingThreads={loadingThreads}
        filteredThreads={filteredThreads}
        activeThreadId={activeThreadId}
        isCreating={isCreating}
        setIsCreating={setIsCreating}
        setActiveThreadId={setActiveThreadId}
      />
      <ChatWindow
        role={role}
        currentUserId={currentUserId}
        isCreating={isCreating}
        activeThreadId={activeThreadId}
        threads={threads}
        loadingMessages={loadingMessages}
        messages={messages}
        inputText={inputText}
        sending={sending}
        newSubject={newSubject}
        setNewSubject={setNewSubject}
        setInputText={setInputText}
        setIsCreating={setIsCreating}
        setActiveThreadId={setActiveThreadId}
        handleCreateThread={handleCreateThread}
        handleSendMessage={handleSendMessage}
        messagesEndRef={messagesEndRef}
      />
    </div>
  )
}

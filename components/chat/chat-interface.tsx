'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Send, Plus, MessageSquare, Loader2, User2, MessageCircle } from 'lucide-react'
import { chatApi, type Thread, type Message } from '@/lib/api/chat'
import { formatDistanceToNow } from 'date-fns'

interface ChatInterfaceProps {
  role: 'customer' | 'admin' | 'vendor'
  currentUserId?: string // used to position messages left/right
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
      scrollToBottom()
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

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }
  
  // Re-scroll when messages arrive
  useEffect(() => {
    if (messages.length > 0) scrollToBottom()
  }, [messages])

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSubject.trim()) return
    setSending(true)
    try {
      const res = await chatApi.createSupportThread(role, newSubject, 'admin')
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
      fetchThreads() // updates the lastMessage on sidebar
    } catch (e) {
      console.error(e)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-120px)] bg-card rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Sidebar: Threads List */}
      <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/50">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-card">
          <h2 className="font-extrabold text-lg text-gray-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#1a5c2a]" />
            Messages
          </h2>
          {role !== 'admin' && (
            <button 
              onClick={() => setIsCreating(true)}
              className="p-2 rounded-xl bg-[#e8f5e9] text-[#1a5c2a] hover:bg-[#1a5c2a] hover:text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {loadingThreads ? (
            <div className="flex justify-center p-5"><Loader2 className="w-5 h-5 animate-spin text-[#1a5c2a]" /></div>
          ) : threads.length === 0 ? (
            <div className="text-center py-10 text-gray-400 font-bold text-sm">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-20" />
              No active conversations
            </div>
          ) : (
            threads.map(thread => (
              <button
                key={thread.id}
                onClick={() => { setIsCreating(false); setActiveThreadId(thread.id) }}
                className={`w-full text-left p-3 rounded-xl transition-all border ${
                  activeThreadId === thread.id 
                    ? 'bg-white border-[#1a5c2a]/20 shadow-sm ring-1 ring-[#1a5c2a]/20' 
                    : 'bg-transparent border-transparent hover:bg-gray-100'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-gray-900 text-sm truncate pr-2">{thread.subject}</h3>
                  <span className="text-[10px] text-gray-400 font-bold whitespace-nowrap">
                    {thread.updatedAt ? formatDistanceToNow(new Date(thread.updatedAt), { addSuffix: true }).replace('about ', '') : ''}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate font-semibold">
                  {thread.lastMessage || 'New thread'}
                </p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main View: Chat Window */}
      <div className="flex-1 flex flex-col bg-white relative">
        {isCreating ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 bg-[#e8f5e9] rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-[#1a5c2a]" />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-2">Start a New Conversation</h2>
            <p className="text-sm text-gray-500 mb-8 max-w-sm font-semibold">
              Create a support ticket. Our team will respond as soon as possible.
            </p>
            <form onSubmit={handleCreateThread} className="w-full max-w-md">
              <input
                type="text"
                placeholder="Subject of your inquiry..."
                value={newSubject}
                onChange={e => setNewSubject(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#1a5c2a] outline-none font-bold text-gray-900 shadow-sm transition-all mb-4"
                maxLength={60}
                required
              />
              <button
                type="submit"
                disabled={sending || !newSubject.trim()}
                className="w-full py-3 rounded-xl bg-[#1a5c2a] text-white font-extrabold shadow-md hover:bg-[#14491f] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Create Ticket
              </button>
              <button
                type="button"
                onClick={() => { setIsCreating(false); if(threads.length > 0) setActiveThreadId(threads[0].id) }}
                className="w-full mt-3 py-3 rounded-xl text-gray-500 font-bold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </form>
          </div>
        ) : !activeThreadId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <MessageCircle className="w-16 h-16 mb-4 opacity-10" />
            <p className="font-bold">Select a conversation</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center shadow-sm z-10 bg-white">
              <h2 className="font-extrabold text-gray-900">
                {threads.find(t => t.id === activeThreadId)?.subject || 'Chat'}
              </h2>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
              {loadingMessages ? (
                <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-[#1a5c2a]" /></div>
              ) : messages.length === 0 ? (
                <div className="text-center text-sm font-bold text-gray-400 py-10">No messages yet. Say hello!</div>
              ) : (
                messages.map((msg, i) => {
                  const isMe = msg.senderId === currentUserId || (!currentUserId && msg.senderRole === role);
                  const showAvatar = !isMe && (i === 0 || messages[i - 1].senderId !== msg.senderId);
                  
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} max-w-full group`}>
                      {!isMe && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 mr-3 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm mt-auto">
                          {showAvatar ? <User2 className="w-4 h-4 text-gray-400" /> : <div className="w-8 h-8" />}
                        </div>
                      )}
                      <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                        <div 
                          className={`px-4 py-2.5 rounded-2xl text-sm font-semibold leading-relaxed shadow-sm ${
                            isMe 
                            ? 'bg-[#1a5c2a] text-white rounded-br-sm' 
                            : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm'
                          }`}
                        >
                          {msg.content}
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold mt-1.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {msg.senderRole} • {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true }).replace('about ', '')}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-4 bg-white border-t border-gray-100">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  className="flex-1 bg-gray-50 border-transparent focus:border-[#1a5c2a]/30 focus:bg-white focus:ring-0 outline-none px-4 py-3 rounded-full text-sm font-semibold transition-all shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || sending}
                  className="w-12 h-12 flex flex-shrink-0 items-center justify-center rounded-full bg-[#1a5c2a] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#14491f] hover:-translate-y-0.5 hover:shadow-md transition-all"
                >
                  {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4 translate-x-0.5" />}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

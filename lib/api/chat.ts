const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

function authHeaders(key: string): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem(key) : null
  if (!token) return { 'Content-Type': 'application/json' }
  return { 
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}` 
  }
}

// Since roles use different localStorage keys for tokens, we need a flexible fetcher
const getAuthKey = (role: 'customer' | 'admin' | 'vendor' | 'rider') => {
  if (role === 'customer') return 'customer_token'
  if (role === 'admin') return 'admin_token'
  if (role === 'vendor') return 'authToken' // Assuming vendor uses authToken given settings logic
  if (role === 'rider') return 'rider_token'
  return 'authToken'
}

export interface Participant {
  id: string
  firstName?: string
  lastName?: string
  role: string
}

export interface Thread {
  id: string
  type: string
  subject: string
  status: string
  lastMessage?: string
  updatedAt: string
  createdAt: string
  participants: Participant[]
}

export interface Message {
  id: string
  threadId: string
  senderId: string
  senderRole: string
  content: string
  isRead: boolean
  createdAt: string
}

export const chatApi = {
  getThreads: async (role: 'customer' | 'admin' | 'vendor') => {
    const res = await fetch(`${API}/chat/threads`, {
      headers: authHeaders(getAuthKey(role)),
    })
    if (!res.ok) throw new Error('Failed to fetch threads')
    return res.json()
  },

  createSupportThread: async (role: 'customer' | 'admin' | 'vendor', subject: string, recipientRole: string = 'admin') => {
    const res = await fetch(`${API}/chat/threads`, {
      method: 'POST',
      headers: authHeaders(getAuthKey(role)),
      body: JSON.stringify({ subject, recipientRole }),
    })
    if (!res.ok) throw new Error('Failed to create thread')
    return res.json()
  },

  getMessages: async (role: 'customer' | 'admin' | 'vendor', threadId: string) => {
    const res = await fetch(`${API}/chat/threads/${threadId}/messages`, {
      headers: authHeaders(getAuthKey(role)),
    })
    if (!res.ok) throw new Error('Failed to fetch messages')
    return res.json()
  },

  sendMessage: async (role: 'customer' | 'admin' | 'vendor', threadId: string, content: string) => {
    const res = await fetch(`${API}/chat/threads/${threadId}/messages`, {
      method: 'POST',
      headers: authHeaders(getAuthKey(role)),
      body: JSON.stringify({ content }),
    })
    if (!res.ok) throw new Error('Failed to send message')
    return res.json()
  }
}

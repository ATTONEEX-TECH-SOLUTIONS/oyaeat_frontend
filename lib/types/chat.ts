const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

function authHeaders(key: string): HeadersInit {
  if (typeof window === 'undefined') return { 'Content-Type': 'application/json' };

  const token = localStorage.getItem(key) || 
                localStorage.getItem('authToken') || 
                localStorage.getItem('admin_token') ||
                localStorage.getItem('vendor_token') ||
                localStorage.getItem('customer_token') ||
                localStorage.getItem('riderToken'); // Added rider fallback variation safely

  if (!token) {
    console.warn(`[Chat Auth] No token found in localStorage for key query: ${key}`);
    return { 'Content-Type': 'application/json' };
  }

  return { 
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}` 
  };
}

const getAuthKey = (role: 'customer' | 'admin' | 'vendor' | 'rider') => {
  if (role === 'customer') return 'customer_token';
  if (role === 'admin') return 'admin_token';
  if (role === 'vendor') return 'authToken'; 
  if (role === 'rider') return 'rider_token';
  return 'authToken';
};



// 🚀 UPDATED MESSAGE INTERFACE WITHIN YOUR CHAT API LAYER FILE
export interface Participant {
  id: string; // matches your dynamic dataset type allocations
  firstName?: string;
  lastName?: string;
  role: string;
}

export interface Thread {
  id: string;
  type: string;
  subject: string;
  status: string;
  lastMessage?: string;
  updatedAt: string;
  createdAt: string;
  participants: Participant[];
  unreadCount: number;      
  lastSenderName: string | null; 
}

// 🚀 RECONFIGURED: Expresses nested relational columns populated by your Prisma backend controller query
export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  senderRole: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender?: {
    id: number | string;
    firstName: string;
    lastName: string;
    role: string;
  };
  thread?: {
    id: string;
    subject: string;
    participants: Participant[];
  };
}

export const chatApi = {
  getThreads: async (role: 'customer' | 'admin' | 'vendor' | 'rider') => {
    const res = await fetch(`${API}/chat/threads`, {
      headers: authHeaders(getAuthKey(role)),
    })
    if (!res.ok) throw new Error('Failed to fetch threads')
    return res.json()
  },

  createSupportThread: async (role: 'customer' | 'admin' | 'vendor' | 'rider', subject: string, threadType: string = 'support') => {
    const res = await fetch(`${API}/chat/threads`, {
      method: 'POST',
      headers: authHeaders(getAuthKey(role)),
      body: JSON.stringify({ subject, type: threadType }),
    })
    if (!res.ok) throw new Error('Failed to create thread')
    return res.json()
  },

  getMessages: async (role: 'customer' | 'admin' | 'vendor' | 'rider', threadId: string) => {
    const res = await fetch(`${API}/chat/threads/${threadId}/messages`, {
      headers: authHeaders(getAuthKey(role)),
    })
    if (!res.ok) throw new Error('Failed to fetch messages')
    return res.json()
  },

  sendMessage: async (role: 'customer' | 'admin' | 'vendor' | 'rider', threadId: string, content: string) => {
    const res = await fetch(`${API}/chat/threads/${threadId}/messages`, {
      method: 'POST',
      headers: authHeaders(getAuthKey(role)),
      body: JSON.stringify({ content }),
    })
    if (!res.ok) throw new Error('Failed to send message')
    return res.json()
  },

    toggleThreadStatus: async (threadId: string, status: 'open' | 'closed') => {
    const res = await fetch(`/api/chat/threads/${threadId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ status })
    });
    return res.json();
  },

  deleteThread: async (threadId: string) => {
    const res = await fetch(`/api/chat/threads/${threadId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return res.json();
  },

 
  getRiderAlerts: async () => {
    // Falls back to checking both standard tokens and rider-specific local storage allocations
    const token = localStorage.getItem('rider_token') || 
                  localStorage.getItem('riderToken') || 
                  localStorage.getItem('authToken');
    
    // Note: Adjusted url pattern to target your clean "/chat" base mount architecture path strings
    const res = await fetch(`${API}/chat/operations-alerts`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Failed to fetch operations alerts');
    return res.json();
  }
}

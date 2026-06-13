import { type Thread, type Message } from '@/lib/types/chat';

const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

function authHeaders(key: string): HeadersInit {
  if (typeof window === 'undefined') return { 'Content-Type': 'application/json' };

  const token = localStorage.getItem(key) || 
                localStorage.getItem('authToken') || 
                localStorage.getItem('admin_token') ||
                localStorage.getItem('vendor_token') ||
                localStorage.getItem('customer_token') ||
                localStorage.getItem('riderToken'); 

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

export const chatApi = {
  getThreads: async (role: 'customer' | 'admin' | 'vendor' | 'rider'): Promise<any> => {
    const res = await fetch(`${API}/chat/threads`, {
      headers: authHeaders(getAuthKey(role)),
    });
    if (!res.ok) throw new Error('Failed to fetch threads');
    return res.json();
  },

  createSupportThread: async (role: 'customer' | 'admin' | 'vendor' | 'rider', subject: string, threadType: string = 'support'): Promise<any> => {
    const res = await fetch(`${API}/chat/threads`, {
      method: 'POST',
      headers: authHeaders(getAuthKey(role)),
      body: JSON.stringify({ subject, type: threadType }),
    });
    if (!res.ok) throw new Error('Failed to create thread');
    return res.json();
  },

  getMessages: async (role: 'customer' | 'admin' | 'vendor' | 'rider', threadId: string): Promise<any> => {
    const res = await fetch(`${API}/chat/threads/${threadId}/messages`, {
      headers: authHeaders(getAuthKey(role)),
    });
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  },

  sendMessage: async (role: 'customer' | 'admin' | 'vendor' | 'rider', threadId: string, content: string): Promise<any> => {
    const res = await fetch(`${API}/chat/threads/${threadId}/messages`, {
      method: 'POST',
      headers: authHeaders(getAuthKey(role)),
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error('Failed to send message');
    return res.json();
  },

  // 🚀 EXPLICIT TYPE SIGNATURE: Resolves toggleThreadStatus error
  toggleThreadStatus: async (role: 'customer' | 'admin' | 'vendor' | 'rider', threadId: string, status: 'open' | 'closed'): Promise<any> => {
    const res = await fetch(`${API}/chat/threads/${threadId}/status`, {
      method: 'PATCH',
      headers: authHeaders(getAuthKey(role)),
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update thread status');
    return res.json();
  },

  // 🚀 EXPLICIT TYPE SIGNATURE: Resolves deleteThread error
  deleteThread: async (role: 'customer' | 'admin' | 'vendor' | 'rider', threadId: string): Promise<any> => {
    const res = await fetch(`${API}/chat/threads/${threadId}`, {
      method: 'DELETE',
      headers: authHeaders(getAuthKey(role))
    });
    if (!res.ok) throw new Error('Failed to delete thread');
    return res.json();
  },
 
  getRiderAlerts: async (): Promise<any> => {
    const token = localStorage.getItem('rider_token') || 
                  localStorage.getItem('riderToken') || 
                  localStorage.getItem('authToken');
    
    const res = await fetch(`${API}/chat/operations-alerts`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Failed to fetch operations alerts');
    return res.json();
  }
};

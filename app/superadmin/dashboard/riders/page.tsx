'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/app/superadmin/dashboard/components/sidebar'
import { RidersList } from '@/app/superadmin/dashboard/components/riders-list'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

// 🚨 LOCK-IN DEFAULT EXPORT: Explicitly declared to eliminate Next.js compilation issues
export default function RidersPage() {
  const [riders, setRiders] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  const getAuthHeaders = (extraHeaders = {}) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...extraHeaders
    }
  }

  useEffect(() => {
    async function fetchRiders() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/rider/admin/all`, {
          method: 'GET',
          headers: getAuthHeaders()
        }) 
        if (!response.ok) {
          throw new Error(`Server returned error status code: ${response.status}`)
        }
        const data = await response.json()
        setRiders(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Failed fetching riders data:", error)
        setRiders([])
      } finally {
        setLoading(false)
      }
    }
    fetchRiders()
  }, [])

  const filteredRiders = (riders || []).filter(
    (r) =>
      `${r?.firstName || ''} ${r?.lastName || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (r?.email && r.email.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleVerify = async (id: number, currentStatus: string) => {
    try {
      // 🚀 REACTIVATION CORE BRANCH: Maps inactive states smoothly back up to active status
      let nextStatus = 'active'
      if (currentStatus === 'pending') {
        nextStatus = 'verified'
      } else if (currentStatus === 'verified') {
        nextStatus = 'active'
      } else if (currentStatus === 'inactive') {
        nextStatus = 'active'
      }
      
      const response = await fetch(`${API_BASE_URL}/api/rider/admin/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: nextStatus })
      })
      if (response.ok) {
        setRiders(prevRiders =>
          prevRiders.map(r => r.id === id ? { ...r, status: nextStatus } : r)
        )
      }
    } catch (error) {
      console.error("Status modification failed:", error)
    }
  }

  const handleReject = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/rider/admin/${id}`, { 
        method: 'DELETE',
        headers: getAuthHeaders()
      })
      if (response.ok) {
        setRiders(prevRiders => prevRiders.filter((r) => r.id !== id))
      }
    } catch (error) {
      console.error("Rejection action failed:", error)
    }
  }

  const handleDeactivate = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/rider/admin/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: 'inactive' })
      })
      if (response.ok) {
        setRiders(prevRiders =>
          prevRiders.map((r) => r.id === id ? { ...r, status: 'inactive' } : r)
        )
      }
    } catch (error) {
      console.error("Deactivation update failed:", error)
    }
  }

  const getStats = (status: string) => (riders || []).filter((r) => r?.status === status).length

  if (loading) {
    return (
      <div className="flex p-8 justify-center items-center h-screen font-medium text-slate-600 bg-slate-100">
        Loading Rider Database...
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Rider Management</h1>
            <p className="text-slate-600 mt-2">Verify profiles, review files, and manage accounts</p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All ({(riders || []).length})</TabsTrigger>
              <TabsTrigger value="pending" className="relative">
                Pending ({getStats('pending')})
                {getStats('pending') > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-yellow-500 rounded-full">
                    {getStats('pending')}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="verified">Verified ({getStats('verified')})</TabsTrigger>
              <TabsTrigger value="active">Active ({getStats('active')})</TabsTrigger>
              <TabsTrigger value="inactive">Inactive ({getStats('inactive')})</TabsTrigger>
            </TabsList>

            <div className="mb-6 flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search by name or email..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {['all', 'pending', 'verified', 'active', 'inactive'].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <RidersList
                  riders={tab === 'all' ? filteredRiders : filteredRiders.filter((r) => r?.status === tab)}
                  onVerify={handleVerify}
                  onReject={handleReject}
                  onDeactivate={handleDeactivate}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  )
}

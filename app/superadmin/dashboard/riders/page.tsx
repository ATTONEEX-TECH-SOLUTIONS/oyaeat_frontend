'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/app/superadmin/dashboard/components/sidebar'
import { RidersList } from '@/app/superadmin/dashboard/components/riders-list'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Plus } from 'lucide-react'

// Set up fallback path configuration pointing directly to your local Express server instance
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function RidersPage() {
  const [riders, setRiders] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  // Fetch all riders from the unified Express instance
  useEffect(() => {
    async function fetchRiders() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/riders/admin/all`) 
        if (!response.ok) {
          throw new Error(`Server returned error status code: ${response.status}`);
        }
        const data = await response.json()
        setRiders(data)
      } catch (error) {
        console.error("Failed fetching riders data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchRiders()
  }, [])

  const filteredRiders = riders.filter(
    (r) =>
      `${r.firstName} ${r.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleVerify = async (id: string, currentStatus: string) => {
    try {
      const nextStatus = currentStatus === 'pending' ? 'verified' : 'active'
      
      const response = await fetch(`${API_BASE_URL}/api/riders/admin/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
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

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/riders/admin/${id}`, { 
        method: 'DELETE' 
      })
      if (response.ok) {
        setRiders(prevRiders => prevRiders.filter((r) => r.id !== id))
      }
    } catch (error) {
      console.error("Rejection action failed:", error)
    }
  }

  const handleDeactivate = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/riders/admin/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
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

  const getStats = (status: string) => riders.filter((r) => r.status === status).length

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
              <TabsTrigger value="all">All ({riders.length})</TabsTrigger>
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
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <Plus className="w-4 h-4 mr-2" /> Invite Rider
              </Button>
            </div>

            {['all', 'pending', 'verified', 'active', 'inactive'].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <RidersList
                  riders={tab === 'all' ? filteredRiders : filteredRiders.filter((r) => r.status === tab)}
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

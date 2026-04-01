'use client'

import { useState } from 'react'
import { Sidebar } from '@/app/superadmin/dashboard/components/sidebar'
import { RidersList } from '@/app/superadmin/dashboard/components/riders-list'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Plus } from 'lucide-react'

export default function RidersPage() {
  const [riders, setRiders] = useState<any[]>([
    { id: '1', firstName: 'John', lastName: 'Doe', email: 'john.d@oyaeat.com', status: 'active', phone: '+2348012345678', vehicle: 'Motorcycle' },
    { id: '2', firstName: 'Sarah', lastName: 'Adebayo', email: 'sarah.ade@oyaeat.com', status: 'pending', phone: '+2348087654321', vehicle: 'Bicycle' },
    { id: '3', firstName: 'Michael', lastName: 'Okon', email: 'm.okon@oyaeat.com', status: 'verified', phone: '+2349098765432', vehicle: 'Motorcycle' }
  ])
  const [searchTerm, setSearchTerm] = useState('')

  const filteredRiders = riders.filter(
    (r) =>
      `${r.firstName} ${r.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleVerify = (id: string) => {
    setRiders(
      riders.map((r) => {
        if (r.id === id) {
          if (r.status === 'pending') {
            return {
              ...r,
              status: 'verified' as const,
              verifiedAt: new Date(),
            }
          }
          if (r.status === 'verified') {
            return { ...r, status: 'active' as const }
          }
        }
        return r
      })
    )
  }

  const handleReject = (id: string) => {
    setRiders(riders.filter((r) => r.id !== id))
  }

  const handleDeactivate = (id: string) => {
    setRiders(
      riders.map((r) => (r.id === id ? { ...r, status: 'inactive' as const } : r))
    )
  }

  const getStats = (status: string) => {
    return riders.filter((r) => r.status === status).length
  }

  const pendingCount = getStats('pending')
  const verifiedCount = getStats('verified')
  const activeCount = getStats('active')
  const inactiveCount = getStats('inactive')

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">
              Rider Management
            </h1>
            <p className="text-slate-600 mt-2">
              Verify riders, manage documents, and monitor delivery partners
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">
                All ({riders.length})
              </TabsTrigger>
              <TabsTrigger value="pending" className="relative">
                Pending ({pendingCount})
                {pendingCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-yellow-500 rounded-full">
                    {pendingCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="verified">Verified ({verifiedCount})</TabsTrigger>
              <TabsTrigger value="active">Active ({activeCount})</TabsTrigger>
              <TabsTrigger value="inactive">Inactive ({inactiveCount})</TabsTrigger>
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
                <Plus className="w-4 h-4 mr-2" />
                Invite Rider
              </Button>
            </div>

            <TabsContent value="all">
              <RidersList
                riders={filteredRiders}
                onVerify={handleVerify}
                onReject={handleReject}
                onDeactivate={handleDeactivate}
              />
            </TabsContent>

            <TabsContent value="pending">
              <RidersList
                riders={filteredRiders.filter((r) => r.status === 'pending')}
                onVerify={handleVerify}
                onReject={handleReject}
                onDeactivate={handleDeactivate}
              />
            </TabsContent>

            <TabsContent value="verified">
              <RidersList
                riders={filteredRiders.filter((r) => r.status === 'verified')}
                onVerify={handleVerify}
                onReject={handleReject}
                onDeactivate={handleDeactivate}
              />
            </TabsContent>

            <TabsContent value="active">
              <RidersList
                riders={filteredRiders.filter((r) => r.status === 'active')}
                onVerify={handleVerify}
                onReject={handleReject}
                onDeactivate={handleDeactivate}
              />
            </TabsContent>

            <TabsContent value="inactive">
              <RidersList
                riders={filteredRiders.filter((r) => r.status === 'inactive')}
                onVerify={handleVerify}
                onReject={handleReject}
                onDeactivate={handleDeactivate}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

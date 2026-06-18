'use client'

import { useState } from 'react'
import type { Restaurant } from '@/lib/types'
import { FileText } from 'lucide-react'
import { ReasonModal } from '../components/ui/reason-modal'
import { RestaurantCard } from '../components/ui/restaurant-card'

interface RestaurantsListProps {
  restaurants: Restaurant[]
  onApprove?: (id: string) => void
  onReject?: (id: string, reason: string) => void
}

export function RestaurantsList({ restaurants, onApprove, onReject }: RestaurantsListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [rejectModal, setRejectModal] = useState<{
    isOpen: boolean
    targetId: string | null
    restaurantName: string
  }>({
    isOpen: false,
    targetId: null,
    restaurantName: '',
  })

  const handleModalSubmit = (reason: string) => {
    if (!rejectModal.targetId) return
    onReject?.(rejectModal.targetId, reason)
    setRejectModal({ isOpen: false, targetId: null, restaurantName: '' })
  }

  if (restaurants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-16 px-6 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#D8E4DC]">
          <FileText className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-base font-bold text-foreground">No restaurants found</p>
        <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters or search term.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          restaurant={restaurant}
          isExpanded={expandedId === restaurant.id}
          onToggleExpand={() => setExpandedId(expandedId === restaurant.id ? null : restaurant.id)}
          onApprove={onApprove}
          onRejectTrigger={(id, name) => {
            setRejectModal({ isOpen: true, targetId: id, restaurantName: name }) // 👈 Updates parent tracking states instantly
          }}
        />
      ))}

      {/* Render the modal outside of cards so it remains root-centered */}
      <ReasonModal
        isOpen={rejectModal.isOpen}
        onClose={() => setRejectModal({ isOpen: false, targetId: null, restaurantName: '' })}
        onSubmit={handleModalSubmit}
        title="Reject Registration"
        description={`Please state why the registration request for "${rejectModal.restaurantName}" is being rejected.`}
        placeholder="e.g., Uploaded business registration paperwork could not be verified..."
        confirmButtonVariant="danger"
        confirmButtonText="Confirm Rejection"
      />
    </div>
  )
}

'use client'

import { useState } from 'react'
import type { Rider } from '@/lib/types'
import { Check, X, Clock, AlertCircle, Bike } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RidersListProps {
  riders: Rider[]
  onVerify?: (id: string) => void
  onReject?: (id: string) => void
  onDeactivate?: (id: string) => void
}

const statusConfig = {
  pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  verified: { icon: Check, color: 'text-blue-600', bg: 'bg-blue-50' },
  active: { icon: Check, color: 'text-green-600', bg: 'bg-green-50' },
  inactive: { icon: X, color: 'text-slate-600', bg: 'bg-slate-50' },
}

const vehicleEmoji = {
  bike: '🏍️',
  scooter: '🛴',
  car: '🚗',
}

export function RidersList({
  riders,
  onVerify,
  onReject,
  onDeactivate,
}: RidersListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      {riders.map((rider) => {
        const config = statusConfig[rider.status]
        const StatusIcon = config.icon

        const allDocsComplete =
          rider.documents.license &&
          rider.documents.insurance &&
          rider.documents.background

        return (
          <div
            key={rider.id}
            className="bg-white border border-slate-200 rounded-lg overflow-hidden"
          >
            <div
              className="p-6 cursor-pointer hover:bg-slate-50"
              onClick={() =>
                setExpandedId(expandedId === rider.id ? null : rider.id)
              }
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-xl">
                      {vehicleEmoji[rider.vehicleType]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {rider.firstName} {rider.lastName}
                      </h3>
                      <p className="text-sm text-slate-600 capitalize">
                        {rider.vehicleType} Rider
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-sm">
                    <span className="text-slate-600">📧 {rider.email}</span>
                    <span className="text-slate-600">☎️ {rider.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${config.color} ${config.bg}`}
                  >
                    <StatusIcon className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">
                      {rider.status.charAt(0).toUpperCase() +
                        rider.status.slice(1)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(rider.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {expandedId === rider.id && (
              <div className="border-t border-slate-200 p-6 bg-slate-50 space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">
                    Document Status
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div
                      className={`p-3 rounded-lg ${
                        rider.documents.license
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-red-50 border border-red-200'
                      }`}
                    >
                      <p className="text-xs font-medium text-slate-700">
                        License
                      </p>
                      <p className="text-sm font-semibold mt-1 text-slate-900">
                        {rider.documents.license ? '✓' : '✗'}
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-lg ${
                        rider.documents.insurance
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-red-50 border border-red-200'
                      }`}
                    >
                      <p className="text-xs font-medium text-slate-700">
                        Insurance
                      </p>
                      <p className="text-sm font-semibold mt-1 text-slate-900">
                        {rider.documents.insurance ? '✓' : '✗'}
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-lg ${
                        rider.documents.background
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-red-50 border border-red-200'
                      }`}
                    >
                      <p className="text-xs font-medium text-slate-700">
                        Background
                      </p>
                      <p className="text-sm font-semibold mt-1 text-slate-900">
                        {rider.documents.background ? '✓' : '✗'}
                      </p>
                    </div>
                  </div>
                </div>

                {rider.status === 'pending' && !allDocsComplete && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-800">
                      Missing required documents. Cannot verify until all
                      documents are submitted.
                    </p>
                  </div>
                )}

                {(rider.status === 'pending' || rider.status === 'verified') && (
                  <div className="flex gap-3 pt-4">
                    {allDocsComplete && rider.status === 'pending' && (
                      <Button
                        onClick={() => onVerify?.(rider.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Verify Rider
                      </Button>
                    )}
                    {rider.status === 'verified' && (
                      <Button
                        onClick={() => onVerify?.(rider.id)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Activate
                      </Button>
                    )}
                    {rider.status === 'pending' && (
                      <Button
                        onClick={() => onReject?.(rider.id)}
                        variant="outline"
                        className="flex-1"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    )}
                  </div>
                )}

                {rider.status === 'active' && (
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => onDeactivate?.(rider.id)}
                      variant="outline"
                      className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Deactivate
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

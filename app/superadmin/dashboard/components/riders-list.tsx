'use client'

import { useState } from 'react'
import { Check, X, Clock, AlertCircle, Bike, Car, Mail, Phone, FileText, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RidersListProps {
  riders: any[]
  onVerify?: (id: string, status: string) => void
  onReject?: (id: string) => void
  onDeactivate?: (id: string) => void
}

const statusConfig = {
  pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  verified: { icon: Check, color: 'text-blue-600', bg: 'bg-blue-50' },
  active: { icon: Check, color: 'text-green-600', bg: 'bg-green-50' },
  inactive: { icon: X, color: 'text-slate-600', bg: 'bg-slate-50' },
}

const VehicleIcon = {
  bike: Bike,
  scooter: Bike,
  car: Car,
  motorcycle: Bike,
}

export function RidersList({ riders, onVerify, onReject, onDeactivate }: RidersListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  return (
    <div className="space-y-4">
      {riders.map((rider) => {
        const config = statusConfig[rider.status as keyof typeof statusConfig] || statusConfig.inactive
        const StatusIcon = config.icon

        const profile = rider.riderProfile || {}
        const idDocUrl = profile.idDocumentUrl
        const hasIdDocument = !!idDocUrl

        const absoluteDocUrl = idDocUrl?.startsWith('http') 
          ? idDocUrl 
          : `${API_BASE_URL}${idDocUrl}`

        return (
          <div key={rider.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <div
              className="p-6 cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() => setExpandedId(expandedId === rider.id ? null : rider.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-700">
                      {(() => {
                        const type = (profile.vehicleType || 'bike').toLowerCase()
                        const IconComponent = VehicleIcon[type as keyof typeof VehicleIcon] || Bike
                        return <IconComponent className="w-5 h-5" />
                      })()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{rider.firstName} {rider.lastName}</h3>
                      <p className="text-sm text-slate-500 capitalize">
                        {profile.vehicleType || 'Unknown'} Partner {profile.plateNumber ? `(${profile.plateNumber})` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-6 text-sm">
                    <span className="text-slate-600 flex items-center gap-1.5"><Mail className="w-4 h-4 text-slate-400" /> {rider.email}</span>
                    <span className="text-slate-600 flex items-center gap-1.5"><Phone className="w-4 h-4 text-slate-400" /> {rider.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${config.color} ${config.bg}`}><StatusIcon className="w-5 h-5" /></div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900 capitalize">{rider.status || 'pending'}</p>
                    <p className="text-xs text-slate-500">{rider.createdAt ? new Date(rider.createdAt).toLocaleDateString() : 'Recent'}</p>
                  </div>
                </div>
              </div>
            </div>

            {expandedId === rider.id && (
              <div className="border-t border-slate-200 p-6 bg-slate-50/70 space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm mb-3">Verification Documents</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-between shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-orange-500" />
                          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Uploaded Government ID Document</span>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded font-medium ${hasIdDocument ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {hasIdDocument ? 'Available' : 'Missing File'}
                        </span>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-xs text-slate-500 truncate max-w-[250px]">
                          {profile.idDocumentUrl ? profile.idDocumentUrl.split('/').pop() : 'No document attached'}
                        </p>
                        {hasIdDocument && (
                          <a 
                            href={absoluteDocUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-xs text-orange-500 font-semibold flex items-center gap-1 hover:underline"
                          >
                            View ID File <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-between shadow-sm">
                      <div>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Plate Number Registry</span>
                        <p className="text-xl font-mono font-bold text-slate-800">{profile.plateNumber || "UNREGISTERED"}</p>
                      </div>
                      <span className="text-xs text-slate-400">
                        Assigned for vehicle type: <b className="capitalize text-slate-600">{profile.vehicleType}</b>
                      </span>
                    </div>

                  </div>
                </div>

                {rider.status === 'pending' && !hasIdDocument && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-yellow-800">Cannot verify rider until the identification legal document has been uploaded.</p>
                  </div>
                )}

                {(rider.status === 'pending' || rider.status === 'verified') && (
                  <div className="flex gap-3 pt-2">
                    {hasIdDocument && rider.status === 'pending' && (
                      <Button onClick={() => onVerify?.(rider.id, 'pending')} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                        <Check className="w-4 h-4 mr-2" /> Verify Profiles & Documents
                      </Button>
                    )}
                    {rider.status === 'verified' && (
                      <Button onClick={() => onVerify?.(rider.id, 'verified')} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                        <Check className="w-4 h-4 mr-2" /> Activate Rider Account
                      </Button>
                    )}
                    {rider.status === 'pending' && (
                      <Button onClick={() => onReject?.(rider.id)} variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50">
                        <X className="w-4 h-4 mr-2" /> Reject Registration Application
                      </Button>
                    )}
                  </div>
                )}

                {rider.status === 'active' && (
                  <div className="flex gap-3 pt-2">
                    <Button onClick={() => onDeactivate?.(rider.id)} variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50">
                      <X className="w-4 h-4 mr-2" /> Deactivate Account Permissions
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

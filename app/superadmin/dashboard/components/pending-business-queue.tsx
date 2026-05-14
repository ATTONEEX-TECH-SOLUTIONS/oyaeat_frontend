'use client'

import { useMemo, useState } from 'react'
import type { Business } from '@/lib/api/superadmin'
import { approveBusiness, rejectBusiness, suspendBusiness } from '@/lib/api/superadmin'

function formatDate(value?: string) {
  if (!value) return '-'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleString()
}

function businessDisplayName(b: Business) {
  return b.businessName || b.name || `Business #${b.id}`
}

export function PendingBusinessQueue({
  businesses,
  onChanged,
}: {
  businesses: Business[]
  onChanged?: () => void
}) {
  const [busyId, setBusyId] = useState<number | null>(null)

  const pending = useMemo(
    () => businesses.filter((b) => b.status === 'pending_review'),
    [businesses]
  )

  const handleApprove = async (id: number) => {
    try {
      setBusyId(id)
      await approveBusiness(id)
      onChanged?.()
    } finally {
      setBusyId(null)
    }
  }

  const handleReject = async (id: number) => {
    const reason = window.prompt('Rejection reason?')
    if (!reason?.trim()) return

    try {
      setBusyId(id)
      await rejectBusiness(id, reason.trim())
      onChanged?.()
    } finally {
      setBusyId(null)
    }
  }

  const handleSuspend = async (id: number) => {
    const reason = window.prompt('Suspension reason? (optional)') || ''
    try {
      setBusyId(id)
      await suspendBusiness(id, reason.trim())
      onChanged?.()
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="bg-card rounded-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Pending Businesses</h3>
          <p className="text-sm text-slate-600">
            Review and approve or reject new business registrations.
          </p>
        </div>

        <span className="text-sm font-medium text-slate-700">
          {pending.length} pending
        </span>
      </div>

      {pending.length === 0 ? (
        <div className="text-slate-600 text-sm">No pending businesses right now.</div>
      ) : (
        <div className="divide-y divide-slate-100">
          {pending.map((b) => {
            const owner = b.owner
            const isBusy = busyId === b.id

            return (
              <div key={b.id} className="py-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">
                      {businessDisplayName(b)}
                    </p>

                    <p className="text-sm text-slate-600">
                      Owner:{' '}
                      <span className="text-slate-800">
                        {owner
                          ? `${owner.firstName} ${owner.lastName} (${owner.email})`
                          : '—'}
                      </span>
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Submitted: {formatDate(b.createdAt)}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 text-xs font-semibold">
                    Pending review
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleApprove(b.id)}
                    disabled={isBusy}
                    className="px-3 py-2 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {isBusy ? 'Processing…' : 'Approve'}
                  </button>

                  <button
                    onClick={() => handleReject(b.id)}
                    disabled={isBusy}
                    className="px-3 py-2 text-sm rounded-md bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60"
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => handleSuspend(b.id)}
                    disabled={isBusy}
                    className="px-3 py-2 text-sm rounded-md border border-slate-300 text-slate-800 hover:bg-slate-50 disabled:opacity-60"
                  >
                    Suspend
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
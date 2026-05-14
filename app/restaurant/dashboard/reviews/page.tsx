'use client'

import { useEffect, useState } from 'react'
import { vendorApi, type ReviewsData } from '@/lib/api/vendor'
import { Search, Star, RefreshCw, XCircle, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'

const C = {
  green:      '#1B4332',
  greenMid:   '#2D6A4F',
  greenLight: '#52B788',
  bg:         '#f0f7f1',
  white:      '#FFFFFF',
  textDark:   '#111827',
  textMuted:  '#6B7C6E',
  border:     '#c8e6c9',
  error:      '#C0392B',
  amber:      '#D4860B',
}

export default function ReviewsPage() {
  const [data, setData] = useState<ReviewsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await vendorApi.getReviews({ page, limit: 10 })
      setData(res.data || null)
      if (res.pagination) {
        setTotalPages(res.pagination.totalPages)
      }
    } catch (e: any) {
      if (e?.message?.toLowerCase().includes('not found') || e?.message?.includes('404')) {
        setData(null)
      } else {
        setError(e?.message || 'Failed to load reviews')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [page])

  // Helper to render stars
  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <Star 
                key={i} 
                className={`h-4 w-4 ${i <= rating ? 'fill-current' : 'opacity-20'}`} 
                style={{ color: C.amber }} 
            />
        )
    }
    return <div className="flex gap-1">{stars}</div>
  }

  if (loading && !data) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <RefreshCw className="h-8 w-8 animate-spin" style={{ color: C.greenMid }} />
        <p className="font-medium" style={{ color: C.textMuted }}>Loading reviews...</p>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6 pb-10">
      
      {/* ── Header ── */}
      <div className="flex items-end justify-between">
        <div>
            <h1 className="text-2xl font-black tracking-tight" style={{ color: C.green }}>Customer Reviews</h1>
            <p className="mt-1 text-sm font-medium" style={{ color: C.textMuted }}>See what customers are saying about your food and service.</p>
        </div>
        <Button onClick={load} variant="outline" size="sm" className="gap-2" style={{ borderColor: C.border, color: C.greenMid }}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border p-12 text-center shadow-sm" style={{ backgroundColor: C.white, borderColor: C.border }}>
          <XCircle className="mb-3 h-12 w-12" style={{ color: C.error }} />
          <h2 className="text-xl font-bold" style={{ color: C.textDark }}>Failed to load reviews</h2>
          <p className="mt-2 text-sm" style={{ color: C.textMuted }}>{error}</p>
          <Button onClick={load} className="mt-6" variant="outline" style={{ borderColor: C.greenMid, color: C.greenMid }}>
            Try Again
          </Button>
        </div>
      ) : !data || data.totalReviews === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border p-16 text-center shadow-sm" style={{ backgroundColor: C.white, borderColor: C.border }}>
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: C.bg }}>
            <MessageSquare className="h-8 w-8" style={{ color: C.greenMid }} />
          </div>
          <h2 className="text-xl font-bold" style={{ color: C.textDark }}>No Reviews Yet</h2>
          <p className="mt-2 max-w-md text-sm" style={{ color: C.textMuted }}>You haven't received any reviews yet. Keep delivering great food and service to earn ratings!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* ── Summary Card ── */}
            <div className="md:col-span-1 rounded-2xl border shadow-sm p-6 flex flex-col items-center justify-center h-fit" style={{ backgroundColor: C.white, borderColor: C.border }}>
                <p className="text-5xl font-black" style={{ color: C.textDark }}>{data.averageRating.toFixed(1)}</p>
                <div className="my-2">{renderStars(Math.round(data.averageRating))}</div>
                <p className="text-sm font-bold uppercase tracking-widest text-center" style={{ color: C.textMuted }}>
                  Based on {data.totalReviews} review{data.totalReviews !== 1 ? 's' : ''}
                </p>

                {/* Rating Distribution */}
                <div className="mt-6 w-full space-y-2">
                    {[5, 4, 3, 2, 1].map((stars) => {
                        const count = (data.distribution as any)[stars] || 0
                        const percentage = data.totalReviews > 0 ? (count / data.totalReviews) * 100 : 0
                        return (
                            <div key={stars} className="flex items-center gap-3 text-xs font-semibold">
                                <span style={{ color: C.textDark }} className="w-8 flex items-center justify-end">{stars} <Star className="h-3 w-3 ml-0.5 fill-current" style={{ color: C.amber }} /></span>
                                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: C.bg }}>
                                    <div className="h-full rounded-full transition-all" style={{ width: `${percentage}%`, backgroundColor: C.greenMid }} />
                                </div>
                                <span style={{ color: C.textMuted }} className="w-8 text-right">{count}</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* ── Review List ── */}
            <div className="md:col-span-2 rounded-2xl border shadow-sm bg-white flex flex-col" style={{ borderColor: C.border }}>
                <div className="border-b px-6 py-4" style={{ borderColor: C.border }}>
                    <h3 className="font-bold text-lg" style={{ color: C.textDark }}>Recent Feedback</h3>
                </div>
                
                <div className="divide-y divide-[#e8f5e9] flex-1">
                    {data.reviews.map(review => (
                        <div key={review.id} className="p-6">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="font-bold text-base" style={{ color: C.textDark }}>{review.customerName}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                        {renderStars(review.rating)}
                                        <span className="text-xs font-medium" style={{ color: C.textMuted }}>
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                {review.orderId && (
                                    <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 rounded bg-[#F0F7F3] text-[#2D6A4F]">
                                        Order #{review.orderId}
                                    </span>
                                )}
                            </div>
                            {review.comment && (
                                <p className="mt-3 text-sm leading-relaxed" style={{ color: '#4b5563' }}>
                                    "{review.comment}"
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-auto px-6 py-4 border-t" style={{ borderColor: C.border }}>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page <= 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            style={{ borderColor: C.border, color: C.textDark }}
                        >
                            Previous
                        </Button>
                        <span className="text-sm font-semibold" style={{ color: C.textMuted }}>
                            Page {page} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page >= totalPages}
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            style={{ borderColor: C.border, color: C.textDark }}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>
            
        </div>
      )}
    </div>
  )
}

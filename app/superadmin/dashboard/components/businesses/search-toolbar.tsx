'use client'

import { Search, RefreshCw } from 'lucide-react'
import { C } from '@/config/config'

interface SearchToolbarProps {
  search: string
  setSearch: (val: string) => void
  onRefresh: () => void
  loading: boolean
}

export function SearchToolbar({ search, setSearch, onRefresh, loading }: SearchToolbarProps) {
  return (
    <div className="flex gap-3 mb-5">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: C.textMuted }} />
        <input
          placeholder="Search by business name or submitter..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full h-10 rounded-xl border pl-10 pr-4 text-sm outline-none bg-white text-inherit"
          style={{ borderColor: C.border }}
        />
      </div>
      <button
        onClick={onRefresh}
        disabled={loading}
        className="flex items-center gap-2 h-10 rounded-xl border px-4 text-sm font-semibold bg-white transition-colors"
        style={{ borderColor: C.border, color: C.greenMid }}
      >
        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        {loading ? 'Loading...' : 'Refresh'}
      </button>
    </div>
  )
}

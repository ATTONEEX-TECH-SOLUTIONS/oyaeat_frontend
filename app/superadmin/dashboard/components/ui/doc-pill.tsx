'use client'

import { Check, X } from 'lucide-react'

interface DocPillProps {
  label: string
  present: boolean
  icon: React.ElementType
}

export function DocPill({ label, present, icon: Icon }: DocPillProps) {
  return (
    <div className={`
      flex items-center gap-2 rounded-xl border px-3 py-2.5
      ${present ? 'border-[#D8F0E4] bg-[#F0FBF5]' : 'border-[#FDECEA] bg-[#FEF8F8]'}
    `}>
      <Icon className="h-4 w-4 flex-shrink-0" style={{ color: present ? '#2D6A4F' : '#C0392B' }} />
      <span className="text-xs font-semibold text-foreground">{label}</span>
      <span className="ml-auto">
        {present
          ? <Check className="h-3.5 w-3.5" style={{ color: '#2D6A4F' }} />
          : <X     className="h-3.5 w-3.5" style={{ color: '#C0392B' }} />
        }
      </span>
    </div>
  )
}

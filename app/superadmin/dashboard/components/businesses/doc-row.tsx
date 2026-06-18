'use client'

import { FileText, FileCheck, Receipt } from 'lucide-react'
import { C } from '@/config/config'

export type DocumentItem = { type: string; url?: string }

export function DocRow({ doc }: { doc: DocumentItem }) {
  const iconMap: Record<string, React.ElementType> = {
    business_license: FileText,
    food_certificate: FileCheck,
    tax_id:           Receipt,
  }
  const Icon = iconMap[doc.type] ?? FileText

  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card px-3 py-2.5" style={{ borderColor: C.border }}>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 flex-shrink-0" style={{ color: C.greenMid }} />
        <span className="text-xs font-semibold capitalize text-foreground">
          {doc.type.replace(/_/g, ' ')}
        </span>
      </div>
      {doc.url ? (
        <a
          href={doc.url}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-bold hover:underline"
          style={{ color: C.greenMid }}
        >
          View
        </a>
      ) : (
        <span className="text-xs text-muted-foreground">No file</span>
      )}
    </div>
  )
}

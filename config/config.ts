import { Clock, Check, X, PauseCircle, FileText, Store, XCircle } from 'lucide-react'

export const C = {
  green:      '#1B4332',
  greenMid:   '#2D6A4F',
  greenLight: '#52B788',
  amber:      '#D4860B',
  amberLight: '#F4A620',
  bg:         '#F5F1EB',
  white:      '#FFFFFF',
  textDark:   'inherit',
  textMuted:  '#6B7C6E',
  border:     '#D8E4DC',
  error:      '#C0392B',
}

export const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pending_review: { label: 'Pending',   color: C.amber,    bg: '#FEF3CD', icon: Clock       },
  approved:       { label: 'Approved',  color: C.greenMid, bg: '#D8F0E4', icon: Check       },
  rejected:       { label: 'Rejected',  color: C.error,    bg: '#FDECEA', icon: X           },
  suspended:      { label: 'Suspended', color: '#6B7C6E',  bg: '#E8EEEB', icon: PauseCircle },
  draft:          { label: 'Draft',     color: '#6B7C6E',  bg: '#E8EEEB', icon: FileText    },
}

export const STATUS_TABS = [
  { key: 'all',            label: 'All'       },
  { key: 'pending_review', label: 'Pending'   },
  { key: 'approved',       label: 'Approved'  },
  { key: 'rejected',       label: 'Rejected'  },
  { key: 'suspended',      label: 'Suspended' },
]

export const getStatusCfg = (status: string) => STATUS_CONFIG[status] ?? STATUS_CONFIG.draft

// ── Shared Domain Typings ───────────────────────────────────────────────────

export type DocumentItem = { 
  type: string; 
  url?: string; 
}

export type Submitter = { 
  name: string; 
  email: string; 
  phone?: string; 
}

export type Business = {
  id: number
  name: string
  status: 'pending_review' | 'approved' | 'rejected' | 'suspended' | 'draft' | string
  submitter: Submitter
  documents: DocumentItem[]
  rejectionReason?: string | null
  createdAt?: string
}

export type Restaurant = {
  id: string
  name: string
  email: string
  phone: string
  address: string
  cuisineType: string
  status: 'pending_review' | 'approved' | 'rejected' | 'suspended' | 'draft' | string
  createdAt: string
  rejectionReason?: string | null
  documents: { 
    businessLicense: boolean; 
    foodLicense: boolean; 
    taxId: boolean; 
  }
}

'use client'

import { useState, useEffect, ReactNode } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ReasonModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (reason: string) => void
  title?: string
  description?: string
  label?: string
  placeholder?: string
  confirmButtonVariant?: 'danger' | 'warning' | 'primary'
  confirmButtonText?: string
  children?: ReactNode // 🚀 ADDED: Supports custom sub-component injections
}

export function ReasonModal({
  isOpen,
  onClose,
  onSubmit,
  title = 'Enter Reason',
  description = 'Please provide an official reason for this action.',
  label = 'Reason Details',
  placeholder = 'Type your reason here...',
  confirmButtonVariant = 'primary',
  confirmButtonText = 'Confirm',
  children, // 🚀 DESTRUCTURED: Extract safely into the render loop scope
}: ReasonModalProps) {
  const [reasonText, setReasonText] = useState('')

  // Reset input value when modal visibility state cycles
  useEffect(() => {
    if (isOpen) setReasonText('')
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reasonText.trim()) return
    onSubmit(reasonText.trim())
  };

  // Resolve custom branding variations based on action intent
  const getVariantStyles = () => {
    switch (confirmButtonVariant) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-600'
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-700 focus-visible:ring-amber-600'
      default:
        return 'bg-[#2D6A4F] hover:bg-[#1B4332] focus-visible:ring-[#1B4332]'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-card rounded-2xl border border-border shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className={`h-5 w-5 ${confirmButtonVariant === 'danger' ? 'text-red-500' : 'text-amber-500'}`} />
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              {title}
            </h2>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Core Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-5 space-y-4">
            <p className="text-sm text-muted-foreground leading-normal">
              {description}
            </p>

            {/* 🚀 DYNAMIC CHILDREN SLOT: Suspension strategy selection toggle injects right here */}
            {children}

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {label}
              </label>
              <textarea
                required
                autoFocus
                rows={4}
                placeholder={placeholder}
                className="w-full p-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#1B4332] focus:border-[#1B4332] text-sm resize-none"
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
              />
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="p-4 bg-muted/40 border-t border-border flex justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl border-border bg-card font-medium text-sm text-foreground h-9"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!reasonText.trim()}
              className={`rounded-xl font-semibold text-sm text-white h-9 shadow-sm transition-colors px-4 border-none ${getVariantStyles()}`}
            >
              {confirmButtonText}
            </Button>
          </div>
        </form>

      </div>
    </div>
  )
}

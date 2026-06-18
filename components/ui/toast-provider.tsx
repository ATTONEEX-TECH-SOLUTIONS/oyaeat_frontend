'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  title: string
  description?: string
  type: ToastType
}

interface ToastContextType {
  toast: (title: string, description?: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback((title: string, description?: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, title, description, type }])

    // Automatically dismiss the message card after 4 seconds
    setTimeout(() => {
      removeToast(id)
    }, 4000)
  }, [removeToast])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      
      {/* Floating Canvas Portal Node Stack Container */}
      {/* ── Updated Floating Canvas Stack Container ── */}
<div className="fixed bottom-5 right-5 z-[9999] w-full max-w-sm space-y-3 pointer-events-none flex flex-col justify-end">
  {toasts.map((t) => {
    const isDestructive = t.type === 'error'
    return (
      <Alert
        key={t.id}
        variant={isDestructive ? 'destructive' : 'default'}
        className={`pointer-events-auto shadow-xl bg-white border border-border transition-all duration-300 transform translate-y-0 animate-in slide-in-from-bottom-5 opacity-100 ${
          t.type === 'success' ? 'border-[#52B788]/40 bg-[#F0F7F3]' : ''
        }`}
        style={{ opacity: 1 }} // Explicit safeguard check override
      >
        <div className="flex items-start gap-3 w-full pr-4">
          {t.type === 'success' && <CheckCircle className="h-5 w-5 text-[#2D6A4F] shrink-0" />}
          {t.type === 'error' && <AlertCircle className="h-5 w-5 text-destructive shrink-0" />}
          {t.type === 'info' && <Info className="h-5 w-5 text-blue-500 shrink-0" />}
          
          <div className="flex-1">
            <AlertTitle className={`font-bold ${t.type === 'success' ? 'text-[#1B4332] text-sm' : 'text-sm'}`}>
              {t.title}
            </AlertTitle>
            {t.description && (
              <AlertDescription className={`text-xs mt-0.5 ${t.type === 'success' ? 'text-[#2D6A4F]/90' : 'text-muted-foreground'}`}>
                {t.description}
              </AlertDescription>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => removeToast(t.id)}
          className="absolute top-3 right-3 p-1 rounded-md opacity-40 hover:opacity-100 text-foreground transition-opacity"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </Alert>
    )
  })}
</div>

    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be bundled inside a ToastProvider element')
  return context
}

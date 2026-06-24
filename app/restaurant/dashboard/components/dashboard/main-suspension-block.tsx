'use client'

import React, { useState } from 'react'

interface MainSuspensionBlockProps {
  businessName: string
  rejectionReason?: string
  businessId: string | number
}

export function MainSuspensionBlock({ businessName, rejectionReason, businessId }: MainSuspensionBlockProps) {
  const [appealReason, setAppealReason] = useState('')
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null)
  const [isSubmittingAppeal, setIsSubmittingAppeal] = useState(false)
  const [appealSubmitted, setAppealSubmitted] = useState(false)

    const handleAppealSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!appealReason.trim()) return

    setIsSubmittingAppeal(true)
    try {
      const formData = new FormData()
      formData.append('businessId', String(businessId))
      formData.append('statement', appealReason.trim())
      if (evidenceFile) {
        formData.append('evidence', evidenceFile)
      }

      // 🚀 THE FIX: Use your active production API environment variable key name
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'
      
      const response = await fetch(`${API_URL}/compliance/appeal`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('vendor_token') || ''}`
          // Note: Leave out 'Content-Type'. Browser must auto-inject boundaries for FormData!
        },
        body: formData
      })

      const result = await response.json()
      if (!response.ok || !result.success) throw new Error(result.message || 'Appeal processing error')

      setAppealSubmitted(true)
    } catch (err: any) {
      console.error("Appeal failed:", err)
      alert(err.message || 'Unable to register appeal records.')
    } finally {
      setIsSubmittingAppeal(false)
    }
  }


  return (
    <div className="p-8 max-w-2xl mx-auto my-12 bg-white border border-rose-200 rounded-2xl shadow-sm">
      <div className="flex items-center gap-2">
        <span className="bg-rose-50 text-rose-700 border border-rose-200 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
          Account Suspended
        </span>
      </div>
      
      <h2 className="text-2xl font-black text-gray-900 mt-4 mb-2 tracking-tight">
        Your Vendor Access Has Been Suspended
      </h2>
      
      <p className="text-gray-500 text-sm leading-relaxed mb-6">
        Compliance operations have temporarily deactivated sales operations for **{businessName || 'this restaurant'}**. 
        Please review the official enforcement reason provided below:
        
        <strong className="text-rose-800 block mt-3 text-base font-medium bg-rose-50/60 border border-rose-100 p-4 rounded-xl whitespace-pre-wrap">
          "⚠️ {rejectionReason || 'Your account is under temporary administrative review. Please submit compliance documentation.'}"
        </strong>
      </p>

      <div className="border-t border-gray-100 pt-6">
        {appealSubmitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-800 text-sm">
            <strong>✓ Appeal Received Successfully.</strong> Our operational compliance team typically validates restaurant records within 24 to 48 hours. Please check back regularly.
          </div>
        ) : (
          <form onSubmit={handleAppealSubmit} className="space-y-4">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Submit Operational Appeal</h3>
            
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Statement of Rectification</label>
              <textarea
                required
                rows={3}
                className="w-full text-sm border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-rose-500"
                placeholder="Explain what steps you have taken to address the compliance issue..."
                value={appealReason}
                onChange={(e) => setAppealReason(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Supporting Evidence</label>
              <input
                type="file"
                className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
                onChange={(e) => setEvidenceFile(e.target.files ? e.target.files[0] : null)}
              />
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button 
                type="submit"
                disabled={isSubmittingAppeal}
                className="bg-rose-700 text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-rose-800 transition shadow-sm disabled:opacity-50"
              >
                {isSubmittingAppeal ? 'Submitting Appeal...' : 'Submit Official Appeal'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

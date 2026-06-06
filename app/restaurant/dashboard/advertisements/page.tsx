'use client'

import { useState } from 'react'
import { Megaphone, Users, Type, FileText, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button' // Adjust relative paths to match your layout utils

export default function RestaurantAdvertPage() {
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    targetRole: 'all',
  })
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSuccessMsg(null)
    setErrorMsg(null)

    if (!formData.content.trim()) {
      setErrorMsg('Advertisement content cannot be blank.')
      setSubmitting(false)
      return
    }

    try {
      // 💡 SAFETY SYNC: Pulling your core merchant login token credentials
      const token = localStorage.getItem('authToken') 

      const response = await fetch(`${API_BASE_URL}/vendor/advert/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(formData),
      })

      const resData = await response.json()

      if (response.ok) {
        setSuccessMsg(resData.message || 'Draft pitched successfully!')
        setFormData({ subject: '', content: '', targetRole: 'all' }) // Clear input matrix fields
      } else {
        setErrorMsg(resData.message || 'Failed to submit marketing draft.')
      }
    } catch (err: any) {
      console.error('Advert transmission error:', err)
      setErrorMsg('A network runtime or database connection error was encountered.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    // 🎨 COMPACT GRID LAYOUT CONTAINER: Snaps perfectly to avoid excessive whitespace expansion loops
    <div className="p-4 md:p-6 w-full flex flex-col justify-start items-start">
      <div className="w-full max-w-3xl bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden h-fit">
        
        {/* Header Block Section */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-emerald-700" /> Marketing & Broadcasts Campaign
            </h2>
            <p className="text-[11px] text-slate-500">Draft advertisement alerts or promos. Submissions are sanitized and broadcasted live by administration teams.</p>
          </div>
        </div>

        {/* Global Feedback Status Toasts Panels */}
        <div className="px-4 pt-4">
          {successMsg && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-3 py-2 rounded-lg flex items-start gap-2 text-xs">
              <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-bold">Draft Pushed for Review</p>
                <p className="text-[11px] mt-0.5 text-green-700/90">{successMsg}</p>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded-lg flex items-start gap-2 text-xs">
              <AlertCircle className="w-4 h-4 mt-0.5 text-red-600 flex-shrink-0" />
              <p className="font-medium">{errorMsg}</p>
            </div>
          )}
        </div>

        {/* Dense Campaign Composition Inputs Form Matrix */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 h-fit">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Subject Title */}
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Campaign Subject Header</label>
              <div className="relative">
                <Type className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g., Weekend Special Discount Offer!"
                  value={formData.subject}
                  onChange={(e) => setFormData(p => ({ ...p, subject: e.target.value }))}
                  className="w-full bg-white border border-slate-200 rounded-lg py-1.5 pl-8 pr-2.5 text-xs text-slate-900 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                />
              </div>
            </div>

            {/* Target View Audience Role */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Target Audience Group</label>
              <div className="relative">
                <Users className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <select
                  value={formData.targetRole}
                  onChange={(e) => setFormData(p => ({ ...p, targetRole: e.target.value }))}
                  className="w-full bg-white border border-slate-200 rounded-lg py-1.5 pl-8 pr-8 text-xs text-slate-900 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.6rem_auto] bg-[right_0.6rem_center] bg-no-repeat"
                >
                  <option value="all">Everyone (All App Users)</option>
                  <option value="customer">Customers (Food Buyers)</option>
                  <option value="rider">Riders (Delivery Fleet)</option>
                </select>
              </div>
            </div>

            {/* Campaign Body Content Copy Textarea */}
            <div className="sm:col-span-3 space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Broadcast Message Content</label>
                <span className={`text-[9px] font-bold px-1 rounded ${formData.content.length > 220 ? 'text-red-600 bg-red-50' : 'text-slate-400 bg-slate-50'}`}>
                  {formData.content.length} / 250 Characters
                </span>
              </div>
              <div className="relative">
                <FileText className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
                <textarea
                  required
                  maxLength={250}
                  rows={4}
                  placeholder="Type the full message parameters of your advertisement here..."
                  value={formData.content}
                  onChange={(e) => setFormData(p => ({ ...p, content: e.target.value }))}
                  className="w-full bg-white border border-slate-200 rounded-lg py-1.5 pl-8 pr-2.5 text-xs text-slate-900 focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 font-sans resize-none"
                />
              </div>
            </div>

          </div>

          {/* Form Action Submissions Bar */}
          <div className="pt-2 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-45 cursor-pointer shadow-sm w-full sm:w-auto justify-center"
            >
              {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              {submitting ? 'Submitting Draft...' : 'Submit Advertisement for Verification'}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}

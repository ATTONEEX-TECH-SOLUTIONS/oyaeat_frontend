'use client'

import { useEffect, useMemo, useState } from 'react'
import { Plus, Edit2, Trash2, Phone, Mail, Users } from 'lucide-react'
import { vendorApi, type StaffMember } from '@/lib/api/vendor'

// ── Shared input style ────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.625rem 1rem',
  backgroundColor: '#ffffff',
  border: '1px solid #c8e6c9',
  borderRadius: '0.5rem',
  color: '#1a5c2a',
  fontSize: '0.875rem',
  outline: 'none',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: 600,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  color: '#4a7c59',
  marginBottom: '0.375rem',
}

// ── Staff Form Modal ──────────────────────────────────────────────────────
type ModalProps = {
  open: boolean
  mode: 'create' | 'edit'
  initial?: StaffMember | null
  onClose: () => void
  onSaved: (staff: StaffMember) => void
}

function StaffFormModal({ open, mode, initial, onClose, onSaved }: ModalProps) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    fullName: initial?.fullName || '',
    role:     initial?.role     || '',
    email:    initial?.email    || '',
    phone:    initial?.phone    || '',
    status:   initial?.status   || 'Active',
  })

  useEffect(() => {
    if (!open) return
    setError('')
    setForm({
      fullName: initial?.fullName || '',
      role:     initial?.role     || '',
      email:    initial?.email    || '',
      phone:    initial?.phone    || '',
      status:   initial?.status   || 'Active',
    })
  }, [open, initial])

  if (!open) return null

  const focusGreen  = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => (e.currentTarget.style.borderColor = '#2e7d32')
  const blurGreen   = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => (e.currentTarget.style.borderColor = '#c8e6c9')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.fullName.trim()) return setError('Full name is required')
    if (!form.role.trim())     return setError('Role is required')
    try {
      setSubmitting(true)
      const payload = {
        fullName: form.fullName.trim(),
        role:     form.role.trim(),
        email:    form.email.trim() || null,
        phone:    form.phone.trim() || null,
        status:   form.status,
      }
      if (mode === 'edit' && initial?.id) {
        const res = await vendorApi.updateStaff(initial.id, payload)
        onSaved(res.staff)
      } else {
        const res = await vendorApi.createStaff(payload)
        onSaved(res.staff)
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to save staff')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
      <div className="w-full max-w-md rounded-2xl shadow-xl overflow-hidden"
        style={{ backgroundColor: '#ffffff', border: '1px solid #c8e6c9' }}>

        {/* Header */}
        <div className="px-6 py-5 border-b" style={{ backgroundColor: '#f5faf6', borderColor: '#e8f5e9' }}>
          <h2 className="text-lg font-bold" style={{ color: '#1a5c2a' }}>
            {mode === 'edit' ? 'Edit Staff Member' : 'Add Staff Member'}
          </h2>
          <p className="text-xs mt-0.5" style={{ color: '#4a7c59' }}>
            {mode === 'edit' ? 'Update staff details below' : 'Fill in the details to add a new staff member'}
          </p>
        </div>

        {/* Body */}
        <form className="px-6 py-5 space-y-4" onSubmit={submit}>
          {error && (
            <div className="text-sm font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-4 py-2">
              {error}
            </div>
          )}

          <div>
            <label style={labelStyle}>Full Name</label>
            <input type="text" placeholder="e.g., Adewale Okon" style={inputStyle}
              value={form.fullName} disabled={submitting}
              onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
              onFocus={focusGreen} onBlur={blurGreen} />
          </div>

          <div>
            <label style={labelStyle}>Role</label>
            <input type="text" placeholder="e.g., Chef, Cashier, Driver" style={inputStyle}
              value={form.role} disabled={submitting}
              onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
              onFocus={focusGreen} onBlur={blurGreen} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Email <span style={{ color: '#a5d6a7', textTransform: 'none', fontWeight: 400 }}>(optional)</span></label>
              <input type="email" placeholder="email@example.com" style={inputStyle}
                value={form.email} disabled={submitting}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                onFocus={focusGreen} onBlur={blurGreen} />
            </div>
            <div>
              <label style={labelStyle}>Phone <span style={{ color: '#a5d6a7', textTransform: 'none', fontWeight: 400 }}>(optional)</span></label>
              <input type="tel" placeholder="080XXXXXXXX" style={inputStyle}
                value={form.phone} disabled={submitting}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                onFocus={focusGreen} onBlur={blurGreen} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Status</label>
            <select style={inputStyle} value={form.status} disabled={submitting}
              onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
              onFocus={focusGreen} onBlur={blurGreen}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={submitting}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-colors"
              style={{ backgroundColor: '#ffffff', color: '#1a5c2a', borderColor: '#c8e6c9' }}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = '#f5faf6')}
              onMouseOut={e  => (e.currentTarget.style.backgroundColor = '#ffffff')}>
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: submitting ? '#4a7c59' : '#1a5c2a', cursor: submitting ? 'not-allowed' : 'pointer' }}
              onMouseOver={e => { if (!submitting) e.currentTarget.style.backgroundColor = '#14491f' }}
              onMouseOut={e  => { if (!submitting) e.currentTarget.style.backgroundColor = '#1a5c2a' }}>
              {submitting ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Staff Page ────────────────────────────────────────────────────────────
export default function StaffPage() {
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [staff, setStaff]         = useState<StaffMember[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing]     = useState<StaffMember | null>(null)

  const load = async () => {
    setError('')
    setLoading(true)
    try {
      const data = await vendorApi.getStaff()
      setStaff(Array.isArray(data.staff) ? data.staff : [])
    } catch (e: any) {
      setError(e?.message || 'Failed to load staff')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const onRemove = async (id: number) => {
    if (!window.confirm('Remove this staff member?')) return
    try {
      await vendorApi.deleteStaff(id)
      setStaff(prev => prev.filter(s => s.id !== id))
    } catch (e: any) {
      alert(e?.message || 'Failed to remove staff')
    }
  }

  const { active, total } = useMemo(() => ({
    active: staff.filter(s => (s.status || '').toLowerCase() === 'active').length,
    total:  staff.length,
  }), [staff])

  // Avatar initials from name
  const initials = (name: string) =>
    name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#1a5c2a' }}>Staff Management</h1>
          <p className="mt-1 text-sm" style={{ color: '#4a7c59' }}>
            Manage your kitchen and delivery staff.
          </p>
        </div>

        {/* Summary badges + Add button */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium"
            style={{ backgroundColor: '#e8f5e9', borderColor: '#a5d6a7', color: '#2e7d32' }}>
            <Users className="w-4 h-4" />
            {active} active / {total} total
          </div>
          <button
            onClick={() => { setEditing(null); setModalOpen(true) }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: '#1a5c2a' }}
            onMouseOver={e => (e.currentTarget.style.backgroundColor = '#14491f')}
            onMouseOut={e  => (e.currentTarget.style.backgroundColor = '#1a5c2a')}
          >
            <Plus className="w-4 h-4" />
            Add Staff
          </button>
        </div>
      </div>

      {error && (
        <div className="text-sm font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-4 py-2">
          {error}
        </div>
      )}

      {/* Staff cards */}
      {loading ? (
        <p className="text-sm" style={{ color: '#4a7c59' }}>Loading staff…</p>
      ) : staff.length === 0 ? (
        <div className="bg-white border border-[#c8e6c9] rounded-xl p-10 text-center">
          <Users className="w-10 h-10 mx-auto mb-3" style={{ color: '#a5d6a7' }} />
          <p className="font-semibold" style={{ color: '#1a5c2a' }}>No staff members yet</p>
          <p className="text-sm mt-1" style={{ color: '#4a7c59' }}>Click "Add Staff" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {staff.map((member) => {
            const isActive = (member.status || '').toLowerCase() === 'active'
            return (
              <div key={member.id}
                className="bg-white rounded-xl border shadow-sm flex flex-col transition-colors"
                style={{ borderColor: '#c8e6c9' }}
                onMouseOver={e => (e.currentTarget.style.borderColor = '#2e7d32')}
                onMouseOut={e  => (e.currentTarget.style.borderColor = '#c8e6c9')}
              >
                {/* Card header */}
                <div className="px-5 pt-5 pb-4 flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                    style={{ backgroundColor: '#1a5c2a' }}>
                    {initials(member.fullName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-bold text-sm truncate" style={{ color: '#1a5c2a' }}>{member.fullName}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#4a7c59' }}>{member.role}</p>
                      </div>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border flex-shrink-0"
                        style={isActive
                          ? { backgroundColor: '#e8f5e9', color: '#2e7d32', borderColor: '#a5d6a7' }
                          : { backgroundColor: '#f5f5f5', color: '#6b7280', borderColor: '#e5e7eb' }
                        }>
                        {member.status || 'Active'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact info */}
                <div className="px-5 pb-4 space-y-1.5 border-t border-b" style={{ borderColor: '#e8f5e9' }}>
                  <div className="pt-3" />
                  {member.email ? (
                    <div className="flex items-center gap-2 text-xs" style={{ color: '#4a7c59' }}>
                      <Mail className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#2e7d32' }} />
                      <span className="truncate">{member.email}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs" style={{ color: '#a5d6a7' }}>
                      <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>No email</span>
                    </div>
                  )}
                  {member.phone ? (
                    <div className="flex items-center gap-2 text-xs" style={{ color: '#4a7c59' }}>
                      <Phone className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#2e7d32' }} />
                      <span>{member.phone}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs" style={{ color: '#a5d6a7' }}>
                      <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>No phone</span>
                    </div>
                  )}
                  <div className="pb-1" />
                </div>

                {/* Actions */}
                <div className="px-5 py-3 flex gap-2">
                  <button
                    onClick={() => { setEditing(member); setModalOpen(true) }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold border transition-colors"
                    style={{ backgroundColor: '#ffffff', color: '#1a5c2a', borderColor: '#c8e6c9' }}
                    onMouseOver={e => (e.currentTarget.style.backgroundColor = '#e8f5e9')}
                    onMouseOut={e  => (e.currentTarget.style.backgroundColor = '#ffffff')}
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => onRemove(member.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold border transition-colors text-rose-600 border-rose-200"
                    style={{ backgroundColor: '#ffffff' }}
                    onMouseOver={e => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                    onMouseOut={e  => (e.currentTarget.style.backgroundColor = '#ffffff')}
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <StaffFormModal
        open={modalOpen}
        mode={editing ? 'edit' : 'create'}
        initial={editing}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        onSaved={(saved) => {
          setStaff(prev => {
            const exists = prev.some(x => x.id === saved.id)
            return exists ? prev.map(x => x.id === saved.id ? saved : x) : [saved, ...prev]
          })
          setModalOpen(false)
          setEditing(null)
        }}
      />
    </div>
  )
}
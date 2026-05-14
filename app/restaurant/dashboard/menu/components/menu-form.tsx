'use client'

import React, { useMemo, useState } from 'react'
import { X, ImagePlus } from 'lucide-react'
import { vendorApi, type MenuItem } from '@/lib/api/vendor'

interface MenuFormProps {
  item: MenuItem | null
  onClose: () => void
  onCreated: (item: MenuItem) => void
  onUpdated: (item: MenuItem) => void
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.625rem 1rem',
  backgroundColor: '#ffffff',
  border: '1px solid #c8e6c9',
  borderRadius: '0.5rem',
  color: '#1a5c2a',
  fontSize: '0.875rem',
  outline: 'none',
  transition: 'border-color 0.15s',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#4a7c59',
  marginBottom: '0.375rem',
}

export default function MenuForm({ item, onClose, onCreated, onUpdated }: MenuFormProps) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    category: item?.category || 'Pizza',
    price: item?.price != null ? String(item.price) : '',
    description: item?.description || '',
    available: item?.available ?? true,
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const previewUrl = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile)
    return item?.imageUrl || ''
  }, [imageFile, item?.imageUrl])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleFocus = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    e.currentTarget.style.borderColor = '#2e7d32'
  }

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    e.currentTarget.style.borderColor = '#c8e6c9'
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null

    if (!file) {
      setImageFile(null)
      return
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file')
      e.target.value = ''
      return
    }

    setError('')
    setImageFile(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name.trim()) return setError('Item name is required')
    if (!formData.category.trim()) return setError('Category is required')
    if (formData.price === '' || isNaN(Number(formData.price))) {
      return setError('Valid price is required')
    }

    const payload = {
      name: formData.name.trim(),
      category: formData.category.trim(),
      price: Number(formData.price),
      description: formData.description?.trim() || null,
      available: formData.available,
      image: imageFile,
    }

    try {
      setSubmitting(true)

      if (item?.id) {
        const res = await vendorApi.updateMenuItem(item.id, payload)
        onUpdated(res.item)
      } else {
        const res = await vendorApi.createMenuItem(payload)
        onCreated(res.item)
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to save menu item')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-xl overflow-hidden"
        style={{ backgroundColor: '#ffffff', border: '1px solid #c8e6c9' }}
      >
        <div
          className="flex items-center justify-between px-6 py-5 border-b"
          style={{ borderColor: '#e8f5e9', backgroundColor: '#f5faf6' }}
        >
          <div>
            <h2 className="text-lg font-bold" style={{ color: '#1a5c2a' }}>
              {item ? 'Edit Menu Item' : 'Add Menu Item'}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: '#4a7c59' }}>
              {item ? 'Update the details below' : 'Fill in the details to add a new item'}
            </p>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: '#4a7c59' }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e8f5e9')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="text-sm font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-4 py-2">
              {error}
            </div>
          )}

          <div>
            <label style={labelStyle}>Item Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="e.g., Jollof Rice"
              style={inputStyle}
              disabled={submitting}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={inputStyle}
                disabled={submitting}
              >
                <option>Pizza</option>
                <option>Salads</option>
                <option>Starters</option>
                <option>Desserts</option>
                <option>Beverages</option>
                <option>Rice Dishes</option>
                <option>Soups</option>
                <option>Grills</option>
                <option>Sides</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Price (₦)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder="0.00"
                step="0.01"
                style={inputStyle}
                disabled={submitting}
                required
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Item Image <span style={{ color: '#a5d6a7', textTransform: 'none', fontWeight: 400 }}>(optional)</span></label>
            <div 
              className="relative w-full rounded-xl border-2 border-dashed overflow-hidden flex flex-col items-center justify-center cursor-pointer group transition-colors"
              style={{ height: '140px', borderColor: '#c8e6c9', backgroundColor: '#fcfdfc' }}
              onClick={() => document.getElementById('imageUpload')?.click()}
              onMouseOver={e => e.currentTarget.style.borderColor = '#2e7d32'}
              onMouseOut={e => e.currentTarget.style.borderColor = '#c8e6c9'}
            >
               {previewUrl ? (
                 <>
                   <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <span className="text-white font-bold text-sm">Change Image</span>
                   </div>
                 </>
               ) : (
                 <div className="flex flex-col items-center gap-2" style={{ color: '#4a7c59' }}>
                   <div className="w-10 h-10 rounded-full bg-[#e8f5e9] flex items-center justify-center text-[#2e7d32] group-hover:bg-[#d8e4dc] transition-colors">
                      <ImagePlus className="w-5 h-5" />
                   </div>
                   <span className="text-xs font-semibold">Click to upload an image</span>
                 </div>
               )}
               <input id="imageUpload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={submitting} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Describe your item..."
              rows={3}
              style={{ ...inputStyle, resize: 'none' }}
              disabled={submitting}
            />
          </div>

          <div className="flex items-center gap-3 py-1">
            <div className="relative">
              <input
                type="checkbox"
                name="available"
                id="available"
                checked={formData.available}
                onChange={handleChange}
                className="sr-only"
                disabled={submitting}
              />
              <div
                onClick={() =>
                  !submitting && setFormData((p) => ({ ...p, available: !p.available }))
                }
                className="w-10 h-6 rounded-full cursor-pointer transition-colors flex items-center px-0.5"
                style={{ backgroundColor: formData.available ? '#1a5c2a' : '#c8e6c9' }}
              >
                <div
                  className="w-5 h-5 bg-card rounded-full shadow transition-transform"
                  style={{ transform: formData.available ? 'translateX(16px)' : 'translateX(0)' }}
                />
              </div>
            </div>

            <label
              htmlFor="available"
              className="text-sm cursor-pointer select-none"
              style={{ color: '#1a5c2a', fontWeight: 500 }}
              onClick={() =>
                !submitting && setFormData((p) => ({ ...p, available: !p.available }))
              }
            >
              Available for ordering
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-colors"
              style={{
                backgroundColor: '#ffffff',
                color: '#1a5c2a',
                borderColor: '#c8e6c9',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f5faf6')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
              style={{
                backgroundColor: submitting ? '#4a7c59' : '#1a5c2a',
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}
              onMouseOver={(e) => {
                if (!submitting) e.currentTarget.style.backgroundColor = '#14491f'
              }}
              onMouseOut={(e) => {
                if (!submitting) e.currentTarget.style.backgroundColor = '#1a5c2a'
              }}
            >
              {submitting ? 'Saving…' : item ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
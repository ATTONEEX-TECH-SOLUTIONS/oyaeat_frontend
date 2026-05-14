'use client'

import { useEffect, useMemo, useState } from 'react'
import { Plus, Edit2, Trash2, Search } from 'lucide-react'
import MenuForm from './components/menu-form'
import { vendorApi, type MenuItem } from '@/lib/api/vendor'

export default function MenuPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setError('')
    setLoading(true)
    try {
      const data = await vendorApi.getMenu()
      setItems(Array.isArray(data.items) ? data.items : [])
    } catch (e: any) {
      setError(e?.message || 'Failed to load menu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return items
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term),
    )
  }, [items, searchTerm])

  const onDelete = async (id: number) => {
    if (!window.confirm('Delete this menu item?')) return
    try {
      await vendorApi.deleteMenuItem(id)
      setItems((prev) => prev.filter((x) => x.id !== id))
    } catch (e: any) {
      alert(e?.message || 'Failed to delete')
    }
  }

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#1a5c2a' }}>Menu Management</h1>
        <p className="mt-1 text-sm" style={{ color: '#4a7c59' }}>
          Manage your restaurant menu items and categories.
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-3 flex-col sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#4a7c59' }} />
          <input
            type="text"
            placeholder="Search items or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border outline-none transition"
            style={{
              backgroundColor: '#ffffff',
              borderColor: '#c8e6c9',
              color: '#1a5c2a',
            }}
            onFocus={e  => (e.currentTarget.style.borderColor = '#2e7d32')}
            onBlur={e   => (e.currentTarget.style.borderColor = '#c8e6c9')}
          />
        </div>

        {/* Add item button */}
        <button
          onClick={() => { setSelectedItem(null); setShowForm(true) }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors flex-shrink-0"
          style={{ backgroundColor: '#1a5c2a' }}
          onMouseOver={e => (e.currentTarget.style.backgroundColor = '#14491f')}
          onMouseOut={e  => (e.currentTarget.style.backgroundColor = '#1a5c2a')}
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="text-sm font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-4 py-2">
          {error}
        </div>
      )}

      {/* Menu Form Modal */}
      {showForm && (
        <MenuForm
          item={selectedItem}
          onClose={() => { setShowForm(false); setSelectedItem(null) }}
          onCreated={(newItem) => { setItems((p) => [newItem, ...p]); setShowForm(false); setSelectedItem(null) }}
          onUpdated={(updated) => { setItems((p) => p.map(x => x.id === updated.id ? updated : x)); setShowForm(false); setSelectedItem(null) }}
        />
      )}

      {/* Table */}
      <div className="bg-card border border-[#c8e6c9] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead style={{ backgroundColor: '#e8f5e9' }}>
              <tr>
                {['Item', 'Category', 'Price', 'Status', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: '#1a5c2a' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-sm" style={{ color: '#4a7c59' }}>
                    Loading menu items…
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-sm" style={{ color: '#4a7c59' }}>
                    No menu items found.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="transition-colors"
                    style={{ borderTop: idx > 0 ? '1px solid #e8f5e9' : undefined }}
                    onMouseOver={e  => (e.currentTarget.style.backgroundColor = '#f5faf6')}
                    onMouseOut={e   => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {/* Item */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl || '/placeholder.svg'}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover border"
                          style={{ borderColor: '#c8e6c9' }}
                        />
                        <div>
                          <p className="font-semibold text-sm" style={{ color: '#1a5c2a' }}>{item.name}</p>
                          {item.description && (
                            <p className="text-xs mt-0.5 truncate max-w-[200px]" style={{ color: '#4a7c59' }}>
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border"
                        style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', borderColor: '#a5d6a7' }}
                      >
                        {item.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 text-sm font-semibold" style={{ color: '#1a5c2a' }}>
                      ₦{Number(item.price || 0).toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border"
                        style={
                          item.available
                            ? { backgroundColor: '#e8f5e9', color: '#2e7d32', borderColor: '#a5d6a7' }
                            : { backgroundColor: '#fef2f2', color: '#dc2626', borderColor: '#fecaca' }
                        }
                      >
                        {item.available ? '✓ Available' : '✗ Out of Stock'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { setSelectedItem(item); setShowForm(true) }}
                          className="p-2 rounded-lg transition-colors"
                          style={{ color: '#2e7d32' }}
                          onMouseOver={e => (e.currentTarget.style.backgroundColor = '#e8f5e9')}
                          onMouseOut={e  => (e.currentTarget.style.backgroundColor = 'transparent')}
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="p-2 rounded-lg transition-colors text-rose-500"
                          onMouseOver={e => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                          onMouseOut={e  => (e.currentTarget.style.backgroundColor = 'transparent')}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
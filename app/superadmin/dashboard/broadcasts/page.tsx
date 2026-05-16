'use client'

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/app/superadmin/dashboard/components/sidebar';
import { Megaphone, Zap, Clock, Loader2, Trash2, CheckCircle, Sparkles, PlusCircle, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const GRADIENTS = [
  { id: 'g1', name: 'OyaEat Emerald', class: 'from-[#2d5f4f] to-slate-800' },
  { id: 'g2', name: 'Jollof Sunset', class: 'from-orange-500 to-red-500' },
  { id: 'g3', name: 'Ocean Teal', class: 'from-blue-500 to-teal-500' },
  { id: 'g4', name: 'Neon Purple', class: 'from-purple-500 to-indigo-500' },
];

export default function AdminBroadcastPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [approvedBusinesses, setApprovedBusinesses] = useState<any[]>([]);

  // Form states
  const [targetBusinessId, setTargetBusinessId] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [selectedGradient, setSelectedGradient] = useState('from-orange-500 to-red-500');
  const [durationHours, setDurationHours] = useState('24');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    async function initPage() {
      setLoading(true);
      await Promise.all([
        fetchActiveBroadcasts(),
        fetchApprovedRestaurants()
      ]);
      setLoading(false);
    }
    initPage();
  }, []);

  const fetchApprovedRestaurants = async () => {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('vendor_token');
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/admin/broadcasts/approved-list`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const json = await res.json();
      if (json.success && Array.isArray(json.businesses)) {
        setApprovedBusinesses(json.businesses);
      }
    } catch (err) {
      console.error("Failed to load approved restaurant choices:", err);
    }
  };

  const fetchActiveBroadcasts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/public/promos`);
      const json = await res.json();
      if (json.success) {
        setBroadcasts(json.data);
      }
    } catch (err) {
      console.error("Failed to load active promotions:", err);
    }
  };

   const handleCreateBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetBusinessId || !title || !desc) {
      alert("Please select a restaurant and populate all fields.");
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('vendor_token'); 

      // Hits your case-safeguarded admin creation routing endpoint parameters
      const response = await fetch(`${API_BASE_URL}/admin/broadcasts/create`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          businessId: targetBusinessId,
          title,
          desc,
          bgGradient: selectedGradient,
          durationHours
        })
      });

      const json = await response.json();
      if (response.ok) {
        alert("Campaign broadcasted live across customer platforms successfully!");
        setTargetBusinessId('');
        setTitle('');
        setDesc('');
        fetchActiveBroadcasts(); // Instant UI list table update refresh
      } else {
        alert(`Server error: ${json.message}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      
      <main className="flex-1 overflow-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Megaphone className="text-orange-500" /> Dynamic Broadcast Controller
          </h1>
          <p className="text-slate-600 mt-2">
            Generate, review, and push active campaigns across consumer application carousel frameworks.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Create Form Column */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm xl:col-span-1 space-y-5">
            <div className="flex items-center gap-2 border-b pb-3 border-slate-100">
              <PlusCircle className="text-[#2d5f4f] w-5 h-5" />
              <h2 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">New Advert Broadcast</h2>
            </div>

            <form onSubmit={handleCreateBroadcast} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1">
                  <Store className="w-3.5 h-3.5" /> Select Restaurant Target
                </label>
                <select
                  required
                  value={targetBusinessId}
                  onChange={e => setTargetBusinessId(e.target.value)}
                  className="w-full h-11 px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:border-orange-500 transition-colors cursor-pointer text-slate-800"
                >
                  <option value="">-- Choose an Approved Vendor --</option>
                  {approvedBusinesses.map((b: any) => (
                    <option key={b.id} value={b.id}>
                      {b.name || "Unnamed Restaurant"} (ID: {b.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Advert Campaign Title</label>
                <Input required placeholder="e.g. 20% Off Jollof Fiesta" value={title} onChange={e => setTitle(e.target.value)} className="rounded-xl" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Short Description Caption</label>
                <Input required placeholder="e.g. Valid until 5PM today" value={desc} onChange={e => setDesc(e.target.value)} className="rounded-xl" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Campaign Lifespan (Hours)</label>
                <Input type="number" required placeholder="e.g. 24" value={durationHours} onChange={e => setDurationHours(e.target.value)} className="rounded-xl" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block">Select Layout Canvas Gradient</label>
                <div className="grid grid-cols-2 gap-2">
                  {GRADIENTS.map(g => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setSelectedGradient(g.class)}
                      className={`h-11 rounded-xl text-[10px] font-bold text-white bg-gradient-to-r ${g.class} border-2 px-2 transition-all ${selectedGradient === g.class ? 'border-orange-500 scale-95 shadow-md' : 'border-transparent'}`}
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              </div>

              <Button type="submit" disabled={submitting} className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-11 font-bold mt-4 shadow-sm">
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Dispatching Node...</> : "Broadcast Live Advert"}
              </Button>
            </form>
          </div>

          {/* Active Broadcast Tracking Grid Table Column */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm xl:col-span-2 space-y-4">
            <div className="flex items-center gap-2 border-b pb-3 border-slate-100">
              <Sparkles className="text-amber-500 w-5 h-5" />
              <h2 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Active Broadcast Streams</h2>
            </div>

            {loading ? (
              <div className="py-12 text-center text-sm font-medium text-slate-500 flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Verifying live carousel arrays...</div>
            ) : broadcasts.length === 0 ? (
              <div className="text-center py-16 text-slate-400 border border-dashed rounded-2xl text-xs">No active promotions are currently loaded in the system dashboard.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                      <th className="p-3">Restaurant Name</th>
                      <th className="p-3">Campaign Headline</th>
                      <th className="p-3">Visual Style Preview</th>
                      <th className="p-3">Expiration Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-slate-700 font-medium">
                    {broadcasts.map((promo, idx) => (
                      <tr key={promo.id || idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 font-bold text-slate-900">{promo.business?.name || `ID: ${promo.businessId}`}</td>
                        <td className="p-3">{promo.title}</td>
                        <td className="p-3">
                          <div className={`px-3 py-1.5 text-center rounded-xl bg-gradient-to-r ${promo.bgGradient} text-white font-extrabold text-[10px] w-28 shadow-sm`}>
                            {promo.desc ? promo.desc.substring(0, 15) : ""}...
                          </div>
                        </td>
                        <td className="p-3 text-xs text-slate-500 flex items-center gap-1 mt-1.5"><Clock className="w-3.5 h-3.5" /> {new Date(promo.expiresAt).toLocaleString([], {hour: '2-digit', minute:'2-digit', month:'short', day:'numeric'})}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

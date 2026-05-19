'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/app/superadmin/dashboard/components/sidebar';
import { Megaphone, Clock, Loader2, Sparkles, PlusCircle, Store, Upload, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminBroadcastPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [approvedBusinesses, setApprovedBusinesses] = useState<any[]>([]);

  // Form inputs tracking states
  const [targetBusinessId, setTargetBusinessId] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [durationHours, setDurationHours] = useState('24');
  
  // File upload and local state visual references
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  const getAuthToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('authToken') || 
           localStorage.getItem('admin_token') || 
           localStorage.getItem('vendor_token');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const fetchApprovedRestaurants = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/admin/broadcasts/approved-list`, {
        method: 'GET',
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
        setBroadcasts(json.data || []);
      }
    } catch (err) {
      console.error("Failed to load active promotions:", err);
    }
  };

  const handleCreateBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetBusinessId || !title || !desc || !selectedFile) {
      alert("Please populate all form inputs and select a graphics banner asset.");
      return;
    }

    setSubmitting(true);
    try {
      const token = getAuthToken(); 
      if (!token) {
        alert("Session expired. Please log back in.");
        return;
      }

      const formData = new FormData();
      formData.append('businessId', targetBusinessId);
      formData.append('title', title);
      formData.append('desc', desc);
      formData.append('durationHours', durationHours);
      formData.append('image', selectedFile);

      const response = await fetch(`${API_BASE_URL}/admin/broadcasts/create`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const json = await response.json();
      if (response.ok && json.success) {
        alert("Campaign banner asset uploaded and broadcasted live across system carousels!");
        setTargetBusinessId('');
        setTitle('');
        setDesc('');
        setSelectedFile(null);
        setPreviewUrl(null);
        fetchActiveBroadcasts(); 
      } else {
        alert(`Server error: ${json.message || 'Authorization tracking verification issue.'}`);
      }
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle IsActive status on click helper
  const handleToggleActiveStatus = async (id: number, currentStatus: boolean) => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const res = await fetch(`${API_BASE_URL}/admin/broadcasts/${id}/toggle`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      const json = await res.json();
      if (json.success) {
        // Update local state grid array instantly
        setBroadcasts(prev => prev.map(item => item.id === id ? { ...item, isActive: !currentStatus } : item));
      } else {
        alert(`Failed to update status: ${json.message}`);
      }
    } catch (err) {
      console.error("Failed toggling stream status visibility:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
        <span className="text-sm font-semibold text-slate-600">Syncing Admin Engine...</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      
      <main className="flex-1 overflow-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
             Advert Broadcasts
          </h1>
          <p className="text-slate-600 mt-2">
            Upload custom image promotional artwork to deploy across consumer system interface banners instantly.
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
                  className="w-full h-11 px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:border-orange-500 transition-colors text-slate-800"
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

              {/* Native Image Upload Zone UI rendering block */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide block flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-slate-500" /> Upload Campaign Image Graphic
                </label>
                
                <div className="flex flex-col gap-3">
                  {previewUrl && (
                    <div className="h-28 w-full rounded-xl bg-cover bg-center border shadow-inner relative overflow-hidden" style={{ backgroundImage: `url(${previewUrl})` }}>
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white text-[10px] bg-black/50 px-2 py-1 rounded-full font-bold">Image Select Preview</span>
                      </div>
                    </div>
                  )}
                  
                  <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 hover:border-orange-500 rounded-xl py-4 px-3 cursor-pointer transition-colors text-slate-500 hover:text-orange-500">
                    <Upload className="w-4 h-4" />
                    <span className="text-xs font-bold">{selectedFile ? "Replace Selected Asset File" : "Choose Image Graphic File"}</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>

              <Button type="submit" disabled={submitting} className="w-full bg-[#2e7d32] hover:bg-[#2e7d32] text-white rounded-xl h-11 font-bold mt-4 shadow-sm">
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Dispatching Asset Cargo...</> : "Broadcast Live Advert"}
              </Button>
            </form>
          </div>

          {/* Active Broadcast Tracking Grid Table Column */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm xl:col-span-2 space-y-4">
            <div className="flex items-center gap-2 border-b pb-3 border-slate-100">
              
              <h2 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Active Broadcast Streams</h2>
            </div>

            {broadcasts.length === 0 ? (
              <div className="text-center py-16 text-slate-400 border border-dashed rounded-2xl text-xs">No active promotions are currently loaded in the system dashboard.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                      <th className="p-3">Restaurant Name</th>
                      <th className="p-3">Campaign Headline</th>
                      <th className="p-3">Uploaded Image Backdrop</th>
                      <th className="p-3">Expiration Date</th>
                      <th className="p-3 text-center">Status Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-slate-700 font-medium">
                    {broadcasts.map((promo, idx) => {
                      const isUploadedImage = promo.bgGradient?.startsWith("http://") || promo.bgGradient?.startsWith("https://");
                      
                      return (
                        <tr key={promo.id || idx} className={`hover:bg-slate-50/50 transition-colors ${!promo.isActive ? 'opacity-50 bg-slate-50/40' : ''}`}>
                          <td className="p-3 font-bold text-slate-900">{promo.business?.name || `ID: ${promo.businessId}`}</td>
                          <td className="p-3">{promo.title}</td>
                          <td className="p-3">
                            <div 
                              className={`h-12 w-32 rounded-xl bg-cover bg-center border text-white font-extrabold text-[10px] shadow-sm relative overflow-hidden flex flex-col justify-center p-1 text-center ${!isUploadedImage ? `bg-gradient-to-r ${promo.bgGradient}` : ''}`} 
                              style={isUploadedImage ? { backgroundImage: `url(${promo.bgGradient})` } : {}}
                            >
                              <div className="absolute inset-0 bg-black/40 z-0" />
                              <p className="relative z-10 tracking-tight leading-tight truncate px-1 font-black uppercase text-white">{promo.title}</p>
                              <p className="relative z-10 text-[8px] opacity-75 truncate px-1 font-normal text-white">{promo.desc || ""}</p>
                            </div>
                          </td>
                          <td className="p-3 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> 
                              {promo.expiresAt ? new Date(promo.expiresAt).toLocaleString([], {hour: '2-digit', minute:'2-digit', month:'short', day:'numeric'}) : 'N/A'}
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleActiveStatus(promo.id, promo.isActive)}
                              className={`px-3 py-1.5 rounded-xl font-bold text-xs inline-flex items-center gap-1 transition-all ${
                                promo.isActive 
                                  ? 'bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100' 
                                  : 'bg-emerald-50 border border-emerald-100 text-emerald-600 hover:bg-emerald-100'
                              }`}
                            >
                              {promo.isActive ? (
                                <><EyeOff className="w-3.5 h-3.5" /> Deactivate</>
                              ) : (
                                <><Eye className="w-3.5 h-3.5" /> Activate</>
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
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

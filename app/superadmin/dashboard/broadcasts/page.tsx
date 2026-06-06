'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/app/superadmin/dashboard/components/sidebar';
import { Loader2 } from 'lucide-react';

import { PendingAdvertsList } from '@/app/superadmin/dashboard/components/pending-adverts-list';
import { AdvertSanitizerPanel } from '@/app/superadmin/dashboard/components/advert-sanitizer-panel';
import { CreateBannerForm } from '@/app/superadmin/dashboard/components/create-banner-form';
import { ActiveBroadcastsTable } from '@/app/superadmin/dashboard/components/active-broadcasts-table';

export default function AdminBroadcastPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [approvedBusinesses, setApprovedBusinesses] = useState<any[]>([]);

  // Vendor Advert States
  const [pendingAdverts, setPendingAdverts] = useState<any[]>([]);
  const [selectedAdvert, setSelectedAdvert] = useState<any | null>(null);
  const [sanitizedSubject, setSanitizedSubject] = useState('');
  const [sanitizedContent, setSanitizedContent] = useState('');
  const [targetRole, setTargetRole] = useState('all');

  // Form Inputs
  const [targetBusinessId, setTargetBusinessId] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [durationHours, setDurationHours] = useState('24');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    async function initPage() {
      setLoading(true);
      await Promise.all([
        fetchActiveBroadcasts(),
        fetchApprovedRestaurants(),
        fetchPendingAdverts()
      ]);
      setLoading(false);
    }
    initPage();
  }, []);

 

const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  return localStorage.getItem('admin_token') || 
         localStorage.getItem('authToken') || 
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
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (json.success && Array.isArray(json.businesses)) setApprovedBusinesses(json.businesses);
    } catch (err) {
      console.error(err);
    }
  };

 // Inside page.tsx

const fetchActiveBroadcasts = async () => {
  try {
    const token = getAuthToken(); // 💡 Grab the token from LocalStorage
    if (!token) return;

    const res = await fetch(`${API_BASE_URL}/admin/broadcasts/active`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}` // 💡 Add this header configuration block
      }
    });
    
    const json = await res.json();
    if (json.success) {
      setBroadcasts(json.data || []);
    }
  } catch (err) {
    console.error("Failed to load active promotions:", err);
  }
};


  const fetchPendingAdverts = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;
      // Inside your frontend page.tsx -> fetchPendingAdverts function:
const res = await fetch(`${API_BASE_URL}/admin/broadcasts/pending-adverts`, {
  headers: { 'Authorization': `Bearer ${token}` }
});

      const json = await res.json();
      if (json.success) setPendingAdverts(json.threads || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectAdvert = (advert: any) => {
    setSelectedAdvert(advert);
    setSanitizedSubject(advert.subject || '');
    setSanitizedContent(advert.content || '');
    setTargetRole(advert.targetRole || 'all');
  };

  const handleSanitizeAndApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdvert) return;
    setSubmitting(true);
    try {
      const token = getAuthToken();
      // Inside your frontend page.tsx -> handleSanitizeAndApprove function:
const response = await fetch(`${API_BASE_URL}/admin/advert/${selectedAdvert.id}/approve`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ sanitizedSubject, sanitizedContent, targetRole })
});

      if (response.ok) {
        alert("Advert approved and broadcasted!");
        setSelectedAdvert(null);
        fetchPendingAdverts();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetBusinessId || !title || !desc || !selectedFile) return;
    setSubmitting(true);
    try {
      const token = getAuthToken();
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
      if (response.ok) {
        setTargetBusinessId('');
        setTitle('');
        setDesc('');
        setSelectedFile(null);
        setPreviewUrl(null);
        fetchActiveBroadcasts();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActiveStatus = async (id: number, currentStatus: boolean) => {
    try {
      const token = getAuthToken();
      if (!token) return;
      const res = await fetch(`${API_BASE_URL}/admin/broadcasts/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      if (res.ok) {
        setBroadcasts(prev => prev.map(item => item.id === id ? { ...item, isActive: !currentStatus } : item));
      }
    } catch (err) {
      console.error(err);
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
      <main className="flex-1 overflow-auto p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">Advert Broadcasts</h1>
          <p className="text-slate-600 mt-2">Upload custom image promotional artwork to deploy instantly.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <PendingAdvertsList 
            pendingAdverts={pendingAdverts} 
            selectedAdvert={selectedAdvert} 
            onSelectAdvert={handleSelectAdvert} 
          />
          <AdvertSanitizerPanel 
            selectedAdvert={selectedAdvert}
            sanitizedSubject={sanitizedSubject}
            setSanitizedSubject={setSanitizedSubject}
            sanitizedContent={sanitizedContent}
            setSanitizedContent={setSanitizedContent}
            submitting={submitting}
            onCancel={() => setSelectedAdvert(null)}
            onSubmit={handleSanitizeAndApprove}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pt-4">
          <CreateBannerForm 
            onSubmit={handleCreateBroadcast}
            targetBusinessId={targetBusinessId}
            setTargetBusinessId={setTargetBusinessId}
            approvedBusinesses={approvedBusinesses}
            title={title}
            setTitle={setTitle}
            desc={desc}
            setDesc={setDesc}
            durationHours={durationHours}
            setDurationHours={setDurationHours}
            previewUrl={previewUrl}
            selectedFile={selectedFile}
            onFileChange={handleFileChange}
            submitting={submitting}
          />
          <ActiveBroadcastsTable 
            broadcasts={broadcasts} 
            onToggleStatus={handleToggleActiveStatus} 
          />
        </div>
      </main>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/app/superadmin/dashboard/components/sidebar';
import { Loader2, Archive, ThumbsDown } from 'lucide-react';

import { PendingAdvertsList } from '@/app/superadmin/dashboard/components/pending-adverts-list';
import { AdvertSanitizerPanel } from '@/app/superadmin/dashboard/components/advert-sanitizer-panel';
import { CreateBannerForm } from '@/app/superadmin/dashboard/components/create-banner-form';
import { ActiveBroadcastsTable } from '@/app/superadmin/dashboard/components/active-broadcasts-table';
import { AdminActiveBroadcastsTable } from '../components/AdminActiveBroadcastsTable';

export default function AdminBroadcastPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [approvedBusinesses, setApprovedBusinesses] = useState<any[]>([]);
  const [pendingAdverts, setPendingAdverts] = useState<any[]>([]);
  
  // 🚀 NEW STATE: Stores historical rejection records log data
  const [rejectedHistory, setRejectedHistory] = useState<any[]>([]);

  const [selectedAdvert, setSelectedAdvert] = useState<any | null>(null);
  const [sanitizedSubject, setSanitizedSubject] = useState('');
  const [sanitizedContent, setSanitizedContent] = useState('');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    async function initPage() {
      setLoading(true);
      await Promise.all([
        fetchActiveBroadcasts(),
        fetchApprovedRestaurants(),
        fetchPendingAdverts(),
        fetchRejectedHistory() // 🚀 Loads history entries concurrently
      ]);
      setLoading(false);
    }
    initPage();
  }, []);

  const getAuthToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('admin_token') || localStorage.getItem('authToken');
  };

  const fetchApprovedRestaurants = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;
      const res = await fetch(`${API_BASE_URL}/admin/broadcasts/approved-list`, { headers: { 'Authorization': `Bearer ${token}` } });
      const json = await res.json();
      if (json.success && Array.isArray(json.businesses)) setApprovedBusinesses(json.businesses);
    } catch (err) { console.error(err); }
  };

  const fetchActiveBroadcasts = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;
      const res = await fetch(`${API_BASE_URL}/admin/broadcasts/active`, { headers: { 'Authorization': `Bearer ${token}` } });
      const json = await res.json();
      if (json.success) setBroadcasts(json.data || []);
    } catch (err) { console.error(err); }
  };

  const fetchPendingAdverts = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;
      const res = await fetch(`${API_BASE_URL}/admin/broadcasts/pending-reviews`, { headers: { 'Authorization': `Bearer ${token}` } });
      const json = await res.json();
      if (json.success) setPendingAdverts(json.data || []);
    } catch (err) { console.error(err); }
  };

 
  const fetchRejectedHistory = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;
      const res = await fetch(`${API_BASE_URL}/admin/broadcasts/rejected-history`, { headers: { 'Authorization': `Bearer ${token}` } });
      const json = await res.json();
      if (json.success) setRejectedHistory(json.data || []);
    } catch (err) { console.error("Failed loading rejection history profiles:", err); }
  };

  const handleSelectAdvert = (advert: any) => {
    setSelectedAdvert(advert);
    setSanitizedSubject(advert.title || '');
    setSanitizedContent(advert.desc || '');
  };

  const handleSanitizeAndApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdvert) return;
    setSubmitting(true);
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/admin/broadcasts/${selectedAdvert.id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title: sanitizedSubject, desc: sanitizedContent })
      });

      if (response.ok) {
        alert("Advert approved live!");
        setSelectedAdvert(null);
        await Promise.all([fetchPendingAdverts(), fetchActiveBroadcasts(), fetchRejectedHistory()]);
      }
    } catch (err) { console.error(err); } finally { setSubmitting(false); }
  };

  const handleRejectAdvert = async () => {
    if (!selectedAdvert) return;
    if (!confirm("Are you sure you want to reject this campaign request?")) return;
    
    setSubmitting(true);
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/admin/broadcasts/${selectedAdvert.id}/reject`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        alert("Vendor advertisement request rejected.");
        setSelectedAdvert(null);
        // Refresh all elements to remove item from review column and append to archive
        await Promise.all([fetchPendingAdverts(), fetchRejectedHistory()]);
      }
    } catch (err) { console.error(err); } finally { setSubmitting(false); }
  };

 const handleAdminToggleStatus = async (id: number, currentStatus: boolean) => {
  try {
    const token = getAuthToken();
    if (!token) return;

    const nextStatusState = !currentStatus;

    //Points directly to your master admin route endpoint
    const res = await fetch(`${API_BASE_URL}/admin/broadcasts/${id}/toggle`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ isActive: nextStatusState }),
    });

    if (res.ok) {
      setBroadcasts((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isActive: nextStatusState } : item))
      );
    } else {
      alert("Failed to alter system advertisement visibility.");
    }
  } catch (err) {
    console.error(err);
  }
};


// 1. Add this function body context inside your AdminBroadcastPage component:
const handleAdminDeleteCampaign = async (id: number) => {
  if (!confirm("⚠️ WARNING: This will permanently delete this marketing ad row from the system database. Proceed?")) return;

  try {
    const token = getAuthToken();
    if (!token) return;

    const res = await fetch(`${API_BASE_URL}/admin/broadcasts/${id}`, {
      method: "DELETE",
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.ok) {
      alert("Campaign permanently deleted.");
      // Instantly pop the deleted row out of your local array to refresh UI state
      setBroadcasts((prev) => prev.filter((item) => item.id !== id));
    } else {
      alert("Failed to delete campaign row.");
    }
  } catch (err) {
    console.error("Purge Error:", err);
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
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">Advert Tasks Desk</h1>
          <p className="text-slate-600 mt-2">Manage pending vendor promotional graphics and view rejection history.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <PendingAdvertsList pendingAdverts={pendingAdverts} selectedAdvert={selectedAdvert} onSelectAdvert={handleSelectAdvert} />
          <AdvertSanitizerPanel 
            selectedAdvert={selectedAdvert}
            sanitizedSubject={sanitizedSubject} setSanitizedSubject={setSanitizedSubject}
            sanitizedContent={sanitizedContent} setSanitizedContent={setSanitizedContent}
            submitting={submitting} onCancel={() => setSelectedAdvert(null)}
            onSubmit={handleSanitizeAndApprove} onReject={handleRejectAdvert}
          />
        </div>

      
        <AdminActiveBroadcastsTable
          broadcasts={broadcasts}
          onToggleStatus={handleAdminToggleStatus} 
          onDeleteClick={handleAdminDeleteCampaign} 
        />

      </main>
    </div>
  );
}

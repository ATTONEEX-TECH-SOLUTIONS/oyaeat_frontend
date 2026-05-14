'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Save, MapPin, Clock, Bell, Camera, ImagePlus,
  Loader2, CheckCircle2, AlertCircle, Store, Globe,
  ChevronRight, User2,
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

function authHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function getBusinessId(): number | null {
  try {
    const raw = localStorage.getItem('dashboard');
    if (!raw) return null;
    return JSON.parse(raw)?.businesses?.[0]?.id ?? null;
  } catch { return null; }
}

interface NotificationSettings {
  newOrders: boolean; orderUpdates: boolean;
  systemAlerts: boolean; promotions: boolean;
}

interface Settings {
  businessId: number | null;
  businessName: string; email: string; phone: string;
  streetAddress: string; city: string; state: string;
  zipCode: string; country: string; description: string;
  websiteUrl: string; openingHour: string; closingHour: string;
  deliveryRadius: number; minimumOrder: number; deliveryFee: number;
  thumbnailUrl: string | null; profilePicUrl: string | null;
  notifications: NotificationSettings;
}

const DEFAULT: Settings = {
  businessId: null, businessName: '', email: '', phone: '',
  streetAddress: '', city: '', state: '', zipCode: '', country: '',
  description: '', websiteUrl: '', openingHour: '10:00', closingHour: '23:00',
  deliveryRadius: 5, minimumOrder: 0, deliveryFee: 0,
  thumbnailUrl: null, profilePicUrl: null,
  notifications: { newOrders: true, orderUpdates: true, systemAlerts: true, promotions: false },
};

type TabId = 'profile' | 'hours' | 'delivery' | 'notifications';

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'profile',       label: 'Profile',      icon: <Store className="w-4 h-4" /> },
  { id: 'hours',         label: 'Hours',         icon: <Clock className="w-4 h-4" /> },
  { id: 'delivery',      label: 'Delivery',      icon: <MapPin className="w-4 h-4" /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
];

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#5a8a6a' }}>
      {children}
    </label>
  );
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props}
      className="w-full px-4 py-3 rounded-xl text-sm border-2 outline-none transition-all duration-150 focus:border-[#2e7d32] bg-card"
      style={{ borderColor: '#ddeee0', color: '#1a3d20', ...(props.style ?? {}) }}
    />
  );
}

function Textarea({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea {...props}
      className="w-full px-4 py-3 rounded-xl text-sm border-2 outline-none transition-all duration-150 focus:border-[#2e7d32] bg-card resize-none"
      style={{ borderColor: '#ddeee0', color: '#1a3d20' }}
    />
  );
}

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 pb-3 mb-1 border-b" style={{ borderColor: '#ddeee0' }}>
      <span style={{ color: '#2e7d32' }}>{icon}</span>
      <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: '#1a5c2a', fontFamily: "'Montserrat', sans-serif" }}>
        {children}
      </h2>
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [tab, setTab]           = useState<TabId>('profile');
  const [audioVol, setAudioVol] = useState<number>(50);
  const [toast, setToast]       = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [thumbUploading, setThumbUploading] = useState(false);
  const [picUploading, setPicUploading]     = useState(false);
  const [thumbPreview, setThumbPreview]     = useState<string | null>(null);
  const [picPreview, setPicPreview]         = useState<string | null>(null);
  const thumbRef = useRef<HTMLInputElement>(null);
  const picRef   = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = getBusinessId();
    if (!id) { setLoading(false); return; }
    fetch(`${API}/vendor/business/${id}/settings`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : null)
      .then(j => { if (j?.data) setSettings({ ...DEFAULT, ...j.data }); })
      .catch(() => flash('error', 'Could not load settings.'))
      .finally(() => setLoading(false));
      
    const volStr = localStorage.getItem('vendor_audio_volume');
    if (volStr !== null) setAudioVol(Math.round(parseFloat(volStr) * 100));
  }, []);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setAudioVol(val);
    localStorage.setItem('vendor_audio_volume', (val / 100).toString());
  };

  function flash(type: 'success' | 'error', msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, section?: 'notifications') {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    if (section === 'notifications') {
      setSettings(p => ({ ...p, notifications: { ...p.notifications, [name]: type === 'checkbox' ? checked : value } }));
    } else {
      setSettings(p => ({ ...p, [name]: value }));
    }
  }

  async function handleSave() {
    if (!settings.businessId) return flash('error', 'No business found.');
    setSaving(true);
    try {
      const r = await fetch(`${API}/vendor/business/${settings.businessId}/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(settings),
      });
      if (!r.ok) throw new Error();
      flash('success', 'Settings saved!');
    } catch { flash('error', 'Failed to save.'); }
    finally { setSaving(false); }
  }

  async function uploadImage(
    file: File, endpoint: 'thumbnail' | 'profile-pic',
    field: 'thumbnail' | 'profilePic',
    setUploading: (v: boolean) => void,
    setPreview: (u: string) => void,
    key: 'thumbnailUrl' | 'profilePicUrl'
  ) {
    if (!settings.businessId) return flash('error', 'No business found.');
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    const form = new FormData();
    form.append(field, file);
    try {
      const r = await fetch(`${API}/vendor/business/${settings.businessId}/settings/${endpoint}`, {
        method: 'POST', headers: authHeaders(), body: form,
      });
      if (!r.ok) throw new Error();
      const j = await r.json();
      setSettings(p => ({ ...p, [key]: j[key] }));
      flash('success', 'Image updated!');
    } catch { flash('error', 'Upload failed.'); }
    finally { setUploading(false); }
  }

  if (loading) return (
    <div className="w-full h-full flex items-center justify-center" style={{ minHeight: '100vh', backgroundColor: '#f0f7f1' }}>
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#1a5c2a' }} />
    </div>
  );

  const thumbSrc = thumbPreview || settings.thumbnailUrl;
  const picSrc   = picPreview   || settings.profilePicUrl;

  return (
    /*
     * Fills the full <main> — no padding on this wrapper.
     * min-h-screen ensures it always covers the viewport height.
     * The inner column is max-w-3xl and centred with mx-auto + px padding.
     */
    <div className="w-full min-h-screen" style={{ backgroundColor: '#f0f7f1' }}>

      {/* Toast */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold"
          style={{
            backgroundColor: toast.type === 'success' ? '#1a5c2a' : '#b91c1c',
            color: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          }}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* ── Centred content column ── */}
      <div className="w-full  px-6 py-8 space-y-5">

        {/* ══ Hero card ══ */}
        <div className="w-full rounded-2xl overflow-hidden"
          style={{ backgroundColor: '#ffffff', border: '1px solid #ddeee0', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>

          {/* Banner */}
          <div className="relative w-full cursor-pointer group" style={{ height: '168px', backgroundColor: '#c8e6c9' }}
            onClick={() => thumbRef.current?.click()}>
            {thumbSrc
              ? <img src={thumbSrc} alt="banner" className="w-full h-full object-cover" />
              : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2" style={{ color: '#4a7c59' }}>
                  <ImagePlus className="w-6 h-6" />
                  <span className="text-xs font-bold uppercase tracking-widest">Upload Banner</span>
                </div>
              )}
            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              {thumbUploading ? <Loader2 className="w-7 h-7 text-white animate-spin" /> : <Camera className="w-7 h-7 text-white" />}
            </div>
            <input ref={thumbRef} type="file" accept="image/*" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f, 'thumbnail', 'thumbnail', setThumbUploading, setThumbPreview, 'thumbnailUrl'); }} />
          </div>

          {/* Profile strip */}
          <div className="px-8 pb-6" style={{ marginTop: '-44px' }}>
            <div className="flex items-end gap-5">

              {/* Avatar — 88px circle */}
              <div
                className="relative flex-shrink-0 cursor-pointer group"
                style={{
                  width: '88px', height: '88px', borderRadius: '50%',
                  overflow: 'hidden', border: '4px solid #ffffff',
                  backgroundColor: '#2e7d32', boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
                  flexShrink: 0,
                }}
                onClick={() => picRef.current?.click()}
              >
                {picSrc
                  ? <img src={picSrc} alt="logo" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center"><User2 className="w-10 h-10 text-white/80" /></div>}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: '50%' }}>
                  {picUploading ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Camera className="w-5 h-5 text-white" />}
                </div>
                <input ref={picRef} type="file" accept="image/*" className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f, 'profile-pic', 'profilePic', setPicUploading, setPicPreview, 'profilePicUrl'); }} />
              </div>

              {/* Name + city */}
              <div className="flex-1 min-w-0 pb-1">
                <p className="text-lg font-bold truncate" style={{ color: '#1a3d20', fontFamily: "'Montserrat', sans-serif" }}>
                  {settings.businessName || 'Your Restaurant'}
                </p>
                <p className="text-xs mt-0.5 truncate" style={{ color: '#5a8a6a' }}>
                  {settings.city && settings.state ? `${settings.city}, ${settings.state}` : 'Set your location below'}
                </p>
              </div>

              {/* Quick save */}
              <button onClick={handleSave} disabled={saving}
                className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60"
                style={{ backgroundColor: '#1a5c2a', boxShadow: '0 2px 8px rgba(26,92,42,0.25)' }}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>

        {/* ══ Tab nav ══ */}
        <div className="w-full flex gap-1 p-1 rounded-2xl" style={{ backgroundColor: '#ddeee0' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-150"
              style={tab === t.id
                ? { backgroundColor: '#ffffff', color: '#1a5c2a', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }
                : { color: '#4a7c59' }}>
              {t.icon}<span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* ══ Tab panel ══ */}
        <div className="w-full rounded-2xl"
          style={{ backgroundColor: '#ffffff', border: '1px solid #ddeee0', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>

          {/* PROFILE */}
          {tab === 'profile' && (
            <div className="p-8 space-y-6">
              <SectionTitle icon={<Store className="w-4 h-4" />}>Restaurant Information</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div><Label>Restaurant Name</Label><Input name="businessName" value={settings.businessName} onChange={handleChange} /></div>
                <div><Label>Email</Label><Input type="email" name="email" value={settings.email} onChange={handleChange} /></div>
                <div><Label>Phone</Label><Input type="tel" name="phone" value={settings.phone} onChange={handleChange} /></div>
                <div><Label>Country</Label><Input name="country" value={settings.country} onChange={handleChange} /></div>
              </div>
              <div><Label>Street Address</Label><Input name="streetAddress" value={settings.streetAddress} onChange={handleChange} /></div>
              <div className="grid grid-cols-3 gap-5">
                <div><Label>City</Label><Input name="city" value={settings.city} onChange={handleChange} /></div>
                <div><Label>State</Label><Input name="state" value={settings.state} onChange={handleChange} /></div>
                <div><Label>Zip Code</Label><Input name="zipCode" value={settings.zipCode} onChange={handleChange} /></div>
              </div>
              <div>
                <Label>Website <span className="normal-case font-normal opacity-60">(optional)</span></Label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#5a8a6a' }} />
                  <Input name="websiteUrl" value={settings.websiteUrl} onChange={handleChange} placeholder="https://" style={{ paddingLeft: '2.25rem' }} />
                </div>
              </div>
              <div><Label>Description</Label><Textarea name="description" value={settings.description} onChange={handleChange} rows={3} /></div>
            </div>
          )}

          {/* HOURS */}
          {tab === 'hours' && (
            <div className="p-8 space-y-6">
              <SectionTitle icon={<Clock className="w-4 h-4" />}>Operating Hours</SectionTitle>
              <div className="grid grid-cols-2 gap-5">
                <div><Label>Opening Time</Label><Input type="time" name="openingHour" value={settings.openingHour} onChange={handleChange} /></div>
                <div><Label>Closing Time</Label><Input type="time" name="closingHour" value={settings.closingHour} onChange={handleChange} /></div>
              </div>
              <div className="flex items-center justify-between px-5 py-4 rounded-xl" style={{ backgroundColor: '#f0f7f1', border: '1px solid #ddeee0' }}>
                <span className="text-sm font-semibold" style={{ color: '#1a5c2a' }}>Open window</span>
                <span className="flex items-center gap-2 text-sm font-bold" style={{ color: '#2e7d32' }}>
                  {settings.openingHour} <ChevronRight className="w-4 h-4 opacity-40" /> {settings.closingHour}
                </span>
              </div>
            </div>
          )}

          {/* DELIVERY */}
          {tab === 'delivery' && (
            <div className="p-8 space-y-6">
              <SectionTitle icon={<MapPin className="w-4 h-4" />}>Delivery Settings</SectionTitle>
              <div className="grid grid-cols-3 gap-5">
                <div><Label>Radius (km)</Label><Input type="number" name="deliveryRadius" value={settings.deliveryRadius} onChange={handleChange} /></div>
                <div><Label>Min Order (₦)</Label><Input type="number" name="minimumOrder" value={settings.minimumOrder} step="0.01" onChange={handleChange} /></div>
                <div><Label>Delivery Fee (₦)</Label><Input type="number" name="deliveryFee" value={settings.deliveryFee} step="0.01" onChange={handleChange} /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Radius', value: `${settings.deliveryRadius} km` },
                  { label: 'Min Order', value: `₦${settings.minimumOrder}` },
                  { label: 'Fee', value: `₦${settings.deliveryFee}` },
                ].map(c => (
                  <div key={c.label} className="rounded-xl p-4 text-center" style={{ backgroundColor: '#f0f7f1', border: '1px solid #ddeee0' }}>
                    <p className="text-xl font-bold" style={{ color: '#1a5c2a' }}>{c.value}</p>
                    <p className="text-[10px] uppercase tracking-widest font-semibold mt-1" style={{ color: '#5a8a6a' }}>{c.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {tab === 'notifications' && (
            <div className="p-8 space-y-4">
              <SectionTitle icon={<Bell className="w-4 h-4" />}>Notification Preferences</SectionTitle>
              <div className="space-y-3">
                {(Object.entries(settings.notifications) as [keyof NotificationSettings, boolean][]).map(([key, val]) => (
                  <label key={key}
                    className="flex items-center justify-between px-5 py-4 rounded-xl cursor-pointer transition-all border-2"
                    style={{ backgroundColor: val ? '#f0f7f1' : '#fafafa', borderColor: val ? '#a5d6a7' : '#eeeeee' }}>
                    <div>
                      <p className="text-sm font-semibold capitalize" style={{ color: '#1a3d20' }}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: '#5a8a6a' }}>
                        {key === 'newOrders'    && 'Get notified when a new order arrives'}
                        {key === 'orderUpdates' && 'Updates on existing order status changes'}
                        {key === 'systemAlerts' && 'Important system and security alerts'}
                        {key === 'promotions'   && 'Marketing tips and promotional suggestions'}
                      </p>
                    </div>
                    <div className="relative flex-shrink-0 ml-6 cursor-pointer" style={{ width: '44px', height: '24px' }}
                      onClick={() => setSettings(p => ({ ...p, notifications: { ...p.notifications, [key]: !val } }))}>
                      <div className="w-full h-full rounded-full transition-colors duration-200" style={{ backgroundColor: val ? '#1a5c2a' : '#d1d5db' }} />
                      <div className="absolute top-0.5 w-5 h-5 bg-card rounded-full shadow transition-transform duration-200"
                        style={{ left: '2px', transform: val ? 'translateX(20px)' : 'translateX(0)' }} />
                    </div>
                  </label>
                ))}
                
                <div className="pt-5 mt-5 border-t border-gray-100 dark:border-gray-800">
                  <Label>Alert System Volume</Label>
                  <p className="text-xs text-gray-500 mb-4">Adjust the loudness of the new order double-chime.</p>
                  <div className="flex items-center gap-4">
                    <input 
                      type="range" min="0" max="100" 
                      value={audioVol} 
                      onChange={handleVolumeChange} 
                      className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer" 
                      style={{ accentColor: '#1a5c2a' }}
                    />
                    <span className="text-sm font-bold w-9 text-right" style={{ color: '#1a5c2a' }}>{audioVol}%</span>
                    <button 
                      onClick={() => {
                        try {
                          const audioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
                          const audioCtx = new audioCtxClass();
                          const osc = audioCtx.createOscillator();
                          const gainNode = audioCtx.createGain();
                          osc.connect(gainNode);
                          gainNode.connect(audioCtx.destination);
                          osc.type = 'sine';
                          osc.frequency.setValueAtTime(800, audioCtx.currentTime);
                          osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
                          gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
                          gainNode.gain.linearRampToValueAtTime(audioVol / 100, audioCtx.currentTime + 0.05);
                          gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
                          osc.start(audioCtx.currentTime);
                          osc.stop(audioCtx.currentTime + 0.3);
                        } catch(e) {}
                      }}
                      className="px-4 py-2 text-xs font-bold rounded-xl border-2 hover:bg-gray-50 transition-colors"
                      style={{ borderColor: '#ddeee0', color: '#1a5c2a' }}
                    >
                      Test
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ══ Bottom save bar ══ */}
        <div className="w-full flex items-center justify-between px-6 py-4 rounded-2xl mb-8"
          style={{ backgroundColor: '#ffffff', border: '1px solid #ddeee0', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          <p className="text-xs" style={{ color: '#5a8a6a' }}>
            Changes apply to all customers immediately after saving.
          </p>
          <div className="flex gap-3">
            <button onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all hover:bg-gray-50"
              style={{ borderColor: '#ddeee0', color: '#4a7c59' }}>
              Discard
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60"
              style={{ backgroundColor: '#1a5c2a', boxShadow: '0 2px 8px rgba(26,92,42,0.25)' }}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
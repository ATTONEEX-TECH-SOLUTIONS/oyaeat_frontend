'use client';

import React from 'react';
import { PlusCircle, Store, ImageIcon, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CreateBannerFormProps {
  onSubmit: (e: React.FormEvent) => void;
  targetBusinessId: string;
  setTargetBusinessId: (val: string) => void;
  approvedBusinesses: any[];
  title: string;
  setTitle: (val: string) => void;
  desc: string;
  setDesc: (val: string) => void;
  durationHours: string;
  setDurationHours: (val: string) => void;
  previewUrl: string | null;
  selectedFile: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  submitting: boolean;
}

export function CreateBannerForm({
  onSubmit,
  targetBusinessId,
  setTargetBusinessId,
  approvedBusinesses,
  title,
  setTitle,
  desc,
  setDesc,
  durationHours,
  setDurationHours,
  previewUrl,
  selectedFile,
  onFileChange,
  submitting
}: CreateBannerFormProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm xl:col-span-1 space-y-5">
      <div className="flex items-center gap-2 border-b pb-3 border-slate-100">
        <PlusCircle className="text-[#2d5f4f] w-5 h-5" />
        <h2 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">New Banner Campaign</h2>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
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
              <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
            </label>
          </div>
        </div>

        <Button type="submit" disabled={submitting} className="w-full bg-[#2e7d32] hover:bg-[#1b5e20] text-white rounded-xl h-11 font-bold mt-4 shadow-sm transition-colors">
          {submitting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Dispatching Asset Cargo...</> : "Broadcast Live Advert"}
        </Button>
      </form>
    </div>
  );
}

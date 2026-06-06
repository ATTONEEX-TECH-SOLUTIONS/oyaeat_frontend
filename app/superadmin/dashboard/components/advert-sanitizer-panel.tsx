'use client';

import React from 'react';
import { Megaphone, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AdvertSanitizerPanelProps {
  selectedAdvert: any | null;
  sanitizedSubject: string;
  setSanitizedSubject: (val: string) => void;
  sanitizedContent: string;
  setSanitizedContent: (val: string) => void;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function AdvertSanitizerPanel({
  selectedAdvert,
  sanitizedSubject,
  setSanitizedSubject,
  sanitizedContent,
  setSanitizedContent,
  submitting,
  onCancel,
  onSubmit
}: AdvertSanitizerPanelProps) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm xl:col-span-2 flex flex-col justify-between">
      {selectedAdvert ? (
        <form onSubmit={onSubmit} className="space-y-4 h-full flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-3 border-slate-100">
              <Sparkles className="text-orange-500 w-5 h-5" />
              <h2 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">
                Live Sanitizer Workspace
              </h2>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Edit Campaign Heading</label>
              <Input 
                value={sanitizedSubject} 
                onChange={(e) => setSanitizedSubject(e.target.value)} 
                className="rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Sanitized Copy Body (Required)</label>
              <textarea 
                value={sanitizedContent} 
                onChange={(e) => setSanitizedContent(e.target.value)} 
                rows={5}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel} 
              className="rounded-xl h-11 text-xs font-bold px-5"
            >
              Cancel Review
            </Button>
            <Button 
              type="submit" 
              disabled={submitting} 
              className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl h-11 text-xs font-bold px-6 shadow-sm"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sanitize & Broadcast Live'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed rounded-2xl bg-slate-50/50">
          <Megaphone className="w-8 h-8 text-slate-300 mb-2" />
          <p className="text-sm font-bold text-slate-500">No Submission File Open</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Select an advertisement draft entry from the pending column queue to initialize deep-cleaning revisions and patch it live to active feeds.
          </p>
        </div>
      )}
    </div>
  );
}

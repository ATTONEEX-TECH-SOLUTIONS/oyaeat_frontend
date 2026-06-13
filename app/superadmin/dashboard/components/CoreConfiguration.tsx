'use client';

import React from 'react';
import { Shield, Globe } from 'lucide-react';

interface CoreConfigProps {
  platformName: string;
  setPlatformName: (val: string) => void;
  supportEmail: string;
  setSupportEmail: (val: string) => void;
  webAddress: string;
  setWebAddress: (val: string) => void;
}

export function CoreConfiguration({
  platformName,
  setPlatformName,
  supportEmail,
  setSupportEmail,
  webAddress,
  setWebAddress,
}: CoreConfigProps) {
  return (
    <div className="bg-card rounded-2xl border border-gray-100 p-8 shadow-sm bg-white">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
        <Shield className="w-6 h-6 text-[#1a5c2a]" />
        <h2 className="text-xl font-bold text-gray-900">Core Configuration</h2>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#1a5c2a] mb-2">
              Platform Name
            </label>
            <input 
              type="text" 
              value={platformName} 
              onChange={e => setPlatformName(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 font-semibold outline-none focus:border-[#1a5c2a] focus:bg-white transition-all text-sm" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#1a5c2a] mb-2">
              Support Email
            </label>
            <input 
              type="email" 
              value={supportEmail} 
              onChange={e => setSupportEmail(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 font-semibold outline-none focus:border-[#1a5c2a] focus:bg-white transition-all text-sm" 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-[#1a5c2a] mb-2">
            Customer Web Address
          </label>
          <div className="relative flex items-center">
            <Globe className="absolute left-4 h-4 w-4 text-gray-400 pointer-events-none" />
            <input 
              type="text" 
              value={webAddress} 
              onChange={e => setWebAddress(e.target.value)} 
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 font-semibold outline-none focus:border-[#1a5c2a] focus:bg-white transition-all text-sm" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

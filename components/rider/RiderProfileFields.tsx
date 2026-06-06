'use client'

import React from 'react'
import { Phone, Bike, CreditCard, Save, Loader2, AlertCircle } from 'lucide-react'

// 🛡️ TYPE CONTRACT FIXED: Explicitly maps validation parameters to clear compilation blocks
interface FieldsProps {
  formData: {
    phone: string;
    vehicleType: string;
    plateNumber: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  saving: boolean;
  phoneError: string | null;
  setPhoneError: (err: string | null) => void;
}

export function RiderProfileFields({ formData, setFormData, saving, phoneError, setPhoneError }: FieldsProps) {
  
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const numericVal = rawVal.replace(/\D/g, ""); // Filter alphanumeric characters
    
    if (numericVal.length > 11) return; // Strict length max limit

    setFormData((p: any) => ({ ...p, phone: numericVal }));

    if (numericVal.length === 0) {
      setPhoneError("Phone number line is required.");
    } else if (numericVal.length !== 11) {
      setPhoneError(`Must be exactly 11 digits (Current: ${numericVal.length}/11)`);
    } else {
      setPhoneError(null);
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        
        {/* Phone Line Contact */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Phone Line Contact</label>
          <div className="relative">
            <Phone className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input 
              type="text"
              required
              placeholder="08012345678"
              value={formData.phone}
              onChange={handlePhoneInput}
              className={`w-full bg-white border rounded-lg py-1.5 pl-8 pr-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 ${
                phoneError 
                  ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/5' 
                  : 'border-slate-200 focus:border-green-600 focus:ring-green-600'
              }`}
            />
          </div>
          {phoneError && (
            <p className="text-[10px] text-red-600 font-medium flex items-center gap-1 mt-1">
              <AlertCircle className="w-3 h-3 flex-shrink-0" /> {phoneError}
            </p>
          )}
        </div>

        {/* Vehicle Category Dropdown */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Vehicle Logistics Category</label>
          <div className="relative">
            <Bike className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <select
              value={formData.vehicleType}
              onChange={(e) => setFormData((p: any) => ({ ...p, vehicleType: e.target.value }))}
              className="w-full bg-white border border-slate-200 rounded-lg py-1.5 pl-8 pr-8 text-xs focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 text-slate-900 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.6rem_auto] bg-[right_0.6rem_center] bg-no-repeat"
            >
              <option value="Motorcycle">Motorcycle (Dispatch Bike)</option>
              <option value="Bicycle">Bicycle (E-Bike)</option>
              <option value="Car">Delivery Vehicle Sedan</option>
            </select>
          </div>
        </div>

        {/* Plate Registration Number */}
        <div className="space-y-1 sm:col-span-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Plate Registration Number</label>
          <div className="relative">
            <CreditCard className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input 
              type="text"
              placeholder="e.g. LAGOS-AAA-01-AA"
              value={formData.plateNumber}
              onChange={(e) => setFormData((p: any) => ({ ...p, plateNumber: e.target.value }))}
              className="w-full bg-white border border-slate-200 rounded-lg py-1.5 pl-8 pr-2.5 text-xs font-mono tracking-wide focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 text-slate-900"
            />
          </div>
        </div>

      </div>

      {/* Action Submit Elements Bar */}
      <div className="pt-3 border-t border-slate-100 flex justify-end">
        <button
          type="submit"
          disabled={saving || !!phoneError}
          className="bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm w-full sm:w-auto justify-center"
        >
          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
          {saving ? "Saving Changes..." : "Save Configuration Changes"}
        </button>
      </div>
    </div>
  )
}

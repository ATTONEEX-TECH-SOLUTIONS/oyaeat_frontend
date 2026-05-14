"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { User, Phone, Bike, CreditCard, ShieldCheck, Loader2, Save, Camera } from "lucide-react";

export default function RiderProfileSetup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    vehicleType: "Motorcycle",
    plateNumber: ""
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchCurrentProfile = async () => {
      try {
        const token = localStorage.getItem("riderToken");
        const response = await fetch(`${API_BASE_URL}/rider/dashboard`, {
          headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setFormData({
            firstName: data.profile?.firstName || "",
            lastName: data.profile?.lastName || "",
            phone: data.profile?.phone || "", 
            vehicleType: data.profile?.vehicleType || "Motorcycle",
            plateNumber: data.profile?.plateNumber || ""
          });
          setIsVerified(!!data.profile?.isVerified);

          // Handle existing avatar visualization preview safely
          if (data.profile?.avatarUrl) {
            setPreviewUrl(data.profile.avatarUrl.startsWith("http") ? data.profile.avatarUrl : `${API_BASE_URL}${data.profile.avatarUrl}`);
          }
        }
      } catch (err) {
        console.error("Failed loading configuration profiles", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentProfile();
  }, [API_BASE_URL]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Generate temporary visual cache URL
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem("riderToken");
      
      // ── TRANSITION TO FORMDATA FOR BINARY MULTIPART FILES ──
      const dataPayload = new FormData();
      dataPayload.append("firstName", formData.firstName);
      dataPayload.append("lastName", formData.lastName);
      dataPayload.append("phone", formData.phone);
      dataPayload.append("vehicleType", formData.vehicleType);
      dataPayload.append("plateNumber", formData.plateNumber);
      
      if (selectedFile) {
        dataPayload.append("avatar", selectedFile);
      }

      const response = await fetch(`${API_BASE_URL}/rider/profile/update`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
          // Note: Do NOT include 'Content-Type': 'application/json' here.
          // The browser automatically sets the correct multi-part boundary parameters!
        },
        body: dataPayload
      });

      const resData = await response.json();
      if (response.ok) {
        alert("Profile and avatar image saved successfully!");
      } else {
        alert(resData.message || "Failed saving changes");
      }
    } catch (err) {
      console.error("Update request error", err);
    } finally {
      setSaving(false);
    }
  };

  const getInitials = () => {
    return `${formData.firstName?.substring(0, 1) || ""}${formData.lastName?.substring(0, 1) || ""}`.toUpperCase() || "R";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 bg-gray-50 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Rider Profile Setup</h2>
          <p className="text-xs text-gray-500 mt-0.5">Manage your profile image, vehicle configuration, and details.</p>
        </div>
        
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
          isVerified ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
        }`}>
          <ShieldCheck className="w-4 h-4" />
          {isVerified ? "Verified Operator Account" : "Pending Document Verification"}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* Profile Picture Upload Section Area */}
        <div className="flex flex-col items-center justify-center space-y-3 pb-4 border-b border-gray-50">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Avatar Profile Picture</label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="group relative w-24 h-24 rounded-full bg-emerald-800 border-4 border-white shadow flex items-center justify-center cursor-pointer overflow-hidden"
          >
            {previewUrl ? (
              <Image 
                src={previewUrl} 
                alt="Avatar Preview" 
                fill 
                className="object-cover group-hover:brightness-70 transition-all"
                unoptimized
              />
            ) : (
              <span className="text-white font-black text-xl tracking-wider group-hover:opacity-30 transition-opacity">
                {getInitials()}
              </span>
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <p className="text-[10px] text-gray-400">Click circle container to update JPG / PNG image</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* First Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">First Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData(p => ({ ...p, firstName: e.target.value }))}
                className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-green-600 text-gray-900"
              />
            </div>
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Last Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData(p => ({ ...p, lastName: e.target.value }))}
                className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-green-600 text-gray-900"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Phone Line Contact</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-green-600 text-gray-900"
              />
            </div>
          </div>

          {/* Vehicle Type Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Vehicle Logistics Category</label>
            <div className="relative">
              <Bike className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <select
                value={formData.vehicleType}
                onChange={(e) => setFormData(p => ({ ...p, vehicleType: e.target.value }))}
                className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-green-600 text-gray-900 appearance-none"
              >
                <option value="Motorcycle">Motorcycle (Dispatch Bike)</option>
                <option value="Bicycle">Bicycle (E-Bike)</option>
                <option value="Car">Delivery Vehicle Sedan</option>
              </select>
            </div>
          </div>

          {/* License Plate Number */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Plate Registration Number</label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                placeholder="e.g. LAGOS-AAA-01-AA"
                value={formData.plateNumber}
                onChange={(e) => setFormData(p => ({ ...p, plateNumber: e.target.value }))}
                className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-green-600 text-gray-900"
              />
            </div>
          </div>

        </div>

        {/* Action Submit Trigger */}
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3 rounded-xl shadow-sm transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Configuration Changes
          </button>
        </div>
      </form>
    </div>
  );
}
